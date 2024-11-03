from collections.abc import Generator

from app.core.s3 import s3_session
from collections.abc import Generator
from typing import Annotated
from botocore.client import BaseClient
from fastapi import Depends

storage = {}
def get_s3() -> Generator:
    s3_client = s3_session.client(
            service_name='s3',
            endpoint_url='https://storage.yandexcloud.net'
        )
    yield s3_client

def get_storage() -> Generator:
    yield storage

S3ClientDep = Annotated[BaseClient, Depends(get_s3)]
StorageDep = Annotated[dict, Depends(get_storage)]