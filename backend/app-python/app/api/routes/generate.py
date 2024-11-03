import os
from uuid import uuid4

import requests
from fastapi import APIRouter

from app import serializers, crud
from app.api.deps import SessionDep, CurrentUser
from app.common import BaseSchema

import requests

router = APIRouter()


class Feedback(BaseSchema):
    message: str


@router.get("/feedback/approve/candidates/{candidate_id}")
async def generate_approve_feedback(
        db_session: SessionDep,
        db_user: CurrentUser,
        candidate_id: int,
) -> Feedback:

    status = "approve"

    candidate = serializers.candidate.get_candidate(crud.candidate.get_candidate(db_session, candidate_id))

    candidate_data = {
        "nickname": candidate.nickname,
        "grade": candidate.grade,
        "summary": candidate.summary,
    }

    response = requests.post(
        f"{os.environ.get('ML_RESUME_HOST', 'http://localhost:5000')}/feedback/generate",
        json={
            "action": "approve",
            "candidate": candidate_data,
            "status": status,
        },
    )
    return Feedback(message=response.json()["message"])


@router.get("/feedback/reject/candidates/{candidate_id}")
async def generate_approve_feedback(
        db_session: SessionDep,
        db_user: CurrentUser,
        candidate_id: int,
) -> Feedback:

    status = "reject"

    candidate = serializers.candidate.get_candidate(crud.candidate.get_candidate(db_session, candidate_id))

    candidate_data = {
        "nickname": candidate.nickname,
        "grade": candidate.grade,
        "summary": candidate.summary,
    }

    response = requests.post(
        f"{os.environ.get('ML_RESUME_HOST', 'http://localhost:5000')}/feedback/generate",
        json={
            "action": "reject",
            "candidate": candidate_data,
            "status": status,
        },
    )
    print(response.json())
    return Feedback(message=response.json()["message"])
