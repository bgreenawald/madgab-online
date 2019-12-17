import time
import re

from madgab.madgab import mad_gabify

with open("clues_full.txt", "r") as file:
    clues = [x.split(" | ")[0] for x in file.readlines()]

for i, clue in enumerate(clues):
    phrase = clue.lower()
    phrase = re.sub(r"[^a-z '.]", "", phrase)
    clues[i] = phrase

times = []

for clue in clues:
    t1 = time.time()
    mad_gabify(clue)
    times.append(time.time() - t1)

print(sum(times) / len(times))
