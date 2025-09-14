import os
import json
from googleapiclient.discovery import build

def main():
    api_key = os.environ.get("YOUTUBE_API_KEY")
    if not api_key:
        raise ValueError("YOUTUBE_API_KEY environment variable not set.")

    youtube = build("youtube", "v3", developerKey=api_key)

    # The channel ID provided by the user
    channel_id = "UCqDDM6Q1purcYsW8rfGXstQ"

    # Get the uploads playlist ID from the channel
    channel_request = youtube.channels().list(
        part="contentDetails",
        id=channel_id
    )
    channel_response = channel_request.execute()
    uploads_playlist_id = channel_response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

    # Get the videos from the uploads playlist
    playlist_request = youtube.playlistItems().list(
        part="snippet",
        playlistId=uploads_playlist_id,
        maxResults=50  # Get the latest 50 videos
    )
    playlist_response = playlist_request.execute()

    videos = []
    for item in playlist_response["items"]:
        snippet = item["snippet"]
        video_id = snippet["resourceId"]["videoId"]
        video_title = snippet["title"]
        video_description = snippet["description"]
        video_published_at = snippet["publishedAt"]

        # Skip private or deleted videos
        if "Private video" in video_title or "Deleted video" in video_title:
            continue

        videos.append({
            "id": video_id,
            "title": video_title,
            "description": video_description,
            "publishedAt": video_published_at
        })

    # Write the video data to a JSON file
    with open("src/data/videos.json", "w") as f:
        json.dump(videos, f, indent=2)

if __name__ == "__main__":
    main()
