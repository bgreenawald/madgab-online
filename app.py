import atexit
import datetime
import logging
import os
from typing import Any, Dict

import simplejson
from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, render_template, json, Response
from flask_cors import CORS
from flask_scss import Scss
from flask_socketio import join_room, leave_room, SocketIO, emit

from game import InvalidState, Game

# Initialize the application
app = Flask(__name__)
app.debug = True
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)

# Setup logging
if not os.path.isdir("logs"):
    os.makedirs("logs")
logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")
handler = logging.FileHandler("logs/app.log")
handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.addHandler(handler)


# Initialize CORS and styling
CORS(app)
# app.wsgi_app = SassMiddleware(app.wsgi_app, {
#     'app': ('static/sass', 'static/css', '/static/css')
# })
Scss(app, static_dir="static/styles/css", asset_dir="static/styles/scss")

# Dictionary to hold all games
all_games: Dict[str, Game] = {}

# ---------------------------------------
# App routes
# ---------------------------------------


@app.route("/")
def return_index() -> str:
    return render_template("index.html")


@app.route("/<id>")
def return_game(id: str) -> str:
    return render_template("game.html", id=id)


@app.route("/test/<id>")
def return_game_test(id: str) -> str:
    return render_template("game2.html", id=id)


@app.route("/api/get_names")
def get_names() -> Response:
    ids = [x for x in all_games]
    return json.jsonify({"ids": ids})


# ---------------------------------------
# Socket functions
# ---------------------------------------


@socketio.on("join")
def on_join(room):
    """Joins the connection to the provided room
    Args:
        room (str): Name of the room.
    """
    join_room(room)
    logger.info(f"A user has entered the room {room}")


@socketio.on("leave")
def on_leave(room):
    """Removes the current connection from the room.
    Args:
        room (str): Name of the room.
    """
    leave_room(room)
    logger.info(f"User has left the room {room}")


def emit_error(game_name: str, msg: str):
    logging.error(msg)
    emit("render_board", {"status_code": 400, "message": msg, "payload": {}}, room=game_name)


def emit_board(game_name: str, game: Game, msg: str):
    emit(
        "render_board",
        {
            "status_code": 200,
            "message": msg,
            "payload": simplejson.dumps(game, for_json=True),
        },
        room=game_name,
    )


@socketio.on("load_board")
def load_board(json: Dict[Any, Any]):
    """Loads the current game board, or creates on if none exists.
    Args:
        json (dict): dictionary with parameter called 'game'.
    """
    game_name = json["name"]

    logger.info(f"Loading board {game_name}")
    if game_name in all_games:
        cur_game = all_games[game_name]
        emit_board(game_name, cur_game, "Game retrieved")
    else:
        cur_game = Game(game_name)
        all_games[game_name] = cur_game
        emit_board(game_name, cur_game, "New game created")


@socketio.on("start_turn")
def start_turn(json: Dict[Any, Any]):
    if "name" not in json:
        logger.warning("Could not find the given board.")
        return

    game_name = json["name"]
    game = all_games[game_name]

    try:
        game.start_turn()
    except InvalidState as e:
        logging.error("Exception occurred", exc_info=True)
        emit_error(game_name, str(e))
    else:
        emit_board(game_name, game, "Started turn")


@socketio.on("reset_game")
def reset_game(json: Dict[Any, Any]):
    if "name" not in json:
        logger.warning("Could not find the given board.")
        return

    game_name = json["name"]
    game = all_games[game_name]

    game.reset(game_name)
    emit_board(game_name, game, "Game reset")


@socketio.on("new_phrase")
def new_phrase(json: Dict[Any, Any]):
    if "name" not in json:
        logger.warning("Could not find the given board.")
        return

    game_name = json["name"]
    game = all_games[game_name]

    if "correct" not in json:
        emit_error(game_name, "'correct' not in request")

    try:
        game.increment_active_state(json["correct"])
        emit_board(game_name, game, "New phrase generated")
    except InvalidState as e:
        logging.error("Exception occurred", exc_info=True)
        emit_error(game_name, str(e))


@socketio.on("end_turn")
def end_turn(json: Dict[Any, Any]):
    if "name" not in json:
        logger.warning("Could not find the given board.")
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
        logging.error("Exception occurred", exc_info=True)
        emit_error(game_name, str(e))


@socketio.on("steal")
def steal(json: Dict[Any, Any]):
    if "name" not in json:
        logger.warning("Could not find the given board.")
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
        logging.error("Exception occurred", exc_info=True)
        emit_error(game_name, str(e))


@socketio.on("toggle_difficulty")
def toggle_difficulty(json: Dict[Any, Any]):
    if "name" not in json:
        logger.warning("Could not find the given board.")
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

if __name__ == "__main__":
    socketio.run(app, debug=True)
