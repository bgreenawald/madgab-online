import unittest

import src.madgab.madgab as madgab


class testMadGab(unittest.TestCase):
    def testWordtoPronunciation(self):
        with self.subTest("Test valid word."):
            self.assertTrue(madgab.word_to_pronunciation("hi") in ["hi", "hay", "hahy"])

        with self.subTest("Test invalid word."):
            self.assertEqual(madgab.word_to_pronunciation("zxcr"), "zxcr")

    def testAddSpaces(self):
        with self.subTest("Test no phrase."):
            self.assertEqual(madgab.add_spaces(""), "")
