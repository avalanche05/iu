from typing import List

from sqlalchemy import Column, ForeignKey, Integer, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common import BaseEntity

FolderCandidate = Table(
    "folders_candidates",
    BaseEntity.metadata,
    Column("folder_id", Integer, ForeignKey("folders.id")),
    Column("candidate_id", Integer, ForeignKey("candidates.id")),
)


class Folder(BaseEntity):
    __tablename__ = "folders"
    name: Mapped[str] = mapped_column()
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    user: Mapped["User"] = relationship("User", back_populates="folders")

    candidates: Mapped[List["Candidate"]] = relationship(
        secondary=FolderCandidate, back_populates="folders"
    )

    def __repr__(self):
        return f"<Folder(id={self.id}, name='{self.name}')>"

    def __str__(self):
        return f"Folder: {self.name}, Description: {self.description}"

