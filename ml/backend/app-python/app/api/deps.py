from collections.abc import Generator
from sqlalchemy.orm import Session

from app.core.s3 import s3_session
from collections.abc import Generator
from typing import Annotated
from botocore.client import BaseClient
from fastapi import Depends


def get_s3() -> Generator[Session, None, None]:
    s3_client = s3_session.client(
            service_name='s3',
            endpoint_url='https://storage.yandexcloud.net'
        )
    yield s3_client

S3ClientDep = Annotated[BaseClient, Depends(get_s3)]