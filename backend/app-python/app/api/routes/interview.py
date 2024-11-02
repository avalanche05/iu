import os
from uuid import uuid4

import requests
from fastapi import APIRouter, Path, UploadFile, File

from app import serializers, crud
from app.api.deps import SessionDep, CurrentUser
from app.common import BaseSchema

import requests

router = APIRouter()


@router.post("/voice/candidate/{candidate_id}")
async def create_interview_file(
        db_session: SessionDep,
        db_user: CurrentUser,
        files: list[UploadFile] = File(...),
        candidate_id: int = Path(...)
):
    pass
