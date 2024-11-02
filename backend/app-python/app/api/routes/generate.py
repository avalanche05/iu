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

@router.get("/feedback/approve/vacancies/{vacancy_id}/candidates/{candidate_id}")
async def generate_approve_feedback(
    db_session: SessionDep,
    db_user: CurrentUser,
    vacancy_id: int,
    candidate_id: int,
) -> Feedback:

    application = crud.application.get_by_candidate_and_vaccancy(db_session, candidate_id, vacancy_id)

    status = "pending"
    if application:
        status = application.status    

    candidate = serializers.candidate.get_candidate(crud.candidate.get_candidate(db_session, candidate_id))
    vacancy = serializers.vacancy.get_vacancy(crud.vacancy.get_vacancy(db_session, vacancy_id))

    candidate_data = {
        "name" : candidate.name,
        "position": vacancy.position,
        "summary": candidate.summary,
    }

    vacancy_data = {
        "position": vacancy.position,
        "description": vacancy.description,
    }

    response = requests.post(
                f"{os.environ.get('ML_RESUME_HOST', 'http://localhost')}:5000/feedback/generate",
                json={
                    "action": "approve",
                    "vacancy": vacancy_data,
                    "candidate": candidate_data,
                    "status": status,
                },
            )
    return Feedback(message=response.json()["message"])

@router.get("/feedback/reject/vacancies/{vacancy_id}/candidates/{candidate_id}")
async def generate_approve_feedback(
    db_session: SessionDep,
    db_user: CurrentUser,
    vacancy_id: int,
    candidate_id: int,
) -> Feedback:

    application = crud.application.get_by_candidate_and_vaccancy(db_session, candidate_id, vacancy_id)

    status = "pending"
    if application:
        status = application.status    

    candidate = serializers.candidate.get_candidate(crud.candidate.get_candidate(db_session, candidate_id))
    vacancy = serializers.vacancy.get_vacancy(crud.vacancy.get_vacancy(db_session, vacancy_id))

    candidate_data = {
        "name" : candidate.name,
        "position": vacancy.position,
        "summary": candidate.summary,
    }

    vacancy_data = {
        "position": vacancy.position,
        "description": vacancy.description,
    }

    response = requests.post(
                f"{os.environ.get('ML_RESUME_HOST', 'http://localhost')}:5000/feedback/generate",
                json={
                    "action": "reject",
                    "vacancy": vacancy_data,
                    "candidate": candidate_data,
                    "status": status,
                },
            )
    return Feedback(message=response.json()["message"])

@router.get("/feedback/invite/vacancies/{vacancy_id}/candidates/{candidate_id}")
async def generate_approve_feedback(
    db_session: SessionDep,
    db_user: CurrentUser,
    vacancy_id: int,
    candidate_id: int,
) -> Feedback:

    application = crud.application.get_by_candidate_and_vaccancy(db_session, candidate_id, vacancy_id)

    status = "pending"
    if application:
        status = application.status    

    candidate = serializers.candidate.get_candidate(crud.candidate.get_candidate(db_session, candidate_id))
    vacancy = serializers.vacancy.get_vacancy(crud.vacancy.get_vacancy(db_session, vacancy_id))

    candidate_data = {
        "name" : candidate.name,
        "position": vacancy.position,
        "summary": candidate.summary,
    }

    vacancy_data = {
        "position": vacancy.position,
        "description": vacancy.description,
    }

    response = requests.post(
                f"{os.environ.get('ML_RESUME_HOST', 'http://localhost')}:5000/feedback/generate",
                json={
                    "action": "invite",
                    "vacancy": vacancy_data,
                    "candidate": candidate_data,
                    "status": status,
                },
            )
    return Feedback(message=response.json()["message"])