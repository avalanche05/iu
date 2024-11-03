import asyncio
import aiohttp

import time
import os
import json
import requests

from profile_client import ProfileClient


async def main():
    async with aiohttp.ClientSession() as session:
        profile_client = ProfileClient()
        d = json.load(open("dataset.json"))
        len_d = len(d)
        for i, t in enumerate(d):
            try:
                user_login = t["github_profile"].split("/")[-1]
                print(i, user_login)
                full_info = await profile_client.get_full_info(user_login)
                print('result: ', full_info)
                with open(f'usrs/{i}.json', 'w', encoding='utf-8') as f:
                    json.dump(full_info, f)
            except Exception as err:
                print('error ', err)
                time.sleep(60)

# Run the async main function
asyncio.run(main())
