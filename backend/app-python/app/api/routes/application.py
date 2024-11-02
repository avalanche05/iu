import os
import requests
import json
from datetime import datetime

from fastapi import APIRouter, Body, Path, HTTPException
from starlette import status

from app import models, schemas, serializers
from app.crud import application, vacancy
from app.api.deps import SessionDep, CHClientDep, CurrentUser

router = APIRouter()


@router.get(
    "", status_code=status.HTTP_200_OK, response_model=list[schemas.Application]
)
async def get_applications(
    session: SessionDep,
    db_user: CurrentUser,
    position: str | None = None,
    grade: str | None = None,
    speciality: str | None = None,
    vacancy_id: int | None = None,
    sort_status: str | None = None,
    is_ranked: bool | None = False,
):
    db_applications = application.get_all(
        session=session,
        position=position,
        grade=grade,
        speciality=speciality,
        vacancy_id=vacancy_id,
        status=sort_status,
    )

    return serializers.get_applications(db_applications)


@router.post("", status_code=status.HTTP_200_OK, response_model=schemas.Application)
async def create_application(
    session: SessionDep, ch_client: CHClientDep, db_user: CurrentUser, application_instance: schemas.ApplicationCreate = Body(...)
):
    db_application = application.create_or_update(
        session=session, application=application_instance
    )

    try:
        db_vacancy = db_application.vacancy
        db_candidate = db_application.candidate

        ch_client.insert('vacancy_events',
                        [[db_vacancy.id, db_vacancy.position, db_vacancy.grade, db_vacancy.city, db_vacancy.work_format, "test_username", 1, 'pending', db_candidate.id]],
                        column_names=['PgID', 'Position', 'Grade', 'City', 'WorkFormat', 'Username', 'UserID', 'Event', 'CandidateID'])
    except Exception as e:
        print("Error sending to CH:", e)


    return serializers.get_application(db_application)


@router.post(
    "/applications/{application_id}/status", response_model=schemas.Application
)
async def update_application_status(
    session: SessionDep,
    ch_client: CHClientDep,
    db_user: CurrentUser,
    application_id: int = Path(...),
    status_instance: schemas.ApplicationStatusUpdate = Body(...),
):
    db_application = application.update_status(
        session=session, application_id=application_id, status=status_instance
    )

    db_vacancy = db_application.vacancy
    db_candidate = db_application.candidate

    ch_client.insert('vacancy_events',
                      [[db_vacancy.id, db_vacancy.position, db_vacancy.grade, db_vacancy.city, db_vacancy.work_format, "test_username", 1, status_instance.status, db_candidate.id]],
                      column_names=['PgID', 'Position', 'Grade', 'City', 'WorkFormat', 'Username', 'UserID', 'Event', 'CandidateID'])


    return serializers.get_application(db_application)
