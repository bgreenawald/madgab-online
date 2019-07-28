import random

def madgab(phrase):
    phrase = list(phrase)
    random.shuffle(phrase)
    return ''.join(phrase)