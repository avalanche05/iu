import os
import requests
from typing import List

from fastapi import APIRouter, HTTPException
from starlette import status

from app import models, schemas, serializers
from app.api.deps import SessionDep, CurrentUser
from app.crud import candidate

router = APIRouter()


@router.get("")
async def get_candidates(
    session: SessionDep,
    db_user: CurrentUser,
    grade: str | None = None,
    nickname: str | None = None,
    competencies: str | None = None,
    experience: int | None = None,
    folder_id: int | None = None
) -> List[schemas.Candidate]:

    db_candidates = candidate.get_all(
        session=session,
        grade=grade,
        nickname=nickname,
        competencies=competencies,
        experience=experience,
        folder_id=folder_id
    )
    return serializers.get_candidates(db_candidates)
