import os
from datetime import datetime
from googleapiclient.discovery import build

# --- Configuration ---
YOUTUBE_CHANNEL_ID = "UCqDDM6Q1purcYsW8rfGXstQ" # Your channel ID
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY") # Get API key from environment variable

MUSIC_HTML_PATH = "music.html"
VIDEOS_DATA_JSON_PATH = "videos_data.json" # New file to store video data
PLACEHOLDER = "<!-- YOUTUBE_VIDEOS_LIST -->" # This placeholder will be replaced by JS container
MAX_VIDEOS_PER_PAGE = 9 # Number of videos to show per page

def fetch_all_youtube_videos():
    """Fetches all YouTube videos from the channel using YouTube Data API."""
    if not YOUTUBE_API_KEY:
        print("Error: YOUTUBE_API_KEY environment variable not set.")
        return None

    youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
    all_videos = []
    next_page_token = None

    try:
        # Get the uploads playlist ID for the channel
        channel_response = youtube.channels().list(
            id=YOUTUBE_CHANNEL_ID,
            part="contentDetails"
        ).execute()
        uploads_playlist_id = channel_response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

        while True:
            playlist_items_response = youtube.playlistItems().list(
                playlistId=uploads_playlist_id,
                part="snippet",
                maxResults=50, # Max allowed by API
                pageToken=next_page_token
            ).execute()

            video_ids = [item["snippet"]["resourceId"]["videoId"] for item in playlist_items_response.get("items", [])]

            if not video_ids:
                break

            # Get video details, including description, in batches
            videos_response = youtube.videos().list(
                id=",".join(video_ids),
                part="snippet"
            ).execute()

            video_details = {item['id']: item['snippet'] for item in videos_response.get("items", [])}

            for video_id in video_ids:
                if video_id not in video_details:
                    continue

                snippet = video_details[video_id]
                title = snippet["title"]
                description = snippet.get("description", "")
                published_at = snippet["publishedAt"]

                try:
                    dt_object = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
                    formatted_date = dt_object.strftime("%B %d, %Y")
                except ValueError:
                    formatted_date = "Date N/A"

                all_videos.append({
                    "id": video_id,
                    "title": title,
                    "description": description,
                    "published_at": published_at,
                    "formatted_date": formatted_date,
                    "thumbnail": f"https://img.youtube.com/vi/{video_id}/mqdefault.jpg",
                    "url": f"https://www.youtube.com/watch?v={video_id}"
                })

            next_page_token = playlist_items_response.get("nextPageToken")
            if not next_page_token:
                break
        
        # Sort videos by published date (most recent first)
        all_videos.sort(key=lambda x: x['published_at'], reverse=True)
        
        return all_videos

    except Exception as e:
        print(f"Error fetching videos from YouTube API: {e}")
        return None

def generate_videos_json(videos_data):
    """Generates a JSON string of video data."""
    import json
    return json.dumps(videos_data, indent=2)

def update_html_and_json_files(videos_data_json):
    """Updates music.html to include JS and creates videos_data.json."""
    try:
        # Write videos_data.json
        with open(VIDEOS_DATA_JSON_PATH, 'w', encoding='utf-8') as f:
            f.write(videos_data_json)
        print(f"Successfully created {VIDEOS_DATA_JSON_PATH}.")

        # Read music.html
        with open(MUSIC_HTML_PATH, 'r', encoding='utf-8') as f:
            html_content = f.read()

        # Prepare the JavaScript to be injected into music.html
        # This JS will load the JSON, handle pagination, and render videos
        js_injection = f"""
        <div id="youtube-videos-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <!-- Videos will be rendered here by JavaScript -->
        </div>
        <div class="flex justify-center mt-8 space-x-4">
            <button id="prevPage" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <button id="nextPage" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
        </div>

        <script>
            const videosContainer = document.getElementById('youtube-videos-container');
            const prevButton = document.getElementById('prevPage');
            const nextButton = document.getElementById('nextPage');
            let allVideos = [];
            let currentPage = 0;
            const videosPerPage = {MAX_VIDEOS_PER_PAGE}; // From Python script

            async function loadVideosData() {{
                try {{
                    const response = await fetch('{VIDEOS_DATA_JSON_PATH}');
                    allVideos = await response.json();
                    renderVideos();
                }} catch (error) {{
                    console.error('Error loading videos data:', error);
                    videosContainer.innerHTML = '<p class="text-red-500">Failed to load videos. Please try again later.</p>';
                }}
            }}

            function renderVideos() {{
                videosContainer.innerHTML = ''; // Clear current videos
                const start = currentPage * videosPerPage;
                const end = start + videosPerPage;
                const videosToRender = allVideos.slice(start, end);

                if (videosToRender.length === 0 && allVideos.length > 0 && currentPage > 0) {{
                    // If we navigated to an empty page, go back one
                    currentPage--;
                    renderVideos();
                    return;
                }}

                if (videosToRender.length === 0 && allVideos.length === 0) {{
                    videosContainer.innerHTML = '<p class="text-gray-500">No videos found.</p>';
                    prevButton.disabled = true;
                    nextButton.disabled = true;
                    return;
                }}

                videosToRender.forEach(video => {{
                    const videoCard = `
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                            <div class="relative w-full" style="padding-top: 56.25%;">
                                <iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/${{video.id}}" title="${{video.title}}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            <div class="p-6">
                                <h3 class="text-xl font-bold mb-2"><a href="${{video.url}}" target="_blank" rel="noopener noreferrer">${{video.title}}</a></h3>
                                <p class="text-gray-600 dark:text-gray-400 text-sm">Uploaded: ${{video.formatted_date}}</p>
                            </div>
                        </div>
                    `;
                    videosContainer.innerHTML += videoCard;
                }});

                // Update button states
                prevButton.disabled = currentPage === 0;
                nextButton.disabled = (currentPage + 1) * videosPerPage >= allVideos.length;
            }}

            // Event Listeners
            prevButton.addEventListener('click', () => {{
                if (currentPage > 0) {{
                    currentPage--;
                    renderVideos();
                    window.scrollTo({{ top: videosContainer.offsetTop - 100, behavior: 'smooth' }}); // Scroll to top of videos
                }}
            }});

            nextButton.addEventListener('click', () => {{
                if ((currentPage + 1) * videosPerPage < allVideos.length) {{
                    currentPage++;
                    renderVideos();
                    window.scrollTo({{ top: videosContainer.offsetTop - 100, behavior: 'smooth' }}); // Scroll to top of videos
                }}
            }});

            // Initial load
            document.addEventListener('DOMContentLoaded', loadVideosData);
        </script>
        """

        # Replace the placeholder in music.html
        if PLACEHOLDER not in html_content:
            print(f"Placeholder '{PLACEHOLDER}' not found in {MUSIC_HTML_PATH}. HTML not updated.")
            return False

        updated_html_content = html_content.replace(PLACEHOLDER, js_injection)

        with open(MUSIC_HTML_PATH, 'w', encoding='utf-8') as f:
            f.write(updated_html_content)
        print(f"Successfully updated {MUSIC_HTML_PATH} with JavaScript for pagination.")
        return True
    except IOError as e:
        print(f"Error reading/writing HTML file {MUSIC_HTML_PATH}: {e}")
        return False

if __name__ == "__main__":
    print("Starting YouTube video update script (using YouTube Data API)...")
    all_videos = fetch_all_youtube_videos()
    if all_videos:
        videos_json = generate_videos_json(all_videos)
        update_html_and_json_files(videos_json)
    else:
        print("Failed to fetch all videos or no videos found.")
    print("Script finished.")