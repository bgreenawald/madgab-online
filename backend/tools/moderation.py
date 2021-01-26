"""
Use Azure cognitive services to assess how appropriate
the clues are.
"""

import json
import os
import time
from dotenv import load_dotenv
from typing import Dict, List
from urllib.parse import urlencode

import requests
from tqdm import tqdm

load_dotenv()


def load_clues(filename) -> List[str]:
    with open(filename, "r") as file:
        lines = file.readlines()
    return [x.split(" | ")[0].strip() for x in lines]


def get_api_url() -> str:
    params = urlencode({"classify": "True"})
    base_endpoint = os.getenv("CONTENT_MODERATOR_ENDPOINT")
    url_extension = "contentmoderator/moderate/v1.0/ProcessText/Screen"
    return f"{base_endpoint}/{url_extension}?{params}"


def get_api_headers() -> Dict:
    return {
        "Content-Type": "text/plain",
        "Ocp-Apim-Subscription-Key": os.getenv("CONTENT_MODERATOR_API_KEY"),
    }


def get_existing_clues(filename) -> Dict:
    with open(filename, "r") as file:
        return json.loads(file.read())


def main():
    clues = load_clues("clues/clues.txt")
    api_url = get_api_url()
    headers = get_api_headers()
    clue_info = get_existing_clues("output/clue_info.json")
    for clue in tqdm(clues):
        # See if a previous run of the clue results in error, skip otherwise
        if clue in clue_info:
            if "Classification" in clue_info[clue]:
                continue
        resp = requests.post(api_url, headers=headers, data=clue)
        if resp.status_code != 200:
            print(f"Failed on clue {clue}")
        response_content = resp.content.decode()
        clue_info[clue] = json.loads(response_content)

        # Ensure not to overload API past limit
        time.sleep(1)

    with open("output/clue_info.json", "w+") as file:
        file.write(json.dumps(clue_info, sort_keys=True, indent=4))


if __name__ == "__main__":
    main()
