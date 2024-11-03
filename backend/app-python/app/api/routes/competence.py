from typing import List

from fastapi import APIRouter, HTTPException, Body
from starlette import status

from app import models, schemas, serializers
from app.api.deps import SessionDep, CurrentUser
from app.crud import competence

router = APIRouter()


@router.get("", status_code=status.HTTP_200_OK, response_model=list[str])
async def get_competencies(session: SessionDep, user: CurrentUser):
    competencies = competence.get_all(session)

    return competencies
