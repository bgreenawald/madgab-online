import unittest

from game import Game, InvalidState, State

class testGameMethods(unittest.TestCase):

    def test_init(self):
        # Test the initialization methods
        self.assertEqual(Game("", win_threshold=30).win_threshold, 30, "Standard threshold")
        self.assertEqual(Game("", win_threshold=0).win_threshold, 10, "Threshold lower bound")
        self.assertEqual(Game("", win_threshold=75).win_threshold, 50, "Threshold upper bound")

        self.assertEqual(Game("", words_per_turn=3).words_per_turn, 3, "Standard words_per_turn")
        self.assertEqual(Game("", words_per_turn=0).words_per_turn, 3, "words_per_turn lower bound")
        self.assertEqual(Game("", words_per_turn=6).words_per_turn, 5, "words_per_turn upper bound")

        self.assertEqual(Game("", seconds_per_turn=90).seconds_per_turn, 90, "Standard seconds_per_turn")
        self.assertEqual(Game("", seconds_per_turn=50).seconds_per_turn, 60, "seconds_per_turn upper bound")
        self.assertEqual(Game("", seconds_per_turn=130).seconds_per_turn, 120, "seconds_per_turn upper bound")

    def testBonus(self):
        game = Game("")
        seconds = game.seconds_per_turn

        game.calculate_bonus(seconds * 2/3 + 1)
        self.assertEqual(game.team_1_score, 3, "Big bonus")

        game.calculate_bonus(seconds * 1/2)
        self.assertEqual(game.team_1_score, 5, "Medium bonus")

        game.calculate_bonus(seconds * 1/4)
        self.assertEqual(game.team_1_score, 6, "Small bonus")

        game.calculate_bonus(seconds * 1/6 - 1)
        self.assertEqual(game.team_1_score, 6, "No bonus")

    def testStartTurn(self):
        game = Game("")

        game.start_turn()
        self.assertIsNotNone(game.current_phrase, "Test phrase")
        self.assertIsNotNone(game.current_madgab, "Test madgabbed")
        self.assertEqual(game.current_turn_counter, 1, "Current turn counter")
        self.assertEqual(game.current_turn_correct, 0, "Current correct counter")
        self.assertEqual(game.state, State.ACTIVE, "Check state")

        try:
            game.start_turn()
        except InvalidState:
            pass
        else:
            self.fail("Cannot start turn in active state")

if __name__ == '__main__':
    unittest.main()