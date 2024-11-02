from app.common import BaseSchema


class FolderCreate(BaseSchema):
    name: str


class Folder(BaseSchema):
    id: int
    name: str
    candidates_count: int


class CandidateFolderAdd(BaseSchema):
    candidate_id: int
