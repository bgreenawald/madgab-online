"""Manage upload to S3
"""

import json
import os
from typing import Dict

import boto3
from dotenv import load_dotenv

load_dotenv()

s3_resource = boto3.resource("s3")
s3_bucket = os.environ.get("S3_RADGAB_BUCKET")


def upload_dict_to_s3(data: Dict, object_name: str):
    return s3_resource.Bucket(s3_bucket).put_object(
        Key=object_name, Body=json.dumps(data)
    )
