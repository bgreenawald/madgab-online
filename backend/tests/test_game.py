import unittest

from src.clues.clue_manager import (
    Clue,
    ClueSet,
    ClueManager,
    ClueSetManager,
    ClueSetType,
)
from src.game.game import Game, InvalidState, State


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
                    Game("", [ClueSetType.BASE], win_threshold=thresh).win_threshold,
                    test,
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
                    Game(
                        "", [ClueSetType.BASE], words_per_turn=words_per_turn
                    ).words_per_turn,
                    test,
                )

        params_seconds_per_turn = [
            (90, 90, "Standard seconds_per_turn"),
            (50, 60, "seconds_per_turn upper bound"),
            (130, 120, "seconds_per_turn upper bound"),
        ]
        for seconds_per_turn, test, msg in params_seconds_per_turn:
            with self.subTest(msg):
                self.assertEqual(
                    Game(
                        "", [ClueSetType.BASE], seconds_per_turn=seconds_per_turn
                    ).seconds_per_turn,
                    test,
                )

    def testCalculateBonus(self):
        game = Game("", [ClueSetType.BASE])
        seconds = game.seconds_per_turn

        game._calculate_bonus(seconds * 2 / 3 + 1)
        with self.subTest("Big bonus"):
            self.assertEqual(game.team_1_score, 3)

        game._calculate_bonus(seconds * 1 / 2)
        with self.subTest("Medium bonus"):
            self.assertEqual(game.team_1_score, 5)

        game._calculate_bonus(seconds * 1 / 4)
        with self.subTest("Small bonus"):
            self.assertEqual(game.team_1_score, 6)

        game._calculate_bonus(seconds * 1 / 6 - 1)
        with self.subTest("No bonus"):
            self.assertEqual(game.team_1_score, 6)

    def testChangeActiveTeam(self):
        game = Game("", [ClueSetType.BASE])

        with self.subTest("Invalid change team not caught"):
            try:
                game._change_active_team()
            except InvalidState:
                pass
            else:
                self.fail()

        game.start_turn()
        game.current_turn_correct = game.words_per_turn - 1
        game.end_active_state(True, 0)
        game._change_active_team()
        with self.subTest("Check active team change"):
            self.assertFalse(game.team_1_turn)

    def testCheckGameOver(self):
        game = Game("", [ClueSetType.BASE])

        # Trivial game over check
        game.team_1_score = game.win_threshold
        with self.subTest("Game over false on wrong turn."):
            self.assertFalse(game._check_game_over())

        game.team_1_turn = False
        with self.subTest("Game over true on correcdt turn."):
            self.assertTrue(game._check_game_over())

        game.team_1_score = game.win_threshold - 1
        with self.subTest("Check game not over, score not high enough."):
            self.assertFalse(game._check_game_over())

        # Game over within end active state
        game = Game("", [ClueSetType.BASE])
        game.start_turn()
        game.end_active_state(False, 0)
        game.end_turn()
        game.steal(0)
        game.start_turn()
        game.team_2_score = game.win_threshold - 1
        with self.subTest(
            "Check winning team is none before end condition in active state."
        ):
            self.assertEqual(game.winning_team, "")

        game.end_active_state(True, 0)
        game.end_turn()
        with self.subTest("Check team 2 winning team from active state."):
            self.assertEqual(game.winning_team, "Team 2")

        # Check game over from steal
        game = Game("", [ClueSetType.BASE])
        game.start_turn()
        game.end_active_state(False, 0)
        game.end_turn()
        game.steal(0)
        game.start_turn()
        game.team_1_score = game.win_threshold - 1
        game.end_active_state(0, 0)
        game.end_turn()

        with self.subTest(
            "Check winning team is none before end condition in steal state."
        ):
            self.assertEqual(game.winning_team, "")

        game.steal(3)
        with self.subTest("Check team 1 winning team from steal state."):
            self.assertEqual(game.winning_team, "Team 1")

    def testEndActiveState(self):
        game = Game("", [ClueSetType.BASE])
        with self.subTest("Invalid state on end active state not caught"):
            try:
                game.end_active_state(True, 0)
            except InvalidState:
                pass
            else:
                self.fail()

        # Test proceeded to review after some missed.
        game.start_turn()
        game.end_active_state(False, 0)
        with self.subTest("Check game in review state - not all correct."):
            self.assertEqual(game.state, State.REVIEW)
        with self.subTest("Check score not updated"):
            self.assertEqual(game.team_1_score, 0)

        # Test all correct to review state
        game = Game("", [ClueSetType.BASE])
        game.start_turn()
        game.current_turn_correct = game.words_per_turn - 1
        game.end_active_state(True, game.seconds_per_turn * 2 / 3 + 1)

        with self.subTest("Check game in review state - all correct."):
            self.assertEqual(game.state, State.REVIEW)
        with self.subTest("Check bonus applied"):
            self.assertEqual(game.team_1_score, 4)

    def testEndTurn(self):
        game = Game("", [ClueSetType.BASE])
        with self.subTest("Invalid state on end turn not caught"):
            try:
                game.end_turn()
            except InvalidState:
                pass
            else:
                self.fail()

        # Test end active state to end turn
        game = Game("", [ClueSetType.BASE])
        game.start_turn()
        game.current_turn_counter = game.words_per_turn
        game.current_turn_correct = game.words_per_turn - 1
        game.end_active_state(True, game.seconds_per_turn * 2 / 3 + 1)
        game.end_turn()

        with self.subTest("Check in idle state from end turn (non-stealing)."):
            self.assertEqual(game.state, State.IDLE)
        with self.subTest("Check that team has changed from end turn (non-stealing)"):
            self.assertFalse(game.team_1_turn)

        # Test end turn to steal state
        game = Game("", [ClueSetType.BASE])
        game.start_turn()
        game.end_active_state(False, 0)
        game.end_turn()
        with self.subTest("Check in idle state from end turn (stealing)."):
            self.assertEqual(game.state, State.STEALING)

        # Test correct to game over state
        game = Game("", [ClueSetType.BASE])
        game.start_turn()
        game.current_turn_correct = game.words_per_turn - 1
        game.team_1_turn = False
        game.team_2_score = game.win_threshold - 2
        game.end_active_state(True, game.seconds_per_turn * 2 / 3 + 1)
        game.end_turn()
        game.steal(0)

        with self.subTest("Check game in over state"):
            self.assertEqual(game.state, State.OVER)
        with self.subTest("Check winning team correct"):
            self.assertEqual(game.winning_team, "Team 2")

    def testIncrementActiveState(self):
        game = Game("", [ClueSetType.BASE])
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
        with self.subTest("Check phrase added to current turn clue"):
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
        game = Game("", [ClueSetType.BASE])
        game.new_phrase()
        with self.subTest("Check that phrase is generated"):
            self.assertIsNotNone(game.current_phrase)
        with self.subTest("Check phrase is str"):
            self.assertTrue(isinstance(game.current_phrase, str))
        with self.subTest("Check madgab is str"):
            self.assertTrue(isinstance(game.current_madgab, str))
        with self.subTest("Check that madgab generated"):
            self.assertIsNotNone(game.current_madgab)
        with self.subTest("Check phrase has been changed"):
            self.assertNotEqual(game.current_phrase, game.current_madgab)

    def test_ResetClues(self):
        game = Game("", [ClueSetType.BASE])
        initial_clue_length = len(game.clues)
        game.new_phrase()
        with self.subTest("Check clues length before reset clues."):
            self.assertEqual(len(game.clues), initial_clue_length - 1)
        with self.subTest("Check seen clues length after reset clues."):
            self.assertEqual(len(game.seen_clues), 1)
        game._reset_clues()
        with self.subTest("Check clues length after reset clues."):
            self.assertEqual(len(game.clues), initial_clue_length)
        with self.subTest("Check seen clues length after new phrase."):
            self.assertEqual(len(game.seen_clues), 0)

    def test_NewPhrase(self):
        game = Game("", [ClueSetType.BASE])
        initial_clue_length = len(game.clues)
        game.seen_clues = game.clues
        game.clues = []
        game._new_phrase()
        with self.subTest("Check clues length after new phrase reset."):
            self.assertEqual(len(game.clues), initial_clue_length - 1)
        with self.subTest("Check seen clues length after new phrase reset."):
            self.assertEqual(len(game.seen_clues), 1)

    def testUpdateClueSets(self):
        game = Game("", [ClueSetType.BASE])
        initial_clue_length = len(game.clues)
        game.update_clue_sets([ClueSetType.BASE, ClueSetType.MOVIES])
        with self.subTest("Check clues length after update clue sets."):
            self.assertTrue(len(game.clues) > initial_clue_length)
        game.update_clue_sets([ClueSetType.BASE])
        with self.subTest("Check seen clues length after revert update clue sets."):
            self.assertEqual(len(game.clues), initial_clue_length)

    def test_UpdateClues_MultipleCluesets(self):
        game = Game("", [ClueSetType.BASE])
        initial_clue_length = len(game.clues)
        game.new_phrase()
        game._update_clues()
        with self.subTest("Check clues length after update clues."):
            self.assertEqual(len(game.clues), initial_clue_length - 1)
        with self.subTest("Check seen clues length after update clues."):
            self.assertEqual(len(game.seen_clues), 1)

    def testResetTurn(self):
        game = Game("", [ClueSetType.BASE])

        game.start_turn()
        game.increment_active_state(True)
        with self.subTest("Check current turn clue"):
            self.assertEqual(len(game.current_turn_clues), 1)
        with self.subTest("Check current phrase"):
            self.assertIsNotNone(game.current_phrase)
        with self.subTest("Check current madgab"):
            self.assertIsNotNone(game.current_madgab)
        with self.subTest("Check counter"):
            self.assertEqual(game.current_turn_counter, 2)
        with self.subTest("Check correct"):
            self.assertEqual(game.current_turn_correct, 1)

        game._reset_turn()
        with self.subTest("Check current turn clue reset"):
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
        game = Game("", [ClueSetType.BASE])

        with self.subTest("Initial round number."):
            self.assertEqual(game.round_number, 0)

        # Start and end the turn
        game.start_turn()

        with self.subTest("First round number active state change."):
            self.assertEqual(game.round_number, 1)

        # Check a new turn, round number should not update.
        game.end_active_state(False, 0)
        game.end_turn()
        game.steal(0)
        game.start_turn()

        with self.subTest("Team 2 turn, round number should not update."):
            self.assertEqual(game.round_number, 1)

        # Check a new turn, round number should update.
        game.end_active_state(False, 0)
        game.end_turn()
        game.steal(0)
        game.start_turn()

        with self.subTest("Second round number active state change."):
            self.assertEqual(game.round_number, 2)

    def testStartTurn(self):

        game = Game("", [ClueSetType.BASE])

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
        game = Game("", [ClueSetType.BASE])

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
        with self.subTest("Check game in review state."):
            self.assertEqual(game.state, State.IDLE)

    def testToggleDifficulty(self):
        game = Game("", [ClueSetType.BASE])
        with self.subTest("Initially difficulty"):
            self.assertEqual(game.difficulty, "hard")
        game.toggle_difficulty()
        with self.subTest("After first toggle"):
            self.assertEqual(game.difficulty, "easy")
        game.toggle_difficulty()
        with self.subTest("After second toggle"):
            self.assertEqual(game.difficulty, "hard")

    def testUpdateScore(self):
        game = Game("", [ClueSetType.BASE])

        game._update_score(2)
        with self.subTest("Check team 1 update/team 1 active"):
            self.assertEqual(game.team_1_score, 2)

        game._update_score(1, False)
        with self.subTest("Check team2 update/team 1 active"):
            self.assertEqual(game.team_2_score, 1)

        game.reset("")
        game.state = State.REVIEW
        game._change_active_team()
        game._update_score(2)
        with self.subTest("Check team 2 update/team 2 active"):
            self.assertEqual(game.team_2_score, 2)

        game._update_score(1, False)
        with self.subTest("Check team 2 update/team 1 active"):
            self.assertEqual(game.team_1_score, 1)


if __name__ == "__main__":
    unittest.main()
