import datetime
import random
from enum import Enum
from threading import Lock
from typing import Any, Dict, List, Tuple

from madgab.madgab import mad_gabify


class InvalidState(Exception):
    """Generic exception for the game being in an invalid state.
    """

    pass


class State(Enum):
    """Defines the current state of a turn.
    """

    # Waiting for a active team to start their turn
    IDLE = "IDLE"

    # The active team is guessing
    ACTIVE = "ACTIVE"

    # The non-active team is stealing
    STEALING = "STEALING"

    # Waiting for the active team to end their turn
    REVIEW = "REVIEW"

    # The game is over
    OVER = "OVER"


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
        state (State): The current state of the game. Can be "IDLE", "ACTIVE",
            "STEALING", "REVIEW", or "OVER"
        clues (list): All of the clues for a given game.
        team_1_turn (bool): Whether it is team 1's turn.
        winning_team (str): The winning team. Can be None, 'Team 1', or 'Team 2'
        current_phrase (str): The current phrase (plain)
        current_madgab (str): The madgabed version of the current phrase
        current_turn_clues (list of tuples): The clues for the current turn.
            Each list element is a tuple of length 3 with the original phrase, the
            madgabed phrase, and a boolean for whether the team got the phrase
            correctly.
        current_turn_counter (int): The number of words guessed so far this turn.
        current_turn_correct (int): The number of words guessed correctly so far this turn.
        lock (threading.Lock): A lock to keep the game state synchronized.
    """

    def __init__(
        self,
        id: str,
        clues: List[Tuple[str, str]],
        win_threshold: int = 30,
        words_per_turn: int = 3,
        seconds_per_turn: int = 90,
    ):
        self.reset(id, clues, win_threshold, words_per_turn, seconds_per_turn)

        # Lock to keep the game synchronized
        self.lock = Lock()

    def reset(
        self,
        id: str,
        clues: List[Tuple[str, str]],
        win_threshold: int = 30,
        words_per_turn: int = 3,
        seconds_per_turn: int = 90,
    ):
        self.id: str = id

        # General game configuration
        self.win_threshold: int = min(max(10, win_threshold), 50)
        self.words_per_turn: int = min(max(3, words_per_turn), 5)
        self.seconds_per_turn: int = min(max(60, seconds_per_turn), 120)
        self.date_created = datetime.datetime.now()
        self.difficulty: str = "hard"

        # Game state
        self.team_1_score: int = 0
        self.team_2_score: int = 0
        self.round_number: int = 0
        self.state: State = State.IDLE

        # Initialize the clues
        random.shuffle(clues)
        self.clues: List[Tuple[str, str]] = clues

        # Turn state
        self.team_1_turn: bool = True
        self.winning_team: str = ""
        self.current_phrase: str = ""
        self.current_category: str = ""
        self.current_madgab: str = ""
        self.current_turn_counter: int = 0
        self.current_turn_correct: int = 0

        # This contains the current turn clues. It is a tuple with the phrase,
        # the madgab, whether they got it correct, and the category.
        self.current_turn_clues: List[Tuple[str, str, bool, str]] = []

    def __str__(self) -> str:  # pragma: no cover
        return (
            f"ID: {self.id}\n"
            f"Win threshold: {self.win_threshold}\n"
            f"Team 1 Score: {self.team_1_score}\n"
            f"Team 2 Score: {self.team_2_score}\n"
            f"Clues: {self.clues}\n"
        )

    def __json__(self) -> Dict[str, Any]:  # pragma: no cover
        return {
            "id": self.id,
            # General game configuration
            "win_threshold": self.win_threshold,
            "words_per_turn": self.words_per_turn,
            "seconds_per_turn": self.seconds_per_turn,
            "difficulty": self.difficulty,
            # Game state
            "team_1_score": self.team_1_score,
            "team_2_score": self.team_2_score,
            "round_number": self.round_number,
            "state": self.state.value,
            "winning_team": self.winning_team,
            # Turn state
            "team_1_turn": self.team_1_turn,
            "current_phrase": self.current_phrase,
            "current_category": self.current_category,
            "current_madgab": self.current_madgab,
            "current_turn_counter": self.current_turn_counter,
            "current_turn_correct": self.current_turn_correct,
            "current_turn_clues": self.current_turn_clues,
        }

    for_json = __json__

    def _calculate_bonus(self, time_left: float):
        """Calculate the bonus based on the time left

        Args:
            time_left (float): The time left when the turn ended.
        """
        time_taken = self.seconds_per_turn - time_left
        bonus = None

        # If they got it in the first third, they get three bonus points
        if 0 <= time_taken < self.seconds_per_turn / 3:
            bonus = 3
        elif self.seconds_per_turn / 3 <= time_taken < self.seconds_per_turn * (7 / 12):
            bonus = 2
        elif (
            self.seconds_per_turn * (7 / 12)
            <= time_taken
            < self.seconds_per_turn * (5 / 6)
        ):
            bonus = 1

        if bonus:
            self._update_score(bonus)

    def _change_active_team(self):
        """Change the active team.
        """
        if self.state not in [State.REVIEW, State.STEALING]:
            raise InvalidState(f"Invalid state {self.state} to change teams.")
        self.team_1_turn = not self.team_1_turn

    def _check_game_over(self):
        """Check the end condition of the game.

        The end condition is simple. The game can only end on team 2's turn.
        The game is over if either team has a score of the threshold.
        """
        if self.team_1_turn:
            return False
        else:
            return (
                self.team_1_score >= self.win_threshold
                or self.team_2_score >= self.win_threshold
            )

    def end_active_state(self, correct: bool, time_left: float):
        """Ends the current active state and transition to the review state.

        Args:
            correct (bool): Whether the last clue was correctly guessed.
            time_left (float): The number of seconds remaining in the turn.
        """
        self.lock.acquire(timeout=2)
        try:
            if self.state != State.ACTIVE:
                raise InvalidState(f"Invalid state {self.state} to change teams.")

            # If they got the word correct, update score and correct counter.
            if correct:
                self._update_score(1)
                self.current_turn_correct += 1
                self.current_turn_clues.append(
                    (
                        self.current_phrase,
                        self.current_madgab,
                        True,
                        self.current_category,
                    )
                )
            else:
                self.current_turn_clues.append(
                    (
                        self.current_phrase,
                        self.current_madgab,
                        False,
                        self.current_category,
                    )
                )

            # If they got them all correct, calculate bonus
            if self.words_per_turn == self.current_turn_correct:
                self._calculate_bonus(time_left)

            self.state = State.REVIEW
        finally:
            self.lock.release()

    def end_turn(self):
        """End the turn by changing the active team and setting state to idle.
        """
        self.lock.acquire(timeout=2)
        try:
            if self.state != State.REVIEW:
                raise InvalidState(f"Invalid state {self.state} for ending turn.")

            # If any clues were missed, update to the stealing state
            if self.current_turn_correct != self.current_turn_counter:
                self.state = State.STEALING
                return
            # Otherwise, check the game over condition and change turns
            else:
                if self._check_game_over():
                    self.state = State.OVER
                    self.winning_team = (
                        "Team 1" if self.team_1_score > self.team_2_score else "Team 2"
                    )
                    return
            self._change_active_team()
            self.state = State.IDLE
        finally:
            self.lock.release()

    def increment_active_state(self, correct: bool):
        """Wrapper for moving the turn ahead during the active state.

        Args:
            correct (bool): Whether the last clue was correctly guessed.
        """
        self.lock.acquire(timeout=2)
        try:
            self._increment_active_state(correct)
        finally:
            self.lock.release()

    def _increment_active_state(self, correct: bool):
        """Wrapper for moving the turn ahead during the active state.

        Args:
            correct (bool): Whether the last clue was correctly guessed.
        """
        # Check the current state
        if self.current_turn_counter == self.words_per_turn:
            raise InvalidState("Already at max words for the turn.")
        if self.state != State.ACTIVE:
            raise InvalidState("Must be in 'active' state to increment active state")

        # If they got the word correct, update score and correct counter.
        if correct:
            self._update_score(1)
            self.current_turn_correct += 1
            self.current_turn_clues.append(
                (self.current_phrase, self.current_madgab, True, self.current_category)
            )
        elif self.current_phrase:
            # If they didn't get it corect, but isn't the first
            # word, add to list but don't update score
            self.current_turn_clues.append(
                (self.current_phrase, self.current_madgab, False, self.current_category)
            )

        # Update the turn counter
        self.current_turn_counter += 1

        # Generate a new phrase
        self._new_phrase()

    def new_phrase(self):
        """Generates a new phrase
        """
        self.lock.acquire(timeout=2)
        try:
            self._new_phrase()
        finally:
            self.lock.release()

    def _new_phrase(self):
        """Generates a new phrase
        """
        self.current_phrase, self.current_category = self.clues.pop()
        self.current_madgab = mad_gabify(self.current_phrase, self.difficulty)

    def _reset_turn(self):
        self.current_phrase = ""
        self.current_madgab = ""
        self.current_turn_clues = []
        self.current_turn_counter = 0
        self.current_turn_correct = 0

    def start_turn(self):
        """
        Start a new turn by reseting turn parameters, changing the state,
        and generating the first word.
        """
        self.lock.acquire(timeout=2)
        try:
            if self.state != State.IDLE:
                raise InvalidState(f"Invalid state {self.state} to start turn.")
            if self.team_1_turn:
                self.round_number += 1
            self._reset_turn()
            self.state = State.ACTIVE
            self._increment_active_state(False)
        finally:
            self.lock.release()

    def steal(self, points: int):
        """Steal points.

        Args:
            point (int): Number of points stolen
        """
        self.lock.acquire(timeout=2)
        try:
            # Validate state
            if self.state != State.STEALING:
                raise InvalidState(f"Invalid state {self.state} for stealing.")

            # Add the stolen points
            self._update_score(points, False)

            # Check the game end condition
            if self._check_game_over():
                self.state = State.OVER
                self.winning_team = (
                    "Team 1" if self.team_1_score > self.team_2_score else "Team 2"
                )
                return

            # Transition to the next turn
            self._change_active_team()
            self.state = State.IDLE
        finally:
            self.lock.release()

    def toggle_difficulty(self):
        self.lock.acquire(timeout=2)
        try:
            if self.difficulty == "easy":
                self.difficulty = "hard"
            else:
                self.difficulty = "easy"
        finally:
            self.lock.release()

    def _update_score(self, points: int, current_team: bool = True):
        """Update the score.

        Args:
            points (int): Number of points to add
            current_team (bool): Whether to add points to the current active team or not.
        """
        if current_team:
            if self.team_1_turn:
                self.team_1_score += points
            else:
                self.team_2_score += points
        else:
            if self.team_1_turn:
                self.team_2_score += points
            else:
                self.team_1_score += points
