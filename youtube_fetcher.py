# youtube_fetcher.py
from youtubesearchpython import VideosSearch

def fetch_youtube_links(query, max_results=3):
    videos_search = VideosSearch(query, limit=max_results)
    results = videos_search.result()["result"]

    links = []
    for video in results:
        title = video["title"]
        link = video["link"]
        views = video.get("viewCount", {}).get("short", "N/A")
        links.append(f"{title} - {link} ({views} views)")

    return links
