import os
import json
from googleapiclient.discovery import build

def get_video_comments(youtube, video_id):
    """
    Fetches top-level comments for a given video.
    """
    comments = []
    try:
        request = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=20,  # Limiting to 20 comments for now
            textFormat="plainText"
        )
        response = request.execute()

        for item in response["items"]:
            comment = item["snippet"]["topLevelComment"]["snippet"]
            comments.append({
                "author": comment["authorDisplayName"],
                "text": comment["textDisplay"],
                "publishedAt": comment["publishedAt"],
            })
    except Exception as e:
        # Comments might be disabled or other errors
        print(f"Could not fetch comments for video {video_id}: {e}")
    
    return comments

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

        category = get_category(video_title)
        comments = get_video_comments(youtube, video_id)
        videos.append({
            "id": video_id,
            "title": video_title,
            "description": video_description,
            "publishedAt": video_published_at,
            "category": category,
            "comments": comments
        })

    # Write the video data to a JSON file
    with open("src/data/videos.json", "w") as f:
        json.dump(videos, f, indent=2)

def get_category(title):
    title = title.lower()
    if "live" in title or "performance" in title or "program" in title:
        return "Live Performance"
    if "retro" in title or "lag jaa gale" in title:
        return "Retro"
    if "arijit" in title or "vida karo" in title:
        return "Arijit Singh"
    if "rabindra sangeet" in title:
        return "Rabindra Sangeet"
    if "bhajan" in title or "bhakti" in title or "devotional" in title or "satyam shivam sundaram" in title:
        return "Bhajan"
    return "Cover"

if __name__ == "__main__":
    main()
