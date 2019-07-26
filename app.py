import random

from flask import Flask, render_template
from flask_socketio import join_room, leave_room, SocketIO, send, emit

from game import Game

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

all_games = {}

@app.route('/')
def return_index():
    return render_template("index.html")

@app.route('/<id>')
def return_game(id=None):
    return render_template("game.html", id=id)


@socketio.on('join')
def on_join(data):
    room = data
    join_room(room)
    print(f'User has entered the room {room}')

@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    print(f'User has left the room {room}', room=room)

@socketio.on('load_board')
def load_game_board(json):
    game = json["game"]
    print(f"Loading board {game}")
    if game in all_games:
        cur_game = all_games[game]
        emit("render_board", {"game": str(cur_game)}, room=game)
    else:
        cur_game = Game(game, 15)
        all_games[game] = cur_game
        emit("render_board", {"game": str(cur_game)}, room=game)

if __name__ == '__main__':
    socketio.run(app, debug=True)