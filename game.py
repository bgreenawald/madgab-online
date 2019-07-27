import datetime
from enum import Enum
import random

all_games = {}

class State(Enum):
    IDLE = "IDLE"
    ACTIVE = "ACTIVE"
    STEALING = "STEALING"
    OVER = "OVER"

# Define the boundaries on games
MAX_THRESHOLD = 50
MIN_THRESHOLD = 1


class Game(object):
    """
    A class representing an entire game.

    Attributes:
        id (str): Id of a game.
        win_threshold (int): Minimum score needed to win a game. Defaults 30.
        words_per_turn (int): Number of words per turn. Defaults 3.
        seconds_per_turn (int): Number of seconds in a turn. Defaults 60.
        date_created (datetime): When the game was first created.
        team_1_score (int): Team 1's score.
        team_2_score (int): Team 2's score.
        state (State): The current state of the game. Can be "IDLE", "ACTIVE", "STEALING", "OVER"
        clues (list): All of the clues for a given game.
        team_1_turn (bool): Whether it is team 1's turn.
        winning_team (str): The winning team. Can be None, 'Team 1', or 'Team 2'
        current_phrase (str): The current phrase (plain)
        current_madgab (str): The madgabed version of the current phrase
        current_turn_clues (list of tuples): The clues for the current turn.
            Each list element is a tuple of length 3 with the original phrase, the madgabed phrase,
            and a boolean for whether the team got the phrase correctly.
        current_turn_counter (int): The number of words guessed so far this turn.
        current_turn_correct (int): The number of words guessed correctly so far this turn.
    """

    def __init__(self, id, win_threshold=30, words_per_turn=3, seconds_per_turn=60):
        self.id = id

        # General game configuration
        self.win_threshold = min(max(MIN_THRESHOLD, win_threshold), MAX_THRESHOLD)
        self.words_per_turn = words_per_turn
        self.seconds_per_turn = 60
        self.date_created = datetime.datetime.now()

        # Game state
        self.team_1_score = 0
        self.team_2_score = 0
        self.state = State.IDLE

        # Initialize the clues
        with open("./clues.txt", "r") as file:
            clues = [clue.strip() for clue in file.readlines()]
            random.shuffle(clues)
            self.clues = clues

        # Turn state
        self.team_1_turn = True
        self.winning_team = None
        self.current_word = ""
        self.current_madgab = ""
        self.current_turn_clues = []
        self.current_turn_counter = 0
        self.current_turn_correct = 0

    def __str__(self):
        return (
            f"ID: {self.id}\n"
            f"Win threshold: {self.win_threshold}\n"
            f"Team 1 Score: {self.team_1_score}\n"
            f"Team 2 Score: {self.team_2_score}\n"
            f"Clue: {self.clues}\n"
            f"Team 1 Turn: {self.team_1_turn}\n"
            f"Date created: {self.date_created}\n"
            f"Winning team: {self.winning_team}"
        )

    def __json__(self):
        return {
            "id": self.id,

            # General game configuration
            "win_threshold": self.win_threshold,
            "words_per_turn": self.words_per_turn,
            "seconds_per_turn": self.seconds_per_turn,

            # Game state
            "team_1_score": self.team_1_score,
            "team_2_score": self.team_2_score,
            "state": self.state,
            "winning_team": self.winning_team,

            # Turn state
            "team_1_turn": self.team_1_turn,
            "current_turn_clues": self.current_turn_clues,
            "current_turn_counter": self.current_turn_counter,
            "current_turn_correct": self.current_turn_correct,
        }

        for_json = __json__