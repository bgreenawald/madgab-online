"""Manage upload to S3
"""

import json
import os
from datetime import datetime
from typing import Dict

import boto3
from dotenv import load_dotenv

load_dotenv()

print("REGION: " + str(os.environ["AWS_DEFAULT_REGION"]))

# Configure boto3
session = boto3.Session(
    aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    region_name=os.environ["AWS_DEFAULT_REGION"],
)
s3_resource = session.resource("s3")
s3_bucket = os.environ.get("S3_RADGAB_BUCKET")


def generate_bucket_name(game_id: str) -> str:
    """Generate bucket name for a game ID.

    Args:
        game_id (str): The ID of the game to generate a bucket name for.

    Returns:
        str: A bucket name that combines the game ID and current datetime.
    """
    return f"feedback/{game_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"


def upload_dict_to_s3(data: Dict, object_name: str):
    """Upload a dictionary to S3.

    Args:
        data (Dict): Upload data
        object_name (str): Keyname. Will be combined with the bucket defined in the environment.

    Returns:
        Dict: The return information for the upload.
    """
    return s3_resource.Bucket(s3_bucket).put_object(
        Key=object_name, Body=json.dumps(data)
    )
