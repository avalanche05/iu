from fastapi import APIRouter, Body, Path
from starlette import status

from app import models, schemas, serializers
from app.api.deps import SessionDep, CurrentUser
from app.crud import folder

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED, response_model=schemas.Folder)
async def create_folder(
    session: SessionDep, db_user: CurrentUser, folder_instance: schemas.FolderCreate = Body(...)
):
    db_folder = folder.create(session=session, folder=folder_instance, user=db_user)

    return serializers.get_folder(db_folder)


@router.post(
    "/{folder_id}", status_code=status.HTTP_201_CREATED, response_model=schemas.Folder
)
async def add_candidate_to_folder(
    session: SessionDep,
    db_user: CurrentUser,
    folder_id: int = Path(...),
    candidate_instance: schemas.CandidateFolderAdd = Body(...),
):
    db_folder = folder.add_candidate_to_folder_by_id(
        session=session, folder_id=folder_id, user=db_user, candidate=candidate_instance
    )

    return serializers.get_folder(db_folder)


@router.get("", status_code=status.HTTP_200_OK, response_model=list[schemas.Folder])
async def get_folders(session: SessionDep, db_user: CurrentUser):
    db_folders = folder.get_all(session=session, user=db_user)

    return serializers.get_folders(db_folders)
