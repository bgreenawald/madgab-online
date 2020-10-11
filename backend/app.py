import atexit
import datetime
import logging
import os
import re
import sys
from typing import Any, Dict

import simplejson
from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, json, render_template, request, Response
from flask_cors import CORS
from flask_scss import Scss
from flask_socketio import emit, join_room, SocketIO
from jsonschema import validate, ValidationError

from game import Game, InvalidState

# Initialize the application
app = Flask(__name__)
app.debug = True
app.config["SECRET_KEY"] = "secret!"
cors_allowed_origins = 'https://localhost'
socketio = SocketIO(app, cors_allowed_origins="*")

# Setup logging
if not os.path.isdir("logs"):
    os.makedirs("logs")
logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")
handler = logging.FileHandler("logs/app.log")
shell_handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(
    logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
)
logger.addHandler(handler)
logger.addHandler(shell_handler)


# Initialize CORS
CORS(app)

# Dictionary to hold all games
all_games: Dict[str, Game] = {}

# Generate the list of clues
with open("./clues/clues.txt", "r") as file:
    clues = []
    for clue in file.readlines():
        category, phrase = clue.strip().split(" | ")

        # Preprocess the phrase, change to lowercase and sub out any irrelevant characters.
        phrase = phrase.lower()
        phrase = re.sub(r"[^a-z '.]", "", phrase)

        clues.append((category, phrase))


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
def on_join(data: Dict[str, Any]):
    """Joins the connection to the provided room
    Args:
        data (Dict[Any, Any]): {
            "name": ([str, number]) The name of the game.
        }
    """
    schema = {
        "type": "object",
        "properties": {"name": {"type": ["string", "number"]}},
        "required": ["name"],
    }
    try:
        validate(data, schema=schema)
    except ValidationError as e:
        if "name" in data:
            emit_error(data["name"], str(e))
        else:
            logger.error("No game specified in input.")
    else:
        room_name = data["name"]
        join_room(room_name)
        logger.info(f"{request.sid} has entered the room {room_name}")


@socketio.on("connect")
def on_connect():
    """Called on client connect.
    """
    logger.info(f"{request.sid} has connected.")


@socketio.on("disconnect")
def on_disconnect():
    """Called on client disconnect.
    """
    logger.info(f"{request.sid} has disconnected.")


def emit_error(game_name: str, msg: str):
    logging.error(msg)
    emit(
        "render_board",
        {"status_code": 400, "message": msg, "payload": {}},
        room=game_name,
    )


def emit_game(game_name: str, game: Game, msg: str):
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
def load_board(data: Dict[Any, Any]):
    """Loads the current game board, or creates on if none exists.
    Args:
        data (Dict[Any, Any]): {
            "name": ([str, number]) The name of the game.
        }
    """
    schema = {
        "type": "object",
        "properties": {"name": {"type": ["string", "number"]}},
        "required": ["name"],
    }
    try:
        validate(data, schema=schema)
    except ValidationError as e:
        if "name" in data:
            emit_error(data["name"], str(e))
        else:
            logger.error("No game specified in input.")
    else:
        game_name = data["name"]

        if game_name not in all_games:
            cur_game = Game(game_name, clues)
            all_games[game_name] = cur_game
        else:
            game = all_games[game_name]
            emit_game(game_name, game, "Game loaded.")


@socketio.on("start_turn")
def start_turn(data: Dict[Any, Any]):
    """Starts the turn for the current active team.

    Args:
        data (Dict[Any, Any]): {
            "name": ([str, number]) The name of the game.
        }
    """
    schema = {
        "type": "object",
        "properties": {"name": {"type": ["string", "number"]}},
        "required": ["name"],
    }
    try:
        validate(data, schema=schema)
    except ValidationError as e:
        if "name" in data:
            emit_error(data["name"], str(e))
        else:
            logger.error("No game specified in input.")
    else:
        game_name = data["name"]
        try:
            game = all_games[game_name]
        except KeyError:
            logger.warning(f"Could not find the game named {game_name}.")
            emit_error(game_name, f"Could not find the game named {game_name}.")
            return

        try:
            game.start_turn()
        except InvalidState as e:
            logging.error("Exception occurred", exc_info=True)
            emit_error(game_name, str(e))
        else:
            emit_game(game_name, game, "Started turn.")


@socketio.on("reset_game")
def reset_game(data: Dict[Any, Any]):
    """Resets the game for a given game ID.

    Args:
        data (Dict[Any, Any]): {
            "name": ([str, number]) The name of the game.
        }
    """
    schema = {
        "type": "object",
        "properties": {"name": {"type": ["string", "number"]}},
        "required": ["name"],
    }
    try:
        validate(data, schema=schema)
    except ValidationError as e:
        if "name" in data:
            emit_error(data["name"], str(e))
        else:
            logger.error("No game specified in input.")
    else:
        game_name = data["name"]
        try:
            game = all_games[game_name]
        except KeyError:
            logger.warning(f"Could not find the game named {game_name}.")
            emit_error(game_name, f"Could not find the game named {game_name}.")
            return

        game.reset(game_name, clues)
        emit_game(game_name, game, "Game reset.")


@socketio.on("new_phrase")
def new_phrase(data: Dict[Any, Any]):
    """Generate a new phrase.

    Args:
        data (Dict[Any, Any]): {
            "name": ([str, number]) The name of the game.
            "correct": (bool) Whether the last phrase was guessed correctly.
        }
    """
    schema = {
        "type": "object",
        "properties": {
            "name": {"type": ["string", "number"]},
            "correct": {"type": "boolean"},
        },
        "required": ["name", "correct"],
    }
    try:
        validate(data, schema=schema)
    except ValidationError as e:
        if "name" in data:
            emit_error(data["name"], str(e))
        else:
            logger.error("No game specified in input.")
    else:
        game_name = data["name"]
        try:
            game = all_games[game_name]
        except KeyError:
            logger.warning(f"Could not find the game named {game_name}.")
            emit_error(game_name, f"Could not find the game named {game_name}.")
            return

        try:
            game.increment_active_state(data["correct"])
            emit_game(game_name, game, "New phrase generated.")
        except InvalidState as e:
            logging.error("Exception occurred", exc_info=True)
            emit_error(game_name, str(e))


@socketio.on("end_active_state")
def end_active_state(data: Dict[Any, Any]):
    """
    Ends the active state for the current team. Moves the game
    to either REVIEW or STEAL.

    Args:
        data (Dict[Any, Any]): {
            "name": ([str, number]) The name of the game.
            "correct": (bool) Whether the last phrase was guessed correctly.
            "time_left": (float). The number of seconds remaining in the turn.

        }
    """
    schema = {
        "type": "object",
        "properties": {
            "name": {"type": ["string", "number"]},
            "correct": {"type": "boolean"},
            "time_left": {"type": "number"},
        },
        "required": ["name", "correct", "time_left"],
    }
    try:
        validate(data, schema=schema)
    except ValidationError as e:
        if "name" in data:
            emit_error(data["name"], str(e))
        else:
            logger.error("No game specified in input.")
    else:
        game_name = data["name"]
        try:
            game = all_games[game_name]
        except KeyError:
            logger.warning(f"Could not find the game named {game_name}.")
            emit_error(game_name, f"Could not find the game named {game_name}.")
            return

        try:
            game.end_active_state(data["correct"], data["time_left"])
            emit_game(game_name, game, "Active state ended.")
        except InvalidState as e:
            logging.error("Exception occurred", exc_info=True)
            emit_error(game_name, str(e))


@socketio.on("end_turn")
def end_turn(data: Dict[Any, Any]):
    """
    Ends the turn for the current team. Moves the game from
    REVIEW to IDLE.

    Args:
        data (Dict[Any, Any]): {
            "name": ([str, number]) The name of the game.
        }
    """
    schema = {
        "type": "object",
        "properties": {"name": {"type": ["string", "number"]}},
        "required": ["name"],
    }
    try:
        validate(data, schema=schema)
    except ValidationError as e:
        if "name" in data:
            emit_error(data["name"], str(e))
        else:
            logger.error("No game specified in input.")
    else:
        game_name = data["name"]
        try:
            game = all_games[game_name]
        except KeyError:
            logger.warning(f"Could not find the game named {game_name}.")
            emit_error(game_name, f"Could not find the game named {game_name}.")
            return

        try:
            game.end_turn()
            emit_game(game_name, game, "Turn ended.")
        except InvalidState as e:
            logging.error("Exception occurred", exc_info=True)
            emit_error(game_name, str(e))


@socketio.on("steal")
def steal(data: Dict[Any, Any]):
    """
    Ends the active state for the current team. Moves the game
    to either REVIEW or STEAL.

    Args:
        data (Dict[Any, Any]): {
            "name": ([str, number]) The name of the game.
            "points": (int) The number of points stolen during STEAL phase.
        }
    """
    schema = {
        "type": "object",
        "properties": {
            "name": {"type": ["string", "number"]},
            "points": {"type": "integer"},
        },
        "required": ["name", "points"],
    }
    try:
        validate(data, schema=schema)
    except ValidationError as e:
        if "name" in data:
            emit_error(data["name"], str(e))
        else:
            logger.error("No game specified in input.")
    else:
        game_name = data["name"]
        game = all_games[game_name]

        try:
            game.steal(data["points"])
            emit_game(game_name, game, "Points stolen.")
        except InvalidState as e:
            logging.error("Exception occurred", exc_info=True)
            emit_error(game_name, str(e))


@socketio.on("toggle_difficulty")
def toggle_difficulty(data: Dict[Any, Any]):
    """Toggles the difficulty for the game with given ID.

    Args:
        data (Dict[Any, Any]): {
            "name": ([str, number]) The name of the game.
        }
    """
    schema = {
        "type": "object",
        "properties": {"name": {"type": ["string", "number"]}},
        "required": ["name"],
    }
    try:
        validate(data, schema=schema)
    except ValidationError as e:
        if "name" in data:
            emit_error(data["name"], str(e))
        else:
            logger.error("No game specified in input.")
    else:
        game_name = data["name"]
        game = all_games[game_name]

        game.toggle_difficulty()
        emit_game(game_name, game, "Difficulty toggled.")


# ---------------------------------------
# Other functions
# ---------------------------------------

# Schedule cleanup
def _delete_old_games():
    for game in all_games:
        age = datetime.datetime.now() - all_games[game].date_created
        if age.total_seconds() > 86400:
            del all_games[game]


scheduler = BackgroundScheduler()
scheduler.add_job(func=_delete_old_games, trigger="interval", seconds=3600)
scheduler.start()

# Shutdown your cron thread if the web process is stopped
atexit.register(lambda: scheduler.shutdown())

if __name__ == "__main__":
    socketio.run(app, debug=True)
