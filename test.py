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

    def testCalculateBonus(self):
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

    def testChangeActiveTeam(self):
        game = Game("")

        try:
            game.change_active_team()
        except InvalidState:
            pass
        else:
            self.fail("Invalid change team not caught")

        game.start_turn()
        game.change_active_team()
        self.assertFalse(game.team_1_turn, "Check active team change")

    def testCheckGameOver(self):
        game = Game("")

        game.team_1_score = game.win_threshold + 1
        self.assertFalse(game.check_game_over(), "Game over on wrong turn")

        game.team_1_turn = False
        self.assertTrue(game.check_game_over(), "Correct game over state")

    def testEndActiveState(self):
        game = Game("")

        try:
            game.end_active_state(True, 0)
        except InvalidState:
            pass
        else:
            self.fail("Invalid state on end active state not caught")

        # Test stealing case
        game.start_turn()
        game.end_active_state(False, 0)
        self.assertEqual(game.state, State.STEALING, "Check game in stealing state")
        self.assertEqual(game.team_1_score, 0, "Check score not updated")

        # Test all correct to idle state
        game = Game("")
        game.start_turn()
        game.current_turn_correct = game.words_per_turn - 1
        game.end_active_state(True, game.seconds_per_turn * 2/3 + 1)

        self.assertEqual(game.state, State.IDLE, "Check game in idle state - all correct")
        self.assertFalse(game.team_1_turn, "Check that turn has changed - all correct")
        self.assertEqual(game.team_1_score, 4, "Check bonus applied")

        # Test correct to game over state
        game = Game("")
        game.start_turn()
        game.current_turn_correct = game.words_per_turn - 1
        game.team_1_turn = False
        game.team_2_score = game.win_threshold - 2
        game.end_active_state(True, game.seconds_per_turn * 2/3 + 1)

        self.assertEqual(game.state, State.OVER, "Check game in over state")
        self.assertEqual(game.winning_team, "Team 2", "Check winning team correct")

        # Test none missed to idle state
        game = Game("")
        game.start_turn()
        game.end_active_state(True, game.seconds_per_turn * 2/3 + 1)

        self.assertEqual(game.state, State.IDLE, "Check game in idle state")
        self.assertFalse(game.team_1_turn, "Check that turn has changed")

    def testIncrementActiveState(self):
        game = Game("")

        try:
            game.increment_active_state(False)
        except InvalidState:
            pass
        else:
            self.fail("Invalid increment active state not caught")

        game.start_turn()
        last_phrase = game.current_phrase
        last_madgab = game.current_madgab

        game.increment_active_state(False)
        self.assertNotEqual(game.current_phrase, last_phrase, "Check current phrase changed")
        self.assertNotEqual(game.current_madgab, last_madgab, "Check current madgab changed")
        self.assertEqual(game.team_1_score, 0, "Check score not changed")
        self.assertEqual(len(game.current_turn_clues), 1, "Check phrase added to current turn clues")

        game.increment_active_state(True)
        self.assertEqual(game.team_1_score, 1, "Check score changed changed")

        game.current_turn_counter = game.words_per_turn
        try:
            game.increment_active_state(False)
        except InvalidState:
            pass
        else:
            self.fail("Invalid state on increment not caught")

    def testNewPhrase(self):
        game = Game("")
        game.new_phrase()
        self.assertIsNotNone(game.current_phrase, "Check that phrase is generated")
        self.assertIsNotNone(game.current_category, "Check that category is generated")
        self.assertTrue(isinstance(game.current_phrase, str), "Check phrase is str")
        self.assertTrue(isinstance(game.current_category, str), "Check category is str")
        self.assertTrue(isinstance(game.current_madgab, str), "Check madgab is str")
        self.assertIsNotNone(game.current_madgab, "Check that madgab generated")
        self.assertNotEqual(game.current_phrase, game.current_madgab, "Check phrase has been changed")

    def testResetTurn(self):
        game = Game("")

        game.start_turn()
        game.increment_active_state(True)
        self.assertEqual(len(game.current_turn_clues), 1, "Check current turn clues")
        self.assertIsNotNone(game.current_phrase, "Check current phrase")
        self.assertIsNotNone(game.current_madgab, "Check current madgab")
        self.assertEqual(game.current_turn_counter, 2, "Check counter")
        self.assertEqual(game.current_turn_correct, 1, "Check correct")

        game.reset_turn()
        self.assertEqual(len(game.current_turn_clues), 0, "Check current turn clues reset")
        self.assertIsNone(game.current_phrase, "Check current phrase reset")
        self.assertIsNone(game.current_madgab, "Check current madgab reset")
        self.assertEqual(game.current_turn_counter, 0, "Check counter reset")
        self.assertEqual(game.current_turn_correct, 0, "Check correct reset")

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

    def testSteal(self):
        game = Game("")

        try:
            game.steal(2)
        except InvalidState:
            pass
        else:
            self.fail("Steal state check failed")

        game.state = State.STEALING
        game.steal(2)

        self.assertEqual(game.team_2_score, 2, "Check other teams score")

    def testToggleDifficulty(self):
        game = Game("")

        self.assertEqual(game.difficulty, "hard", "Initially difficulty")
        game.toggle_difficulty()
        self.assertEqual(game.difficulty, "easy", "After first toggle")
        game.toggle_difficulty()
        self.assertEqual(game.difficulty, "hard", "After second toggle")

    def testUpdateScore(self):
        game = Game("")

        game.update_score(2)
        self.assertEqual(game.team_1_score, 2, "Check team 1 update/team 1 active")

        game.update_score(1, False)
        self.assertEqual(game.team_2_score, 1, "Check team2 update/team 1 active")

        game.reset("")
        game.state = State.ACTIVE
        game.change_active_team()
        game.update_score(2)
        self.assertEqual(game.team_2_score, 2, "Check team 2 update/team 2 active")

        game.update_score(1, False)
        self.assertEqual(game.team_1_score, 1, "Check team 2 update/team 1 active")

if __name__ == '__main__':
    unittest.main()