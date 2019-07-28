import random

from flask import Flask, render_template
from flask_socketio import join_room, leave_room, SocketIO, send, emit
import simplejson

from game import Game, State


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

all_games = {}

# App routes
@app.route('/')
def return_index():
    return render_template("index.html")

@app.route('/<id>')
def return_game(id=None):
    return render_template("game.html", id=id)

# Socket functions
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
        emit("render_board", {
            "status_code": 200,
            "message": "Game retreived",
            "payload": simplejson.dumps(cur_game, for_json=True)

        }, room=game_name)
    else:
        cur_game = Game(game_name)
        all_games[game] = cur_game
        emit("render_board", {
            "status_code": 200,
            "message": "New game created",
            "payload": simplejson.dumps(cur_game, for_json=True)
        }, room=game_name)

@socketio.on('start_turn')
def start_turn(json):
    game_name = json["name"]
    game = all_games[game_name]

    if game.state != State.IDLE:
        emit_error(game_name, "Invalid game state for start turn")

    # Make sure the game is in a consistent start state


if __name__ == '__main__':
    socketio.run(app, debug=True)