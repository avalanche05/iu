from sqlalchemy import not_, or_
from sqlalchemy.orm import Session

from app import schemas
from app.models import Application, Candidate, Folder, Vacancy


def create(session: Session, folder: schemas.FolderCreate, user: schemas.User) -> Folder:
    db_folder = Folder(
        name=folder.name,
        user_id=user.id
    )
    session.add(db_folder)
    session.commit()
    session.refresh(db_folder)

    return db_folder


def add_candidate_to_folder_by_id(
    session: Session, folder_id: int, user: schemas.User, candidate: schemas.CandidateFolderAdd
) -> Folder:
    folder = session.get(Folder, folder_id)
    if folder.user_id != user.id:
        raise ValueError(f"You do not have rights to access folder with ID {folder_id}.")
    if folder is None:
        raise ValueError(f"Folder with ID {folder_id} not found.")

    candidate = session.get(Candidate, candidate.candidate_id)
    if candidate is None:
        raise ValueError(f"Candidate with ID {candidate.candidate_id} not found.")

    if candidate not in folder.candidates:
        folder.candidates.append(candidate)

    session.commit()
    session.refresh(folder)

    return folder


def get_all(session: Session, user: schemas.User) -> list[Folder]:
    query = session.query(Folder).filter(Folder.user_id == user.id)

    return query.all()
