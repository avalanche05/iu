import requests
from pprint import pprint


class ProfileParser:
    @staticmethod
    def parse_profile(profile_json: dict) -> dict:
        profile = {
            "name": profile_json.get("name", ""),
            "repos_count": profile_json.get("public_repos", 0),
            "email": profile_json.get("email", ""),
            "created_at": profile_json.get("created_at"), # datetime
            "followers": profile_json.get("followers"),
            "following": profile_json.get("following"),
            "bio": profile_json.get("bio", "")

        }
        return profile


    @staticmethod
    def parse_repos(repo_json: dict) -> dict:
        pprint(repo_json)
        return repo_json





class ProfileClient:
    def __init__(self):
        self.api_url = f"https://api.github.com/users"

    def get_profile_info(self, profile_login):
        response = requests.get(f"{self.api_url}/{profile_login}")

        if response.status_code == 200:
            profile_json = response.json()
            return profile_json
        else:
            raise ValueError(f"unable to parse user with profile {profile_login}: {response.text},{response.url}")

    def get_repos_info(self, profile_login):
        response = requests.get(f"{self.api_url}/{profile_login}/repos")

        if response.status_code == 200:
            repos_json = response.json()
            return ProfileParser.parse_repos(repos_json[0])
        else:
            raise ValueError(f"unable to parse user repos with profile {profile_login}: {response.text},{response.url}")



if __name__ == "__main__":
    profile = ProfileClient()
    pprint(profile.get_repos_info("avalanche05"))
