from botocore.client import BaseClient
def get_file(s3_client: BaseClient, file_key: str) -> bytes:
    response = s3_client.get_object(Bucket="hack-s3", Key=file_key)
    return response['Body'].read()