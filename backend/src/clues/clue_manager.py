import json
import os
import re
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List

from src.madgab.madgab import WORD_TO_PHONEME


@dataclass(frozen=True)
class Clue:
    phrase: str
    clue_set: str

    def __eq__(self, o: object) -> bool:
        if isinstance(o, Clue):
            return self.phrase == o.phrase
        return False

    def __hash__(self) -> int:
        return hash(self.phrase)


class ClueException(Exception):
    pass


class ClueSetType(Enum):
    """Define the current selection of clueset
    """

    BASE = "Base"
    BOOKS = "Books"
    MOVIES = "Movies"
    MUSICAL_ARTISTS = "Musical Artists"
    PEOPLE = "Famous People"
    SONGS = "Songs"
    TELEVISION_SHOWS = "Television Shows"

    @staticmethod
    def from_string(clue_set: str):
        for clue_set_type in ClueSetType:
            if clue_set_type.value == clue_set:
                return clue_set_type
        raise NotImplementedError

    @staticmethod
    def from_list(clue_sets: List[str]):
        return [ClueSetType.from_string(clue_set) for clue_set in clue_sets]


class ClueSet:
    clue_set_path = "src/clues/clue_sets"

    @staticmethod
    def read_clues_from_file(filename: str):
        with open(filename, "r") as file:
            return json.loads(file.read())


class ClueSetManager:
    clue_sets = {
        ClueSetType.BASE: ClueSet.read_clues_from_file(
            os.path.join(ClueSet.clue_set_path, "base.json")
        ),
        ClueSetType.BOOKS: ClueSet.read_clues_from_file(
            os.path.join(ClueSet.clue_set_path, "books.json")
        ),
        ClueSetType.MOVIES: ClueSet.read_clues_from_file(
            os.path.join(ClueSet.clue_set_path, "movies.json")
        ),
        ClueSetType.MUSICAL_ARTISTS: ClueSet.read_clues_from_file(
            os.path.join(ClueSet.clue_set_path, "musical_artists.json")
        ),
        ClueSetType.PEOPLE: ClueSet.read_clues_from_file(
            os.path.join(ClueSet.clue_set_path, "people.json")
        ),
        ClueSetType.SONGS: ClueSet.read_clues_from_file(
            os.path.join(ClueSet.clue_set_path, "songs.json")
        ),
        ClueSetType.TELEVISION_SHOWS: ClueSet.read_clues_from_file(
            os.path.join(ClueSet.clue_set_path, "television_shows.json")
        ),
    }

    @staticmethod
    def get_clues(clue_set: ClueSetType):
        if clue_set in ClueSetManager.clue_sets:
            return ClueSetManager.clue_sets[clue_set]
        else:
            raise ClueException("The given clue set is not found.")


class ClueManager:
    def __init__(self, clue_sets=List[ClueSetType]) -> None:
        self._generate_clues(clue_sets)

    def _generate_clues(self, clue_sets: List[ClueSetType]):
        # Generate the list of clues
        clues = self._read_clues(clue_sets)
        self._process_clues(clues)

    def _read_clues(self, clue_sets: List[ClueSetType]) -> List:
        all_clues = []
        for clue_set in clue_sets:
            all_clues += ClueSetManager.get_clues(clue_set)
        return all_clues

    def _process_clues(self, clues: List[Dict]):
        self.clues: List[Clue] = []
        self.unused_clues: List[Clue] = []
        for clue in clues:
            current_clue = self._parse_clue(clue)
            if clue["use"]:
                if self._is_valid_phrase(current_clue.phrase):
                    self.clues.append(current_clue)
                    continue
            self.unused_clues.append(current_clue)

    def _parse_clue(self, clue: Dict) -> Clue:
        phrase, clue_set = clue["phrase"], clue["clueSet"]
        phrase = self._process_phrase(phrase)
        return Clue(phrase, clue_set)

    def _is_valid_phrase(self, phrase):
        try:
            words = phrase.split(" ")
            return all([word in WORD_TO_PHONEME for word in words])
        except Exception:
            return False

    def _process_phrase(self, phrase: str) -> str:
        # Preprocess the phrase, change to lowercase and sub out any irrelevant characters.
        phrase = phrase.lower()
        phrase = re.sub(r"[^a-z '.]", "", phrase)

        return phrase

    def get_clues(self) -> List[Clue]:
        return self.clues
