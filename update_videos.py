import requests
import xml.etree.ElementTree as ET
import os

# --- Configuration ---
YOUTUBE_CHANNEL_ID = "UCqDDM6Q1purcYsW8rfGXstQ"
RSS_FEED_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={YOUTUBE_CHANNEL_ID}"
MUSIC_HTML_PATH = "music.html"
PLACEHOLDER = "<!-- YOUTUBE_VIDEOS_LIST -->"
MAX_VIDEOS = 6 # Display the latest 6 videos

def fetch_youtube_videos():
    """Fetches the latest YouTube videos from the RSS feed."""
    try:
        response = requests.get(RSS_FEED_URL)
        response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
        return response.content
    except requests.exceptions.RequestException as e:
        print(f"Error fetching RSS feed: {e}")
        return None

def parse_videos_from_rss(rss_content):
    """Parses RSS content and extracts video details."""
    videos = []
    if not rss_content:
        return videos

    try:
        root = ET.fromstring(rss_content)
        # Namespace for Atom feed
        ns = {'atom': 'http://www.w3.org/2005/Atom',
              'yt': 'http://www.youtube.com/xml/schemas/2015',
              'media': 'http://search.yahoo.com/mrss/'}

        for entry in root.findall('atom:entry', ns):
            title = entry.find('atom:title', ns).text
            link = entry.find('atom:link', ns).get('href')
            video_id = entry.find('yt:videoId', ns).text
            
            # Find thumbnail URL
            thumbnail_url = None
            media_group = entry.find('media:group', ns)
            if media_group is not None:
                media_thumbnail = media_group.find('media:thumbnail', ns)
                if media_thumbnail is not None:
                    thumbnail_url = media_thumbnail.get('url')
            
            # Fallback for thumbnail if not found in media:thumbnail
            if not thumbnail_url and video_id:
                thumbnail_url = f"https://img.youtube.com/vi/{video_id}/mqdefault.jpg" # Medium quality default thumbnail

            videos.append({
                'title': title,
                'link': link,
                'video_id': video_id,
                'thumbnail': thumbnail_url
            })
            if len(videos) >= MAX_VIDEOS:
                break
    except ET.ParseError as e:
        print(f"Error parsing RSS XML: {e}")
    return videos

def generate_video_html(videos):
    """Generates HTML snippets for the given video list."""
    html_snippets = []
    for video in videos:
        # Using iframe for embedding, and a link for the title
        # Added a wrapper div for styling consistency with the original music.html structure
        snippet = f"""
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <div class="relative w-full" style="padding-top: 56.25%;">
                    <iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/{video['video_id']}" title="{video['title']}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2"><a href="{video['link']}" target="_blank" rel="noopener noreferrer">{video['title']}</a></h3>
                </div>
            </div>
        """
        html_snippets.append(snippet)
    return "\n".join(html_snippets)

def update_html_file(html_path, new_content):
    """Reads the HTML file, replaces the placeholder, and writes back."""
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()

        if PLACEHOLDER not in html_content:
            print(f"Placeholder '{PLACEHOLDER}' not found in {html_path}. HTML not updated.")
            return False

        updated_html_content = html_content.replace(PLACEHOLDER, new_content)

        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(updated_html_content)
        print(f"Successfully updated {html_path} with latest YouTube videos.")
        return True
    except IOError as e:
        print(f"Error reading/writing HTML file {html_path}: {e}")
        return False

if __name__ == "__main__":
    print("Starting YouTube video update script...")
    rss_data = fetch_youtube_videos()
    if rss_data:
        videos_list = parse_videos_from_rss(rss_data)
        if videos_list:
            videos_html = generate_video_html(videos_list)
            update_html_file(MUSIC_HTML_PATH, videos_html)
        else:
            print("No videos found or parsed from RSS feed.")
    else:
        print("Failed to fetch RSS data.")
    print("Script finished.")
