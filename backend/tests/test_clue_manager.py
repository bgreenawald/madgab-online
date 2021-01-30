import unittest

from src.clues.clue_manager import ClueManager


class testClueManager(unittest.TestCase):

    def test_get_clues(self):
        clue_manager = ClueManager()
        clues = clue_manager.get_clues()
        self.assertTrue(len(clues) > 0, msg="No unused clues present.")

    def test_unused_clues_omitted(self):
        clue_manager = ClueManager()
        clues = clue_manager.get_clues()
        unused_clues = clue_manager.unused_clues
        phrase = [clue[0] for clue in clues]
        unused_phrases = [clue[0] for clue in unused_clues]
        clue_intersection = set(phrase).intersection(set(unused_phrases))
        self.assertTrue(len(clue_intersection) == 0)
