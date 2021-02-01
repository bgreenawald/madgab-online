import unittest

from src.clues.clue_manager import ClueManager, ClueSet, ClueSetManager, ClueSetType


class testClueSet(unittest.TestCase):
    def test_read_clues_from_file(self):
        clues = ClueSet.read_clues_from_file("src/clues/clue_sets/base.json")
        self.assertTrue(len(clues) > 0, msg="ClueSet failed to read from file.")


class testClueSetManager(unittest.TestCase):
    def test_read_base_clues(self):
        clues = ClueSetManager.get_clues(ClueSetType.BASE)
        self.assertTrue(len(clues) > 0, msg="ClueSet failed to read base clues.")


class testClueManager(unittest.TestCase):
    def test_get_base_clues(self):
        clue_manager = ClueManager([ClueSetType.BASE])
        clues = clue_manager.get_clues()
        self.assertTrue(len(clues) > 0, msg="No clues found in base set")

    def test_parse_clue(self):
        clue_manager = ClueManager([ClueSetType.BASE])
        test_clue = "H1e2l#l$o w?o$2rLD"
        test_clue_unchanged = "hello world"
        self.assertEqual(
            clue_manager._process_phrase(test_clue),
            test_clue_unchanged,
            msg="ClueManager processes clue correctly.",
        )
        self.assertEqual(
            clue_manager._process_phrase(test_clue_unchanged),
            test_clue_unchanged,
            msg="ClueManager ignores already processed clue.",
        )
