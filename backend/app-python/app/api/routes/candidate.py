import os
import requests
from typing import List

from fastapi import APIRouter, HTTPException, Body
from starlette import status

from app import models, schemas, serializers
from app.api.deps import SessionDep, CurrentUser
from app.crud import candidate

router = APIRouter()


@router.get("", status_code=status.HTTP_200_OK, response_model=list[schemas.Candidate])
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


@router.post("", status_code=status.HTTP_201_CREATED, response_model=schemas.Candidate)
async def create_candidate(session: SessionDep,
                           candidate_instance: schemas.CandidateCreate = Body(...)):
    db_candidate = candidate.create(session, candidate_instance)

    return serializers.get_candidate(db_candidate)
