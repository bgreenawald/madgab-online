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

@socketio.on('load_board')
def load_board(json):
    """Loads the current game board, or creates on if none exists.

    Args:
        json (dict): dictionary with parameter called 'game'.
    """
    try:
        game = json["name"]
    except KeyError:
        emit("render_board", {
            "status_code": 400,
            "message": "'name' not supplied",
            "payload": {}

        }, room=game)
        return

    print(f"Loading board {game}")
    if game in all_games:
        cur_game = all_games[game]
        emit("render_board", {
            "status_code": 200,
            "message": "Game retreived",
            "payload": simplejson.dumps(cur_game, for_json=True)

        }, room=game)
    else:
        cur_game = Game(game)
        all_games[game] = cur_game
        emit("render_board", {
            "status_code": 200,
            "message": "New game created",
            "payload": {
                simplejson.dumps(cur_game, for_json=True)
            }
        }, room=game)


if __name__ == '__main__':
    socketio.run(app, debug=True)