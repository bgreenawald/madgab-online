import re
import unittest

from game import Game, InvalidState, State


# Generate the list of clues
with open("./clues/clues.txt", "r") as file:
    clues = []
    for clue in file.readlines():
        category, phrase = clue.strip().split(" | ")

        # Preprocess the phrase, change to lowercase and sub out any irrelevant characters.
        phrase = phrase.lower()
        phrase = re.sub(r"[^a-z '.]", "", phrase)

        clues.append((category, phrase))


class testGameMethods(unittest.TestCase):
    def test_init(self):
        # Test the win threshold
        params_threshold = [
            (30, 30, "Standard threshold"),
            (0, 10, "Threshold lower bound"),
            (75, 50, "Threshold upper bound"),
        ]
        for thresh, test, msg in params_threshold:
            with self.subTest(msg):
                self.assertEqual(
                    Game("", clues, win_threshold=thresh).win_threshold, test
                )

        # Test the words per turn threshold
        params_words_per_turn = [
            (3, 3, "Standard words_per_turn"),
            (0, 3, "words_per_turn lower bound"),
            (6, 5, "words_per_turn upper bound"),
        ]
        for words_per_turn, test, msg in params_words_per_turn:
            with self.subTest(msg):
                self.assertEqual(
                    Game("", clues, words_per_turn=words_per_turn).words_per_turn, test
                )

        params_seconds_per_turn = [
            (90, 90, "Standard seconds_per_turn"),
            (50, 60, "seconds_per_turn upper bound"),
            (130, 120, "seconds_per_turn upper bound"),
        ]
        for seconds_per_turn, test, msg in params_seconds_per_turn:
            with self.subTest(msg):
                self.assertEqual(
                    Game("", clues, seconds_per_turn=seconds_per_turn).seconds_per_turn,
                    test,
                )

    def testCalculateBonus(self):
        game = Game("", clues)
        seconds = game.seconds_per_turn

        game.calculate_bonus(seconds * 2 / 3 + 1)
        with self.subTest("Big bonus"):
            self.assertEqual(game.team_1_score, 3)

        game.calculate_bonus(seconds * 1 / 2)
        with self.subTest("Medium bonus"):
            self.assertEqual(game.team_1_score, 5)

        game.calculate_bonus(seconds * 1 / 4)
        with self.subTest("Small bonus"):
            self.assertEqual(game.team_1_score, 6)

        game.calculate_bonus(seconds * 1 / 6 - 1)
        with self.subTest("No bonus"):
            self.assertEqual(game.team_1_score, 6)

    def testChangeActiveTeam(self):
        game = Game("", clues)

        with self.subTest("Invalid change team not caught"):
            try:
                game.change_active_team()
            except InvalidState:
                pass
            else:
                self.fail()

        game.start_turn()
        game.change_active_team()
        with self.subTest("Check active team change"):
            self.assertFalse(game.team_1_turn)

    def testCheckGameOver(self):
        game = Game("", clues)

        game.team_1_score = game.win_threshold + 1
        with self.subTest("Game over on wrong turn"):
            self.assertFalse(game.check_game_over())

        game.team_1_turn = False
        with self.subTest("Correct game over state"):
            self.assertTrue(game.check_game_over())

    def testEndActiveState(self):
        game = Game("", clues)
        with self.subTest("Invalid state on end active state not caught"):
            try:
                game.end_active_state(True, 0)
            except InvalidState:
                pass
            else:
                self.fail()

        # Test stealing case
        game.start_turn()
        game.end_active_state(False, 0)
        with self.subTest("Check game in stealing state"):
            self.assertEqual(game.state, State.STEALING)
        with self.subTest("Check score not updated"):
            self.assertEqual(game.team_1_score, 0)

        # Test all correct to idle state
        game = Game("", clues)
        game.start_turn()
        game.current_turn_correct = game.words_per_turn - 1
        game.end_active_state(True, game.seconds_per_turn * 2 / 3 + 1)

        with self.subTest("Check game in idle state - all correct"):
            self.assertEqual(game.state, State.IDLE)
        with self.subTest("Check that turn has changed - all correct"):
            self.assertFalse(game.team_1_turn)
        with self.subTest("Check bonus applied"):
            self.assertEqual(game.team_1_score, 4)

        # Test correct to game over state
        game = Game("", clues)
        game.start_turn()
        game.current_turn_correct = game.words_per_turn - 1
        game.team_1_turn = False
        game.team_2_score = game.win_threshold - 2
        game.end_active_state(True, game.seconds_per_turn * 2 / 3 + 1)

        with self.subTest("Check game in over state"):
            self.assertEqual(game.state, State.OVER)
        with self.subTest("Check winning team correct"):
            self.assertEqual(game.winning_team, "Team 2")

        # Test none missed to idle state
        game = Game("", clues)
        game.start_turn()
        game.end_active_state(True, game.seconds_per_turn * 2 / 3 + 1)
        with self.subTest("Check game in idle state"):
            self.assertEqual(game.state, State.IDLE)
        with self.subTest("Check that turn has changed"):
            self.assertFalse(game.team_1_turn)

    def testIncrementActiveState(self):
        game = Game("", clues)
        with self.subTest("Invalid increment active state not caught"):
            try:
                game.increment_active_state(False)
            except InvalidState:
                pass
            else:
                self.fail()

        game.start_turn()
        last_phrase = game.current_phrase
        last_madgab = game.current_madgab

        game.increment_active_state(False)
        with self.subTest("Check current phrase changed"):
            self.assertNotEqual(game.current_phrase, last_phrase)
        with self.subTest("Check current madgab changed"):
            self.assertNotEqual(game.current_madgab, last_madgab)
        with self.subTest("Check score not changed"):
            self.assertEqual(game.team_1_score, 0)
        with self.subTest("Check phrase added to current turn clues"):
            self.assertEqual(len(game.current_turn_clues), 1)

        game.increment_active_state(True)
        with self.subTest("Check score changed changed"):
            self.assertEqual(game.team_1_score, 1)

        game.current_turn_counter = game.words_per_turn
        with self.subTest("Invalid state on increment not caught"):
            try:
                game.increment_active_state(False)
            except InvalidState:
                pass
            else:
                self.fail()

    def testNewPhrase(self):
        game = Game("", clues)
        game.new_phrase()
        with self.subTest("Check that phrase is generated"):
            self.assertIsNotNone(game.current_phrase)
        with self.subTest("Check that category is generated"):
            self.assertIsNotNone(game.current_category)
        with self.subTest("Check phrase is str"):
            self.assertTrue(isinstance(game.current_phrase, str))
        with self.subTest("Check category is str"):
            self.assertTrue(isinstance(game.current_category, str))
        with self.subTest("Check madgab is str"):
            self.assertTrue(isinstance(game.current_madgab, str))
        with self.subTest("Check that madgab generated"):
            self.assertIsNotNone(game.current_madgab)
        with self.subTest("Check phrase has been changed"):
            self.assertNotEqual(game.current_phrase, game.current_madgab)

    def testResetTurn(self):
        game = Game("", clues)

        game.start_turn()
        game.increment_active_state(True)
        with self.subTest("Check current turn clues"):
            self.assertEqual(len(game.current_turn_clues), 1)
        with self.subTest("Check current phrase"):
            self.assertIsNotNone(game.current_phrase)
        with self.subTest("Check current madgab"):
            self.assertIsNotNone(game.current_madgab)
        with self.subTest("Check counter"):
            self.assertEqual(game.current_turn_counter, 2)
        with self.subTest("Check correct"):
            self.assertEqual(game.current_turn_correct, 1)

        game.reset_turn()
        with self.subTest("Check current turn clues reset"):
            self.assertEqual(len(game.current_turn_clues), 0)
        with self.subTest("Check current phrase reset"):
            self.assertEqual(game.current_phrase, "")
        with self.subTest("Check current madgab reset"):
            self.assertEqual(game.current_madgab, "")
        with self.subTest("Check counter reset"):
            self.assertEqual(game.current_turn_counter, 0)
        with self.subTest("Check correct reset"):
            self.assertEqual(game.current_turn_correct, 0)

    def testRoundNumber(self):
        game = Game("", clues)

        with self.subTest("Initial round number."):
            self.assertEqual(game.round_number, 0)

        # Start and end the turn
        game.start_turn()

        with self.subTest("First round number active state change."):
            self.assertEqual(game.round_number, 1)

        # Check a new turn, round number should not update.
        game.end_active_state(game.words_per_turn, 0)
        game.start_turn()

        with self.subTest("Team 2 turn, round number should not update."):
            self.assertEqual(game.round_number, 1)

        # Check a new turn, round number should update.
        game.end_active_state(game.words_per_turn, 0)
        game.start_turn()

        with self.subTest("Second round number active state change."):
            self.assertEqual(game.round_number, 2)

    def testStartTurn(self):

        game = Game("", clues)

        game.start_turn()
        with self.subTest("Test phrase"):
            self.assertIsNotNone(game.current_phrase)
        with self.subTest("Test madgabbed"):
            self.assertIsNotNone(game.current_madgab)
        with self.subTest("Current turn counter"):
            self.assertEqual(game.current_turn_counter, 1)
        with self.subTest("Current correct counter"):
            self.assertEqual(game.current_turn_correct, 0)
        with self.subTest("Check state"):
            self.assertEqual(game.state, State.ACTIVE)

        with self.subTest("Cannot start turn in active state"):
            try:
                game.start_turn()
            except InvalidState:
                pass
            else:
                self.fail()

    def testSteal(self):
        game = Game("", clues)

        with self.subTest("Steal state check failed"):
            try:
                game.steal(2)
            except InvalidState:
                pass
            else:
                self.fail()

        game.state = State.STEALING
        game.steal(2)
        with self.subTest("Check other teams score"):
            self.assertEqual(game.team_2_score, 2)

    def testToggleDifficulty(self):
        game = Game("", clues)
        with self.subTest("Initially difficulty"):
            self.assertEqual(game.difficulty, "hard")
        game.toggle_difficulty()
        with self.subTest("After first toggle"):
            self.assertEqual(game.difficulty, "easy")
        game.toggle_difficulty()
        with self.subTest("After second toggle"):
            self.assertEqual(game.difficulty, "hard")

    def testUpdateScore(self):
        game = Game("", clues)

        game.update_score(2)
        with self.subTest("Check team 1 update/team 1 active"):
            self.assertEqual(game.team_1_score, 2)

        game.update_score(1, False)
        with self.subTest("Check team2 update/team 1 active"):
            self.assertEqual(game.team_2_score, 1)

        game.reset("", clues)
        game.state = State.ACTIVE
        game.change_active_team()
        game.update_score(2)
        with self.subTest("Check team 2 update/team 2 active"):
            self.assertEqual(game.team_2_score, 2)

        game.update_score(1, False)
        with self.subTest("Check team 2 update/team 1 active"):
            self.assertEqual(game.team_1_score, 1)


if __name__ == "__main__":
    unittest.main()
