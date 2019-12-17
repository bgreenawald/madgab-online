import json
import os
import random

import numpy as np
from scipy.stats import triang

from .frequency_matrix import FrequencyMatrix

WORD_MAPPING_FILE = os.path.join(os.path.dirname(__file__), "word_to_phonemes.json")
PHONEME_MAPPING_FILE = os.path.join(
    os.path.dirname(__file__), "phoneme_to_pronunciation.json"
)

# Load the mappings
with open(WORD_MAPPING_FILE) as file:
    WORD_TO_PHONEME = json.load(file)
with open(PHONEME_MAPPING_FILE) as file:
    PHONEME_TO_PRONUNCIATION = json.load(file)

# Generate frequency matrix
FREQUENCY = FrequencyMatrix()


def word_to_pronunciation(word: str) -> str:
    """ Task a word a returns its phonetic spelling. """
    # Get the phoneme list for the word (choose random pronunciation).
    try:
        phoneme = random.choice(WORD_TO_PHONEME[word.lower()])
    except KeyError:
        return word

    # Split into list of individual phonemes.
    phonemes = phoneme.split(" ")

    # Get random phonetic spelling for each phoneme and join.
    return "".join([random.choice(PHONEME_TO_PRONUNCIATION[p]) for p in phonemes])


def mad_gabify(phrase: str, difficulty: str = "hard") -> str:
    """Takes a phrase and returns its Mad Gabified version.
    Args:
        phrase (str): Phrased to be mad gabified.
        hard (bool): What difficulty to use. "easy" does a pure phonetic conversion.
            "hard" adds in random spacing. Defaults "easy".
    Returns:
        str: Phrased after conversion.
    """

    # Split the phrase into words.
    words = phrase.split(" ")

    # Mad Gab each word.
    mad_gabed_list = [word_to_pronunciation(word) for word in words]

    # Add the spaces in
    mad_gabed = " ".join(mad_gabed_list)

    # If Hard, add randomized spaces.
    if difficulty == "hard":
        mad_gabed = add_spaces(mad_gabed)

    return " ".join([word.capitalize() for word in mad_gabed.split(" ")])


def add_spaces(phrase: str) -> str:
    """ Use the frequency matrix to reasonably insert spaces. """

    # Define constants for the triangle distribution
    left_bound = 3
    right_bound = 8
    desired_value = 5

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
        p1 = FREQUENCY[end_str[-1], phrase[i]]
        p2 = FREQUENCY[end_str[-1], " "] * triang_cdf(cur_len)

        # Normalize
        try:
            p1_norm = p1 / (p1 + p2)
            p2_norm = p2 / (p1 + p2)
        except ZeroDivisionError:
            p1_norm = p2_norm = 0.5

        # Further check to ensure our normalized values are finite
        if not np.isfinite(p1_norm) or not np.isfinite(p2_norm):
            p1_norm = p2_norm = 0.5

        # Decide if there should be a space or not based on the distribution
        choice = np.random.choice([0, 1], p=[p1_norm, p2_norm])

        if choice == 0:
            end_str += phrase[i]
            cur_len += 1
        else:
            end_str += " " + phrase[i]
            cur_len = 1

    return end_str


def tester():
    while True:
        phrase = input("Enter a phrase ('q' to quit): ")
        if phrase == "q":
            break
        print(mad_gabify(phrase))


if __name__ == "__main__":
    tester()
