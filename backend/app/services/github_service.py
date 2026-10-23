import httpx
from typing import Dict, Any

async def fetch_github_profile(username: str) -> Dict[str, Any]:
    if not username:
        return {}
    headers = {"Accept": "application/vnd.github.v3+json"}
    async with httpx.AsyncClient() as client:
        try:
            url = f"https://api.github.com/users/{username}/repos?sort=updated&per_page=10"
            response = await client.get(url, headers=headers)
            if response.status_code != 200:
                return {"error": f"GitHub API returned {response.status_code}"}
            
            repos = response.json()
            portfolio = []
            languages = set()
            
            for repo in repos:
                if not repo.get("fork"):
                    portfolio.append({
                        "name": repo["name"],
                        "description": repo["description"],
                        "url": repo["html_url"],
                        "language": repo["language"]
                    })
                    if repo["language"]:
                        languages.add(repo["language"])
            
            return {
                "username": username,
                "top_languages": list(languages),
                "recent_projects": portfolio
            }
        except Exception as e:
            return {"error": str(e)}
