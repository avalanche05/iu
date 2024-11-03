from datetime import datetime

from app.common import BaseSchema


class Metric(BaseSchema):
    repos_count: int
    created_at: datetime
    followers_count: int
    forks_count: int
    avg_comments_count: float
    avg_prs_count: float
    avg_issues_close_time: float
    avg_issues_count: float
    avg_prs_close_time: float
    avg_commits_per_pr_count: float
