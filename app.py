import atexit
import datetime
import random

from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, render_template, json
from flask_socketio import join_room, leave_room, SocketIO, send, emit
import simplejson
from flask_scss import Scss

from game import InvalidState, Game, State


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# app.wsgi_app = SassMiddleware(app.wsgi_app, {
#     'app': ('static/sass', 'static/css', '/static/css')
# })
app.debug = True
Scss(app, static_dir='static/styles/css', asset_dir='static/styles/scss')

all_games = {}

# ---------------------------------------
# App routes
# ---------------------------------------

@app.route('/')
def return_index():
    return render_template("index.html")

@app.route('/<id>')
def return_game(id=None):
    return render_template("game.html", id=id)

@app.route("/api/get_names")
def get_names():
    ids = [x for x in all_games]
    print(ids)
    return json.jsonify({
        "ids": ids
    })

# ---------------------------------------
# Socket functions
# ---------------------------------------

@socketio.on('join')
def on_join(data):
    """Joins the connection to the provided room
    Args:
        data (str): Name of the room.
    """
    room = data
    join_room(room)
    print(f'User has entered the room {room}')
    print(f'{socketio.server.rooms}')

@socketio.on('leave')
def on_leave(data):
    """Removes the current connection from the room.
    Args:
        data (str): Name of the room.
    """
    room = data['room']
    leave_room(room)
    print(f'User has left the room {room}', room=room)

def emit_error(game, msg):
    emit("render_board", {
        "status_code": 400,
        "message": msg,
        "payload": {}
    }, room=game)

def emit_board(game_name, game, msg):
    emit("render_board", {
        "status_code": 200,
        "message": msg,
        "payload": simplejson.dumps(game, for_json=True)

    }, room=game_name)

@socketio.on('load_board')
def load_board(json):
    """Loads the current game board, or creates on if none exists.
    Args:
        json (dict): dictionary with parameter called 'game'.
    """
    game_name = json["name"]

    print(f"Loading board {game_name}")
    if game_name in all_games:
        cur_game = all_games[game_name]
        emit_board(game_name, cur_game, "Game retrieved")
    else:
        cur_game = Game(game_name)
        all_games[game_name] = cur_game
        emit_board(game_name, cur_game, "New game created")

@socketio.on('start_turn')
def start_turn(json):
    if "name" not in json:
        print("Could not find the given board.")
        return

    game_name = json["name"]
    game = all_games[game_name]

    try:
        game.start_turn()
    except InvalidState as e:
        emit_error(str(e))
    else:
        emit_board(game_name, game, "Started turn")

@socketio.on('reset_game')
def reset_game(json):
    if "name" not in json:
        print("Could not find the given board.")
        return

    game_name = json["name"]
    game = all_games[game_name]

    game.reset(game_name)
    emit_board(game_name, game, "Game reset")

@socketio.on('new_phrase')
def new_phrase(json):
    if "name" not in json:
        print("Could not find the given board.")
        return


    game_name = json["name"]
    game = all_games[game_name]

    if "correct" not in json:
        emit_error(game_name, "'correct' not in request")

    try:
        game.increment_active_state(json["correct"])
        emit_board(game_name, game, "New phrase generated")
    except InvalidState as e:
        emit_error(game_name, str(e))

@socketio.on('end_turn')
def end_turn(json):
    if "name" not in json:
        print("Could not find the given board.")
        return


    game_name = json["name"]
    game = all_games[game_name]

    if "correct" not in json:
        emit_error(game_name, "'correct' not in request")
        return
    elif "time_left" not in json:
        emit_error(game_name, "'time_left' not in request")
        return

    try:
        game.end_active_state(json["correct"], json["time_left"])
        emit_board(game_name, game, "Active state ended")
    except InvalidState as e:
        emit_error(game_name, str(e))

@socketio.on('steal')
def steal(json):
    if "name" not in json:
        print("Could not find the given board.")
        return


    game_name = json["name"]
    game = all_games[game_name]

    if "points" not in json:
        emit_error(game_name, "'points' not in request")
        return

    try:
        game.steal(json["points"])
        emit_board(game_name, game, "Points stolen")
    except InvalidState as e:
        emit_error(game_name, str(e))

@socketio.on('toggle_difficulty')
def toggle_difficulty(json):
    if "name" not in json:
        print("Could not find the given board.")
        return

    game_name = json["name"]
    game = all_games[game_name]

    game.toggle_difficulty()
    emit_board(game_name, game, "Difficulty toggled")

# ---------------------------------------
# Other functions
# ---------------------------------------

# Schedule cleanup
def delete_old_games():
    for game in all_games:
        age = datetime.datetime.now() - all_games[game].date_created
        if age.total_seconds() > 86400:
            del all_games[game]

scheduler = BackgroundScheduler()
scheduler.add_job(func=delete_old_games, trigger="interval", seconds=3600)
scheduler.start()

# Shutdown your cron thread if the web process is stopped
atexit.register(lambda: scheduler.shutdown())

if __name__ == '__main__':
    socketio.run(app, debug=True)