from typing import Literal

from app.common import BaseSchema
from app.schemas.vacancy import Vacancy
from app.schemas.interview import Interview


class FileResult(BaseSchema):
    file_name: str
    message: str | None = ""
    vacancy: Vacancy | None = None


class ResumeProcessSession(BaseSchema):
    session_id: str
    is_finished: bool
    processing: list[FileResult]
    success: list[FileResult]
    error: list[FileResult]


class VoiceProcessSession(BaseSchema):
    session_id: str
    is_finished: bool
    interview: Interview | None = None