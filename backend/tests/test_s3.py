import json
import os
import unittest

import boto3
import botocore
from dotenv import load_dotenv

from src.utils.s3 import upload_dict_to_s3


load_dotenv()

s3_bucket = os.environ.get("S3_RADGAB_BUCKET")


class testS3(unittest.TestCase):
    def test_upload_dict_to_s3(self):
        filename = "feedback/TEST_DATA.json"

        # Upload the data
        test_data = {"Hello": "World"}
        _ = upload_dict_to_s3(test_data, filename)

        # Test that the uploaded file exists
        s3_client = boto3.client("s3")
        resp = s3_client.get_object(Bucket=s3_bucket, Key=filename)
        self.assertEqual(json.loads(resp["Body"].read()), test_data)

        # Clean up
        s3_resource = boto3.resource("s3")
        s3_resource.Object(s3_bucket, filename).delete()
        with self.assertRaises(botocore.exceptions.ClientError) as e:
            resp = s3_client.get_object(Bucket=s3_bucket, Key=filename)
