import json
import os
import re
from enum import Enum
from typing import Dict, List, Tuple


class ClueSetType(Enum):
    """Define the current selection of clueset
    """

    BASE = "BASE"


class ClueSetGenerator:
    clue_set_path = "src/clues/clue_sets"

    @staticmethod
    def read_clues_from_file(filename: str):
        with open(filename, "r") as file:
            return json.loads(file.read())

    @staticmethod
    def generate_clues(clue_set: ClueSetType):
        if clue_set == ClueSetType.BASE:
            return ClueSetGenerator.read_clues_from_file(
                os.path.join(ClueSetGenerator.clue_set_path, "base.json")
            )


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
            all_clues += ClueSetGenerator.generate_clues(clue_set)
        return all_clues

    def _process_clues(self, clues: List[Dict]):
        self.clues = []
        self.unused_clues = []
        for clue in clues:
            if clue["use"]:
                self.clues.append(self._parse_clue(clue))
            else:
                self.unused_clues.append(self._parse_clue(clue))

    def _parse_clue(self, clue: Dict) -> Tuple:
        phrase, category = clue["phrase"], clue["category"]
        phrase = self._process_phrase(phrase)
        return (phrase, category)

    def _process_phrase(self, phrase: str) -> str:
        # Preprocess the phrase, change to lowercase and sub out any irrelevant characters.
        phrase = phrase.lower()
        phrase = re.sub(r"[^a-z '.]", "", phrase)

        return phrase

    def get_clues(self) -> List[Tuple]:
        return self.clues
