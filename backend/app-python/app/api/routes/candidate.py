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
    position: str | None = None,
    grade: str | None = None,
    speciality: str | None = None,
    isCold: bool | None = None,
    city: str | None = None,
    work_format: str | None = None,
    skills: str | None = None,
) -> List[schemas.Candidate]:

    db_candidates = candidate.get_all(
        session=session,
        position=position,
        grade=grade,
        speciality=speciality,
        isCold=isCold,
        city=city,
        work_format=work_format,
        skills=skills
    )
    return serializers.get_candidates(db_candidates)
