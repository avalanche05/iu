from app import models, schemas


def get_folder(db_folder: models.Folder) -> schemas.Folder:
    return schemas.Folder(
        id=db_folder.id, name=db_folder.name, candidates_count=len(db_folder.candidates)
    )


def get_folders(db_folders: list[models.Folder]) -> list[schemas.Folder]:
    return [get_folder(db_folder) for db_folder in db_folders]
