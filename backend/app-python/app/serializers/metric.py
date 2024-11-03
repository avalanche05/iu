import json

from app import schemas


def get_metric(dict_metric: dict) -> schemas.Metric:
    dict_metric = json.loads(dict_metric)

    return schemas.Metric(
        repos_count=dict_metric['repos_count'],
        created_at=dict_metric['created_at'],
        followers_count=dict_metric['followers_count'],
        forks_count=dict_metric['forks_count'],
        avg_comments_count=dict_metric['avg_comments_count'],
        avg_prs_count=dict_metric['avg_prs_count'],
        avg_issues_close_time=dict_metric['avg_issues_close_time'],
        avg_issues_count=dict_metric['avg_issues_count'],
        avg_prs_close_time=dict_metric['avg_prs_close_time'],
        avg_commits_per_pr_count=dict_metric['avg_commits_per_pr_count']
    )


def get_metrics(db_metrics: str) -> list[schemas.Metric]:
    metrics = json.loads(db_metrics)
    return [get_metric(metric) for metric in metrics]


def convert_metrics_to_dict(metrics: schemas.Metric) -> dict:
    metrics_dict = metrics.dict()
    metrics_dict['created_at'] = metrics_dict['created_at'].isoformat()
    return metrics_dict
