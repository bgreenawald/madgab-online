import datetime

# Define the boundaries on games
MAX_THRESHOLD = 50
MIN_THRESHOLD = 1


class Game(object):
    def __init__(self, id, win_threshold):
        self.id = id
        # Make sure threshold falls within boundaries
        self.win_threshold = min(max(MIN_THRESHOLD, win_threshold), MAX_THRESHOLD)
        self.team_1_score = 0
        self.team_2_score = 0
        # Initialize the clues
        with open("./clues.txt", "r") as file:
            self.clues = [clue.strip() for clue in file.readlines()]
        self.team_1_turn = True
        self.date_created = datetime.datetime.now()
        self.winning_team = None

    def __str__(self):
        return (
            f"ID: {self.id}\n"
            f"Win threshold: {self.win_threshold}\n"
            f"Team 1 Score: {self.team_1_score}\n"
            f"Team 2 Score: {self.team_2_score}\n"
            f"Clue: {self.clues}\n"
            f"Team 1 Turn: {self.team_1_turn}\n"
            f"Date created: {self.date_created}\n"
            f"Winning team: {self.winning_team}"
        )



