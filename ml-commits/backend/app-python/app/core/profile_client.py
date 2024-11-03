import aiohttp
import asyncio
from datetime import datetime
import requests
from pprint import pprint
import os

github_token = os.environ.get("github_token")


class ProfileParser:
    @staticmethod
    def parse_profile(profile_json: dict) -> dict:
        profile = {
            "name": profile_json.get("name", ""),
            "repos_count": profile_json.get("public_repos", 0),
            "created_at": profile_json.get("created_at"), # datetime
            "followers_count": profile_json.get("followers"),

        }
        return profile


    @staticmethod
    def parse_collaborators(rep):
        pass

    @staticmethod
    def parse_repos(repo_json: dict) -> dict:
        collaborators_list = []
        return repo_json

    @staticmethod
    def parse_issues_events(user_login: str, issues_events: list[dict]):
        issues = []
        for issues_event in issues_events:
            if issues_event['actor'] == user_login:
                issues.append({
                    "created_at": issues_event.get("created_at"),
                    "event": issues_event.get("event"),
                    "title": issues_event.get("issue").get("title"),
                    "actor": issues_event.get("actor").get("login"),
                    "id": issues_event.get("id"),
                    "closed_at": issues_event.get("issue").get("closed_at"),
                })


        return issues

    @staticmethod
    def parse_comments(profile_login: str, comments_full: list[dict]) -> list[dict]:
        comments = []
        for comment in comments_full:
            if comment["user"]["login"] == profile_login:
                comments.append({
                    "login": comment["user"]["login"],
                    "id": comment['id'],
                    'body': comment['body']

                })

        return comments

    @staticmethod
    def parse_prs(profile_login: str, prs_full: list[dict]) -> list[dict]:
        prs = []
        for pr in prs_full:
            if pr['actor']['login'] == profile_login:
                prs.append({
                    'login': pr['actor']['login'],
                    'type': pr['type'],
                    'created_at': pr['payload']['pull_request']['created_at'],
                    'closed_at': pr['payload']['pull_request']['merged_at'],  # merge time
                    "comments": pr['payload']['pull_request']['comments'],
                    "review_comments": pr['payload']['pull_request']['review_comments'],
                    "commits": pr['payload']['pull_request']['commits'],
                    "additions": pr['payload']['pull_request']['additions'],
                    "deletions": pr['payload']['pull_request']['deletions'],
                    "changed_files": pr['payload']['pull_request']['changed_files']
                })

        return prs

    @staticmethod
    def get_avg_time(data: list[dict]) -> float:
        minutes_sum = 0
        count = 0
        for d in data:
            if d['closed_at'] is not None:
                seconds = (datetime.strptime(d['closed_at'], '%Y-%m-%dT%H:%M:%SZ') -
                       datetime.strptime(d['created_at'], '%Y-%m-%dT%H:%M:%SZ')).total_seconds()
                minutes_sum += seconds / 60
                count += 1

        return minutes_sum / max(count, 1)

    @staticmethod
    def get_avg_value(data: list[dict]) -> float:
        pass

    @staticmethod
    def compress_all_repo_info(profile_data: dict, repos: list[dict]) -> dict:
        profile_data['forks_count'] = sum(1 for repo in repos if repo.get('is_forked', False))
        profile_data['avg_comments_count'] = sum(repo['comments_count'] for repo in repos) / max(1, len(repos))
        profile_data['avg_prs_count'] = sum(repo['prs_count'] for repo in repos) / max(1, len(repos))
        profile_data['avg_issues_close_time'] = sum(repo['issues_avg_close_time'] for repo in repos) / max(1,
                                                                                                           len(repos))
        profile_data['avg_issues_count'] = sum(repo['issues_count'] for repo in repos) / max(1, len(repos))
        profile_data['avg_prs_close_time'] = sum(repo['prs_avg_close_time'] for repo in repos) / max(1, len(repos))
        profile_data['avg_commits_per_pr_count'] = sum(repo['avg_commits_per_pr_count'] for repo in repos) / max(1,
                                                                                                                 len(repos))
        return profile_data


class ProfileClient:
    def __init__(self):
        self.api_url = "https://api.github.com/users"
        self.headers = {"Authorization": f"Bearer {github_token}"}

    async def fetch_json(self, url, session):
        async with session.get(url, headers=self.headers) as response:
            if response.status == 200:
                return await response.json()
            else:
                content = await response.text()
                raise ValueError(f"Request failed: {content} ({response.url})")

    async def get_profile_info(self, profile_login):
        async with aiohttp.ClientSession() as session:
            profile_json = await self.fetch_json(f"{self.api_url}/{profile_login}", session)
            return ProfileParser.parse_profile(profile_json)

    async def get_collaborators_info(self, collaborators_url: str):
        async with aiohttp.ClientSession() as session:
            return await self.fetch_json(collaborators_url, session)

    async def get_comments_info(self, comments_url: str):
        async with aiohttp.ClientSession() as session:
            return await self.fetch_json(comments_url, session)

    async def get_issue_event_info(self, issues_url: str):
        async with aiohttp.ClientSession() as session:
            return await self.fetch_json(issues_url, session)

    async def get_issue_comment_info(self, issues_url: str):
        async with aiohttp.ClientSession() as session:
            return await self.fetch_json(issues_url, session)

    async def get_pr_info(self, pr_url: str):
        async with aiohttp.ClientSession() as session:
            events_json = await self.fetch_json(pr_url, session)
            prs = [event_json for event_json in events_json if event_json['type'] == 'PullRequestEvent']
            return prs

    async def get_repo(self, profile_login: str, repo: dict):
        async with aiohttp.ClientSession() as session:
            repo_name = repo.get("full_name")
            print(repo_name)
            data = {"full_name": repo_name}

            comments_url = repo.get("comments_url").split("{")[0]
            comments_full = await self.get_comments_info(comments_url)
            comments = ProfileParser.parse_comments(profile_login, comments_full)
            data['comments'] = comments
            data['comments_count'] = len(comments)

            language = repo.get("language")
            data['language'] = language

            issues_event_url = repo.get("issue_events_url").split("{")[0]
            issues_events_full = await self.get_issue_event_info(issues_event_url)
            issues_events = ProfileParser.parse_issues_events(profile_login, issues_events_full)
            # data['issues_events'] = issues_events
            data['issues_count'] = len(issues_events)
            data['issues_avg_close_time'] = ProfileParser.get_avg_time(issues_events)

            issues_comment_url = repo.get("issue_comment_url").split("{")[0]
            issues_comments = await self.get_issue_comment_info(issues_comment_url)
            # data['issues_comments'] = issues_comments
            data['issues_comments_count'] = len(issues_comments)

            pr_url = repo.get("events_url")
            prs_full = await self.get_pr_info(pr_url)
            prs = ProfileParser.parse_prs(profile_login, prs_full)
            # data['prs'] = prs
            data['prs_count'] = len(prs)
            data['prs_avg_close_time'] = ProfileParser.get_avg_time(prs)
            data['avg_commits_per_pr_count'] = sum(pr['commits'] for pr in prs) / max(len(prs), 1)
            data['is_forked'] = repo['fork']

            return data

    async def get_repos_info(self, profile_login: str, session):
        repos_json = await self.fetch_json(f"{self.api_url}/{profile_login}/repos", session)
        repos_full = await asyncio.gather(*(self.get_repo(profile_login, repo) for repo in repos_json))
        return repos_full

    async def get_full_info(self, profile_login: str) -> dict:
        async with aiohttp.ClientSession() as session:
            profile_data = await self.get_profile_info(profile_login)
            # pprint(profile_data)
            repos_data = await self.get_repos_info(profile_login, session)
            # pprint(repos_data)
            return ProfileParser.compress_all_repo_info(profile_data, repos_data)





# if __name__ == "__main__":
#     profile = ProfileClient()
#     # pprint(profile.get_profile_info("asim"))
#     # pprint(profile.get_repos_info("asim"))
#     pprint(profile.get_full_info('asim'))
