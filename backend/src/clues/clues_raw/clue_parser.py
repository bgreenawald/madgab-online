# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %% [markdown]
# # Clue Generator
#
# Scrape MadGab clues from a variety of sources.
# Remove any extra characters, make sure all clues are valid, write to file with category.

# %%
import json
import re
from typing import List

from bs4 import BeautifulSoup
import requests


# %%
# General functions and setup
all_phrases = []

with open("../../madgab/word_to_phonemes.json") as file:
    word_to_phoneme = json.load(file)


def process_phrases(phrases: List[str]):
    """
    Process the passed in phrases in the following ways

    1. Remove everything other than letters and apostraphes
    2. Make sure the word count is in [2,5]
    3. Make sure every word is in the phoneme dictionary
    """

    def valid_phrase(phrase):
        phrase = phrase.lower()
        phrase_clean = re.sub(r"[^a-zA-Z '\.]", "", phrase)
        if len(phrase_clean.split(" ")) != len(phrase.split(" ")):
            return False
        words = phrase_clean.split(" ")
        if not 2 <= len(words) <= 7 or len(phrase_clean) < 13:
            return False
        return all([word in word_to_phoneme for word in words])

    num_replace = {
        "0": "zero",
        "1": "one",
        "2": "two",
        "3": "three",
        "4": "four",
        "5": "five",
        "6": "six",
        "7": "seven",
        "8": "eight",
        "9": "nine",
    }

    for phrase in phrases:
        for num_repl in num_replace:
            phrase.replace(num_repl, num_replace[num_repl])
    phrases = [
        re.sub(r"[^a-zA-Z '\.]", "", phrase)
        for phrase in phrases
        if valid_phrase(phrase)
    ]
    return list(set(phrases))


# %% [markdown]
# ### Common Phrases
#
# https://www.phrases.org.uk/meanings/phrases-and-sayings-list.html

# %%
phrases_page = requests.get(
    "https://www.phrases.org.uk/meanings/phrases-and-sayings-list.html"
)
phrases_soup = BeautifulSoup(phrases_page.text)


# %%
phrases = [
    elem.find("a").text for elem in phrases_soup.find_all("p", {"class": "phrase-list"})
]
phrases[0:10]


# %%
processsed_phrases = process_phrases(phrases)


# %%
all_phrases += [(phrase, "General Expression") for phrase in processsed_phrases]
print(f"All phrases with phrases: {len(all_phrases)}")

# %% [markdown]
# ### Geographic Locations
#
# https://www.listchallenges.com/print-list/13033
# https://www.listchallenges.com/print-list/81758

# %%
with open("clues_temp/places.txt", "r") as file:
    places = [place.strip() for place in file.readlines()]


# %%
processsed_places = process_phrases(places)


# %%
processsed_places[0:10]


# %%
all_phrases += [(phrase, "Geographic Location") for phrase in processsed_places]
print(f"All phrases with locations: {len(all_phrases)}")

# %% [markdown]
# ### Movies
#
# https://www.imdb.com/list/ls055592025/
# https://www.filmsite.org/boxoffice.html

# %%
movie_page = requests.get("https://www.imdb.com/list/ls055592025/")
movie_soup = BeautifulSoup(movie_page.text)


# %%
movies = [
    elem.find("a").text
    for elem in movie_soup.find_all("h3", {"class": "lister-item-header"})
]
movies[0:10]


# %%
"""
with open("clues_temp/movies.txt", "w+") as file:
    file.write("\n".join(movies))
"""


# %%
with open("./movies.txt", "r") as file:
    movies_full = file.read().split("\n")


# %%
processed_movies = process_phrases(movies_full)
movie_clues = [
    {"phrase": phrase, "clueSet": "Movie", "use": True} for phrase in processed_movies
]
with open("../clue_sets/movies.json", "w+") as file:
    file.write(json.dumps(movie_clues, indent=4, sort_keys=True))

# %% [markdown]
# ### TV Shows
#
# https://www.imdb.com/list/ls066095353/

# %%
tv_page = requests.get("https://www.imdb.com/list/ls066095353/")
tv_soup = BeautifulSoup(tv_page.text)


# %%
tv = [
    elem.find("a").text
    for elem in tv_soup.find_all("h3", {"class": "lister-item-header"})
]
tv[0:10]


# %%
"""
with open("clues_temp/tv.txt", "w+") as file:
    file.write("\n".join(tv))
"""


# %%
with open("clues_temp/tv.txt", "r") as file:
    tv_full = file.read().split("\n")


# %%
processed_tv = process_phrases(tv_full)
all_phrases += [(phrase, "TV Show") for phrase in processed_tv]
print(f"All phrases with tv: {len(all_phrases)}")

# %% [markdown]
# ### Musical Artists
#
# https://www.billboard.com/charts/greatest-hot-100-artists
# https://en.wikipedia.org/wiki/List_of_best-selling_music_artists

# %%
music_page = requests.get("https://www.billboard.com/charts/greatest-hot-100-artists")
music_soup = BeautifulSoup(music_page.text)


# %%
music = [
    elem.find("a").text
    for elem in music_soup.find_all("span", {"class": "chart-list-item__title-text"})
    if elem and elem.find("a")
]
music[0:10]


# %%
"""
with open("clues_temp/music.txt", "w+") as file:
    file.write("\n".join(music))
"""


# %%
with open("clues_temp/music.txt", "r") as file:
    music_full = file.read().split("\n")


# %%
processed_music = process_phrases(music_full)
all_phrases += [(phrase, "Musical Artists") for phrase in processed_music]
print(f"All phrases with musical artists: {len(all_phrases)}")

# %% [markdown]
# ### Songs
#
# https://www.billboard.com/articles/news/hot-100-turns-60/8468142/hot-100-all-time-biggest-hits-songs-list
# https://en.wikipedia.org/wiki/List_of_best-selling_singles

# %%
song_page = requests.get(
    "https://www.billboard.com/articles/news/hot-100-turns-60/8468142/hot-100-all-time-biggest-hits-songs-list"  # noqa: E501, B950
)
song_soup = BeautifulSoup(song_page.text)


# %%
song = [
    elem.find("strong").text for elem in song_soup.find_all("p") if elem.find("strong")
]
song[0:10]


# %%
"""
with open("clues_temp/song.txt", "w+") as file:
    file.write("\n".join(song))
"""


# %%
with open("clues_temp/song.txt", "r") as file:
    song_full = file.read().split("\n")


# %%
processed_song = process_phrases(song_full)
all_phrases += [(phrase, "Song") for phrase in processed_song]
print(f"All phrases with song: {len(all_phrases)}")

# %% [markdown]
# ### Famous People
#
# https://www.biographyonline.net/people/famous-100.html

# %%
with open("clues_temp/people.txt", "r") as file:
    people = file.read().split("\n")


# %%
processed_people = process_phrases(people)
all_phrases += [(phrase, "People") for phrase in processed_people]
print(f"All phrases with people: {len(all_phrases)}")

# %% [markdown]
# ### Books
#
# https://en.wikipedia.org/wiki/List_of_best-selling_books

# %%
with open("clues_temp/books.txt", "r") as file:
    books_full = file.read().split("\n")


# %%
processed_book = process_phrases(books_full)
all_phrases += [(phrase, "Book") for phrase in processed_book]
print(f"All phrases with books: {len(all_phrases)}")

# %% [markdown]
# ## Write the results

# %%
with open("clues_full.txt", "w+") as file:
    for phrase in all_phrases:
        file.write(f"{phrase[0]} | {phrase[1]}\n")
