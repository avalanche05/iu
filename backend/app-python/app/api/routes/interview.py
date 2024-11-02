import os
from uuid import uuid4

import requests
from fastapi import APIRouter, Path, UploadFile, File

from app import serializers, schemas
from app.api.deps import SessionDep, CurrentUser
from app.common import BaseSchema
from app.crud import interview

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


@router.post("", response_model=schemas.Interview)
async def create_interview(
        db_session: SessionDep,
        db_user: CurrentUser,
        interview_instance: schemas.InterviewCreate
):
    db_interview = interview.create(session=db_session, intervie=interview_instance, user=db_user)

    return serializers.get_interview(db_interview)
