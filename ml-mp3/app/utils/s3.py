from botocore.client import BaseClient
from fastapi import UploadFile

ALLOWED_EXTENSIONS = {"pdf"}


def validate_fastapi_file(file: UploadFile):

    extension = file.filename.split(".")[-1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Файл {file.filename} не является PDF.")

    if file.content_type != "application/pdf":
        raise ValueError("Файл {file.filename} имеет неверный MIME-тип.")


def upload_file(
    s3_client: BaseClient, file_key: str, file_content: bytes, file_type: str
) -> None:
    s3_client.put_object(
        Bucket="hack-s3",
        Key=file_key,
        Body=file_content,
        ContentType=file_type,
    )


def get_file(s3_client: BaseClient, file_key: str) -> bytes:
    response = s3_client.get_object(Bucket="hack-s3", Key=file_key)
    return response["Body"].read()
