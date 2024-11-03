import os

import boto3

kwargs = {}

if os.environ.get("AWS_ACCESS_KEY_ID"):
    kwargs["aws_access_key_id"] = os.environ.get("AWS_ACCESS_KEY_ID")

if os.environ.get("REGION_NAME"):
    kwargs["region_name"] = os.environ.get("REGION_NAME")

if os.environ.get("AWS_SECRET_ACCESS_KEY"):
    kwargs["aws_secret_access_key"] = os.environ.get("AWS_SECRET_ACCESS_KEY")


s3_session = boto3.session.Session(**kwargs)
