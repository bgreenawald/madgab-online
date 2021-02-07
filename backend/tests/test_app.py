# API tests for the Flask app
import json
import re

import pytest

import src.game.game_config as game_config
from app import app, all_games, socketio
from src.clues.clue_manager import ClueManager, ClueSetType
from src.game.game import Game


@pytest.fixture
def client():
    app.config["TESTING"] = True
    all_games["TEST_GAME"] = Game("TEST_GAME", [ClueSetType.BASE])

    with app.test_client() as client:
        yield client


@pytest.fixture
def socket_client():
    app.config["TESTING"] = True
    all_games["TEST_GAME"] = Game("TEST_GAME", [ClueSetType.BASE])
    client = app.test_client()
    socket_client = socketio.test_client(app, flask_test_client=client)
    socket_client.emit("join", {"name": "TEST_GAME"})
    yield socket_client


def test_get_names(client):
    resp = client.get("/api/get_names")
    assert resp.status_code == 200
    assert json.loads(resp.data.decode("utf-8")) == {"ids": ["TEST_GAME"]}


def test_get_clue_sets(client):
    resp = client.get("/api/get_clue_sets")
    assert resp.status_code == 200
    assert json.loads(resp.data.decode("utf-8")) == {
        "clue_sets": [clue_set.value for clue_set in ClueSetType]
    }


def test_load_board(socket_client):
    socket_client.emit("load_board", {"name": "TEST_GAME"})
    resp = socket_client.get_received()
    assert resp[0]["name"] == "render_board"
    assert len(resp[0]["args"][0]) == 3
    assert resp[0]["args"][0]["status_code"] == 200
    assert resp[0]["args"][0]["message"] == "Game loaded."
    assert json.loads(resp[0]["args"][0]["payload"]) == {
        "id": "TEST_GAME",
        "win_threshold": game_config.WIN_THRESHOLD,
        "words_per_turn": game_config.WORDS_PER_TURN,
        "seconds_per_turn": game_config.SECONDS_PER_TURN,
        "difficulty": "hard",
        "team_1_score": 0,
        "team_2_score": 0,
        "round_number": 0,
        "state": "IDLE",
        "winning_team": "",
        "clue_sets": ["Base"],
        "team_1_turn": True,
        "current_phrase": "",
        "current_madgab": "",
        "current_turn_counter": 0,
        "current_turn_correct": 0,
        "current_turn_clues": [],
    }


def test_start_game(socket_client):
    socket_client.emit("start_turn", {"name": "TEST_GAME"})
    resp = socket_client.get_received()
    assert resp[0]["name"] == "render_board"
    assert len(resp[0]["args"][0]) == 3
    assert resp[0]["args"][0]["status_code"] == 200
    assert resp[0]["args"][0]["message"] == "Started turn."
    data = json.loads(resp[0]["args"][0]["payload"])
    data.pop("current_phrase", None)
    data.pop("current_madgab", None)
    assert data == {
        "id": "TEST_GAME",
        "win_threshold": game_config.WIN_THRESHOLD,
        "words_per_turn": game_config.WORDS_PER_TURN,
        "seconds_per_turn": game_config.SECONDS_PER_TURN,
        "difficulty": "hard",
        "team_1_score": 0,
        "team_2_score": 0,
        "round_number": 1,
        "state": "ACTIVE",
        "winning_team": "",
        "clue_sets": ["Base"],
        "team_1_turn": True,
        "current_turn_counter": 1,
        "current_turn_correct": 0,
        "current_turn_clues": [],
    }


def test_reset(socket_client):
    socket_client.emit("start_turn", {"name": "TEST_GAME"})
    _ = socket_client.get_received()
    socket_client.emit("reset_game", {"name": "TEST_GAME"})
    resp = socket_client.get_received()
    assert resp[0]["name"] == "render_board"
    assert len(resp[0]["args"][0]) == 3
    assert resp[0]["args"][0]["status_code"] == 200
    assert resp[0]["args"][0]["message"] == "Game reset."
    assert json.loads(resp[0]["args"][0]["payload"]) == {
        "id": "TEST_GAME",
        "win_threshold": game_config.WIN_THRESHOLD,
        "words_per_turn": game_config.WORDS_PER_TURN,
        "seconds_per_turn": game_config.SECONDS_PER_TURN,
        "difficulty": "hard",
        "team_1_score": 0,
        "team_2_score": 0,
        "round_number": 0,
        "state": "IDLE",
        "winning_team": "",
        "clue_sets": ["Base"],
        "team_1_turn": True,
        "current_phrase": "",
        "current_madgab": "",
        "current_turn_counter": 0,
        "current_turn_correct": 0,
        "current_turn_clues": [],
    }


def test_new_phrase_fail(socket_client):
    socket_client.emit("new_phrase", {"name": "TEST_GAME"})
    resp = socket_client.get_received()
    assert resp[0]["name"] == "render_board"
    assert len(resp[0]["args"][0]) == 3
    assert resp[0]["args"][0]["status_code"] == 400
    assert (
        resp[0]["args"][0]["message"].split("\n")[0]
        == "'correct' is a required property"
    )
    assert resp[0]["args"][0]["payload"] == {}


def test_new_phrase(socket_client):
    socket_client.emit("start_turn", {"name": "TEST_GAME"})
    _ = socket_client.get_received()
    socket_client.emit("new_phrase", {"name": "TEST_GAME", "correct": True})
    resp = socket_client.get_received()
    assert resp[0]["name"] == "render_board"
    assert len(resp[0]["args"][0]) == game_config.WORDS_PER_TURN
    assert resp[0]["args"][0]["status_code"] == 200
    assert resp[0]["args"][0]["message"] == "New phrase generated."
    data = json.loads(resp[0]["args"][0]["payload"])
    data.pop("current_phrase", None)
    data.pop("current_madgab", None)
    data.pop("current_turn_clues", None)
    assert data == {
        "id": "TEST_GAME",
        "win_threshold": game_config.WIN_THRESHOLD,
        "words_per_turn": game_config.WORDS_PER_TURN,
        "seconds_per_turn": game_config.SECONDS_PER_TURN,
        "difficulty": "hard",
        "team_1_score": 1,
        "team_2_score": 0,
        "round_number": 1,
        "state": "ACTIVE",
        "winning_team": "",
        "clue_sets": ["Base"],
        "team_1_turn": True,
        "current_turn_counter": 2,
        "current_turn_correct": 1,
    }


def test_end_active_state_fail(socket_client):
    socket_client.emit("end_active_state", {"name": "TEST_GAME", "correct": True})
    resp = socket_client.get_received()
    assert resp[0]["name"] == "render_board"
    assert len(resp[0]["args"][0]) == 3
    assert resp[0]["args"][0]["status_code"] == 400
    assert (
        resp[0]["args"][0]["message"].split("\n")[0]
        == "'time_left' is a required property"
    )
    assert resp[0]["args"][0]["payload"] == {}


def test_end_active_state(socket_client):
    socket_client.emit("start_turn", {"name": "TEST_GAME"})
    _ = socket_client.get_received()
    socket_client.emit(
        "end_active_state", {"name": "TEST_GAME", "correct": False, "time_left": 0}
    )
    resp = socket_client.get_received()
    assert resp[0]["name"] == "render_board"
    assert len(resp[0]["args"][0]) == game_config.WORDS_PER_TURN
    assert resp[0]["args"][0]["status_code"] == 200
    assert resp[0]["args"][0]["message"] == "Active state ended."
    data = json.loads(resp[0]["args"][0]["payload"])
    data.pop("current_phrase", None)
    data.pop("current_madgab", None)
    data.pop("current_turn_clues", None)
    assert data == {
        "id": "TEST_GAME",
        "win_threshold": game_config.WIN_THRESHOLD,
        "words_per_turn": game_config.WORDS_PER_TURN,
        "seconds_per_turn": game_config.SECONDS_PER_TURN,
        "difficulty": "hard",
        "team_1_score": 0,
        "team_2_score": 0,
        "round_number": 1,
        "state": "REVIEW",
        "winning_team": "",
        "clue_sets": ["Base"],
        "team_1_turn": True,
        "current_turn_counter": 1,
        "current_turn_correct": 0,
    }


def test_end_turn(socket_client):
    socket_client.emit("start_turn", {"name": "TEST_GAME"})
    _ = socket_client.get_received()
    socket_client.emit(
        "end_active_state", {"name": "TEST_GAME", "correct": False, "time_left": 0}
    )
    _ = socket_client.get_received()
    socket_client.emit("end_turn", {"name": "TEST_GAME"})
    resp = socket_client.get_received()
    assert resp[0]["name"] == "render_board"
    assert len(resp[0]["args"][0]) == 3
    assert resp[0]["args"][0]["status_code"] == 200
    assert resp[0]["args"][0]["message"] == "Turn ended."
    data = json.loads(resp[0]["args"][0]["payload"])
    data.pop("current_phrase", None)
    data.pop("current_madgab", None)
    data.pop("current_turn_clues", None)
    assert data == {
        "id": "TEST_GAME",
        "win_threshold": game_config.WIN_THRESHOLD,
        "words_per_turn": game_config.WORDS_PER_TURN,
        "seconds_per_turn": game_config.SECONDS_PER_TURN,
        "difficulty": "hard",
        "team_1_score": 0,
        "team_2_score": 0,
        "round_number": 1,
        "state": "STEALING",
        "winning_team": "",
        "clue_sets": ["Base"],
        "team_1_turn": True,
        "current_turn_counter": 1,
        "current_turn_correct": 0,
    }


def test_steal_fail(socket_client):
    socket_client.emit("steal", {"name": "TEST_GAME"})
    resp = socket_client.get_received()
    assert resp[0]["name"] == "render_board"
    assert len(resp[0]["args"][0]) == 3
    assert resp[0]["args"][0]["status_code"] == 400
    assert (
        resp[0]["args"][0]["message"].split("\n")[0]
        == "'points' is a required property"
    )
    assert resp[0]["args"][0]["payload"] == {}


def test_steal(socket_client):
    socket_client.emit("start_turn", {"name": "TEST_GAME"})
    _ = socket_client.get_received()
    socket_client.emit(
        "end_active_state", {"name": "TEST_GAME", "correct": False, "time_left": 0}
    )
    _ = socket_client.get_received()
    socket_client.emit("end_turn", {"name": "TEST_GAME"})
    _ = socket_client.get_received()
    socket_client.emit("steal", {"name": "TEST_GAME", "points": 1})
    resp = socket_client.get_received()
    assert resp[0]["name"] == "render_board"
    assert len(resp[0]["args"][0]) == 3
    assert resp[0]["args"][0]["status_code"] == 200
    assert resp[0]["args"][0]["message"] == "Points stolen."
    data = json.loads(resp[0]["args"][0]["payload"])
    data.pop("current_phrase", None)
    data.pop("current_madgab", None)
    data.pop("current_turn_clues", None)
    assert data == {
        "id": "TEST_GAME",
        "win_threshold": game_config.WIN_THRESHOLD,
        "words_per_turn": game_config.WORDS_PER_TURN,
        "seconds_per_turn": game_config.SECONDS_PER_TURN,
        "difficulty": "hard",
        "team_1_score": 0,
        "team_2_score": 1,
        "round_number": 1,
        "state": "IDLE",
        "winning_team": "",
        "clue_sets": ["Base"],
        "team_1_turn": False,
        "current_turn_counter": 1,
        "current_turn_correct": 0,
    }


def test_toggle_difficulty(socket_client):
    socket_client.emit("toggle_difficulty", {"name": "TEST_GAME"})
    resp = socket_client.get_received()
    assert resp[0]["name"] == "render_board"
    assert len(resp[0]["args"][0]) == 3
    assert resp[0]["args"][0]["status_code"] == 200
    assert resp[0]["args"][0]["message"] == "Difficulty toggled."
    assert json.loads(resp[0]["args"][0]["payload"]) == {
        "id": "TEST_GAME",
        "win_threshold": game_config.WIN_THRESHOLD,
        "words_per_turn": game_config.WORDS_PER_TURN,
        "seconds_per_turn": game_config.SECONDS_PER_TURN,
        "difficulty": "easy",
        "team_1_score": 0,
        "team_2_score": 0,
        "round_number": 0,
        "state": "IDLE",
        "winning_team": "",
        "clue_sets": ["Base"],
        "team_1_turn": True,
        "current_phrase": "",
        "current_madgab": "",
        "current_turn_counter": 0,
        "current_turn_correct": 0,
        "current_turn_clues": [],
    }
