import json
import re
from typing import Dict, List, Tuple


class ClueManager:
    def __init__(self) -> None:
        self.filename = "src/clues/clues.json"
        self._generate_clues()

    def _parse_clue(self, clue: Dict) -> Tuple:
        phrase, category = clue["phrase"], clue["category"]
        phrase = self._process_phrase(phrase)
        return (phrase, category)

    def _process_phrase(self, phrase: str) -> str:
        # Preprocess the phrase, change to lowercase and sub out any irrelevant characters.
        phrase = phrase.lower()
        phrase = re.sub(r"[^a-z '.]", "", phrase)

        return phrase

    def _generate_clues(self):
        # Generate the list of clues
        with open(self.filename, "r") as file:
            self.clues = []
            self.unused_clues = []
            for clue in json.loads(file.read()):
                if clue["use"]:
                    self.clues.append(self._parse_clue(clue))
                else:
                    self.unused_clues.append(self._parse_clue(clue))

    def get_clues(self) -> List[Tuple]:
        return self.clues
