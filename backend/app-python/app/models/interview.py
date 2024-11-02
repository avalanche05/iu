from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common import BaseEntity
from app.models.folder import FolderCandidate


class Interview(BaseEntity):
    __tablename__ = "interviews"
    summary: Mapped[str] = mapped_column()
    competencies: Mapped[str] = mapped_column()
    candidate_id: Mapped[int] = mapped_column(ForeignKey("candidates.id"))

    candidate: Mapped["Candidate"] = relationship(
        "Candidate",
        back_populates="interview",
    )
