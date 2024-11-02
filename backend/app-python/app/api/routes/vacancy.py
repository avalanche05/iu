from fastapi import APIRouter, Body, Path
from starlette import status

from app import schemas, serializers
from app.api.deps import SessionDep, CHClientDep, CurrentUser
from app.crud import vacancy

router = APIRouter()


@router.get("", status_code=status.HTTP_200_OK, response_model=list[schemas.Vacancy])
async def get_vacancies(
    session: SessionDep,
    db_user: CurrentUser,
    position: str | None = None,
    grade: str | None = None,
    speciality: str | None = None,
    city: str | None = None,
    work_format: str | None = None,
    skills: str | None = None
):
    db_vacancies = vacancy.get_all(
        session=session,
        position=position,
        grade=grade,
        speciality=speciality,
        city=city,
        work_format=work_format,
        skills=skills
    )

    return serializers.get_vacancies(db_vacancies)


@router.post("", status_code=status.HTTP_201_CREATED, response_model=schemas.Vacancy)
async def create_vacancy(
    session: SessionDep, ch_client: CHClientDep, db_user: CurrentUser, vacancy_instance: schemas.VacancyCreate = Body(...)
):
    
    db_vacancy = vacancy.create(session=session, vacancy=vacancy_instance, user=db_user)
    ch_client.insert('vacancy_events',
                      [[db_vacancy.id, db_vacancy.position, db_vacancy.grade, db_vacancy.city, db_vacancy.work_format, "test_username", 1, 'Create']],
                      column_names=['PgID', 'Position', 'Grade', 'City', 'WorkFormat', 'Username', 'UserID', 'Event'])


    return serializers.get_vacancy(db_vacancy)


@router.get(
    "/vacancies/{vacancy_id}/cold-candidates",
    status_code=status.HTTP_200_OK,
    response_model=list[schemas.Candidate],
)
async def get_cold_candidates_by_vacancy_id(
    session: SessionDep, db_user: CurrentUser, vacancy_id: int = Path(...)
):
    db_cold_candidates = vacancy.get_vacancy_cold_candidates(
        session=session, vacancy_id=vacancy_id
    )

    return serializers.get_candidates(db_cold_candidates)
