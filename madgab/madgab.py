import json
import os
import random
import re

import numpy as np
import pandas as pd
from scipy.stats import triang

WORD_MAPPING_FILE = os.path.join(
    os.path.dirname(__file__),
    "word_to_phonemes.json"
)
PHONEME_MAPPING_FILE = os.path.join(
    os.path.dirname(__file__),
    "phoneme_to_pronunciation.json"
)

FREQUENCY_FILENAME = os.path.join(
    os.path.dirname(__file__),
    "frequency.csv"
)

def word_to_pronunciation(word, word_to_phoneme, phoneme_to_pronunciation):
    """ Task a word a returns its phonetic spelling. """
    # Get the phoneme list for the word (choose random pronunciation).
    try:
        phoneme = random.choice(word_to_phoneme[word.lower()])
    except KeyError:
        return word

    # Split into list of individual phonemes.
    phonemes = phoneme.split(" ")

    # Get random phonetic spelling for each phoneme and join.
    return "".join([random.choice(phoneme_to_pronunciation[p]) for p in phonemes])


def mad_gabify(phrase, difficulty="hard"):
    """Takes a phrase and returns its Mad Gabified version.

    Args:
        phrase (str): Phrased to be mad gabified.
        hard (bool): What difficulty to use. "easy" does a pure phonetic conversion.
            "hard" adds in random spacing. Defaults "easy".

    Returns:
        str: Phrased after conversion.

    """
    # Load the mappings
    with open(WORD_MAPPING_FILE) as file:
        word_to_phoneme = json.load(file)
    with open(PHONEME_MAPPING_FILE) as file:
        phoneme_to_pronunciation = json.load(file)

    # Change to lowercase and sub out any irrelevant characters.
    phrase = phrase.lower()
    phrase = re.sub(r"[^a-z '.]", "", phrase)

    # Split the phrase into words.
    words = phrase.split(" ")

    # Mad Gab each word.
    mad_gabed = [
        word_to_pronunciation(word, word_to_phoneme, phoneme_to_pronunciation)
        for word in words
    ]

    # Generate frequency matrix
    freq = FrequencyMatrix()

    # Add the spaces in
    mad_gabed = " ".join(mad_gabed)

    # If Hard, add randomized spaces.
    if difficulty == "hard":
        mad_gabed = add_spaces(mad_gabed, freq)

    return " ".join([word.capitalize() for word in mad_gabed.split(" ")])


def add_spaces(phrase, freq):
    """ Use the frequency matrix to reasonably insert spaces. """

    # Define constants for the triangle distribution
    left_bound = 2
    right_bound = 8
    desired_value = 4

    # Define distribution parameters based on the constants
    scale = right_bound - left_bound
    loc = left_bound
    c = (desired_value - left_bound) / scale

    def triang_cdf(x):
        return triang.cdf(x, c=c, loc=loc, scale=scale)

    # Remove spaces from phrase.
    phrase = phrase.replace(" ", "")

    if not phrase:
        return phrase

    end_str = phrase[0]
    cur_len = 1

    for i in range(1, len(phrase)):
        if i == len(phrase) - 1:
            end_str += phrase[i]
            continue
        p1 = freq[end_str[-1], phrase[i]]
        p2 = freq[end_str[-1], " "] * triang_cdf(cur_len)

        # Normalize
        try:
            p1_norm = p1 / (p1 + p2)
            p2_norm = p2 / (p1 + p2)
        except ZeroDivisionError:
            p1_norm = p2_norm = 0.5

        choice = np.random.choice([0, 1], p = [p1_norm, p2_norm])

        if choice == 0:
            end_str += phrase[i]
            cur_len += 1
        else:
            end_str += " " + phrase[i]
            cur_len = 1

    return end_str

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

        def make_index(ind):
            if ind == " ":
                return 26
            else:
                return ord(ind) - ord('a')

        x_ind = make_index(x)
        y_ind = make_index(y)

        if not 0 <= x_ind <= 26 or not 0 <= y_ind <= 26:
            raise(KeyError("Indexes should be lowercase letters or spaces."))

        return self.frequency_matrix.iloc[x_ind, y_ind]

    def normalize(self):
        self.frequency_matrix = self.frequency_matrix.div(
            self.frequency_matrix.sum(axis=1), axis=0
        )


def tester():
    while True:
        phrase = input("Enter a phrase ('q' to quit): ")
        if phrase == 'q':
            break
        print(mad_gabify(phrase))




if __name__ == "__main__":
    tester()