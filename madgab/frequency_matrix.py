"""Represents the frequency matrix used to determine next characters."""
import os

import pandas as pd

FREQUENCY_FILENAME = os.path.join(os.path.dirname(__file__), "frequency.csv")


class FrequencyMatrix(object):
    """
    Wrapper function around the frequency matrix.
    Main tasks include handling indexing and normalization.
    """

    def __init__(self, filename=FREQUENCY_FILENAME):
        self.frequency_matrix = pd.read_csv(filename, header=None)
        self.normalize()

    def __getitem__(self, tup):
        x, y = tup

        def make_index(ind: str) -> int:
            if ind == " ":
                return 26
            else:
                return ord(ind) - ord("a")

        x_ind = make_index(x)
        y_ind = make_index(y)

        if not 0 <= x_ind <= 26 or not 0 <= y_ind <= 26:
            raise (KeyError("Indexes should be lowercase letters or spaces."))

        return self.frequency_matrix.iloc[x_ind, y_ind]

    def normalize(self):
        self.frequency_matrix = self.frequency_matrix.div(
            self.frequency_matrix.sum(axis=1), axis=0
        )
