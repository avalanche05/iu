from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common import BaseEntity
from app.models.folder import FolderCandidate


class Candidate(BaseEntity):
    __tablename__ = "candidates"
    nickname: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column()
    github_url: Mapped[str] = mapped_column()
    experience_years: Mapped[int] = mapped_column()
    grade: Mapped[str] = mapped_column()
    summary: Mapped[str] = mapped_column()
    code_quality: Mapped[float] = mapped_column()
    competencies: Mapped[str] = mapped_column(nullable=True)

    folders: Mapped[list["Folder"]] = relationship(
        "Folder",
        secondary=FolderCandidate,
        back_populates="candidates",
    )
    applications: Mapped[list["Application"]] = relationship(
        "Application",
        back_populates="candidates",
        cascade="all, delete-orphan")

    interview: Mapped["Interview"] = relationship(
        "Interview",
        back_populates="candidate",
        cascade="all, delete-orphan"
    )
