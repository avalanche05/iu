from fastapi import APIRouter, Body, Path, File, HTTPException, UploadFile
from starlette import status

from app import schemas, serializers
from app.api.deps import SessionDep, CHClientDep, CurrentUser
from app.crud import vacancy, candidate

router = APIRouter()


@router.get("", status_code=status.HTTP_200_OK, response_model=list[schemas.Vacancy])
async def get_vacancies(
        session: SessionDep,
        db_user: CurrentUser,
        title: str | None = None,
        grade: str | None = None,
        competencies: str | None = None,
):
    db_vacancies = vacancy.get_all(
        session=session,
        title=title,
        grade=grade,
        competencies=competencies
    )

    return serializers.get_vacancies(db_vacancies)


@router.get("/{vacancy_id}", status_code=status.HTTP_201_CREATED, response_model=schemas.VacancyCandidateList)
async def get_ranked_candidates_by_vacancy_id(
        session: SessionDep,
        vacancy_id: int = Path(...)
):
    db_vacancy, candidate_list = vacancy.get_vacancy(session, vacancy_id)
    if not db_vacancy:
        raise HTTPException(status_code=401, detail="Vacancy not found")

    return serializers.get_vacancy_candidate_list(db_vacancy, candidate_list)


@router.post("", status_code=status.HTTP_201_CREATED, response_model=schemas.Vacancy)
async def create_vacancy(
        session: SessionDep, ch_client: CHClientDep, db_user: CurrentUser,
        vacancy_instance: schemas.VacancyCreate = Body(...)
):
    db_vacancy = vacancy.create(session=session, vacancy=vacancy_instance, user=db_user)

    return serializers.get_vacancy(db_vacancy)


@router.post("/file", status_code=status.HTTP_201_CREATED)
async def create_vacancy_file(
    db_session: SessionDep,
    db_user: CurrentUser,
    files: list[UploadFile] = File(...),
):
    return {"message": "i love cats"}
