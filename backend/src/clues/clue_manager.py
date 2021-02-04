import json
import os
import re
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Tuple

from src.madgab.madgab import WORD_TO_PHONEME


@dataclass(frozen=True)
class Clue:
    phrase: str
    category: str


class ClueException(Exception):
    pass


class ClueSetType(Enum):
    """Define the current selection of clueset
    """

    BASE = "Base"


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
        )
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
        phrase, category = clue["phrase"], clue["category"]
        phrase = self._process_phrase(phrase)
        return Clue(phrase, category)

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
