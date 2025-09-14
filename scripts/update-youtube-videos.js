const axios = require('axios');
const fs = require('fs');
const path = require('path');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = 'UCqDDM6Q1purcYsW8rfGXstQ'; // Your channel ID

if (!YOUTUBE_API_KEY) {
  console.error('Error: YOUTUBE_API_KEY environment variable is not set.');
  process.exit(1);
}

const fetchAllVideos = async () => {
  try {
    // 1. Get the uploads playlist ID for the channel
    const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'contentDetails',
        id: YOUTUBE_CHANNEL_ID,
        key: YOUTUBE_API_KEY,
      },
    });

    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
    console.log(`Uploads Playlist ID: ${uploadsPlaylistId}`);

    let allVideos = [];
    let nextPageToken = null;

    // 2. Fetch all videos from the uploads playlist
    do {
      const playlistItemsResponse = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
        params: {
          part: 'snippet',
          playlistId: uploadsPlaylistId,
          maxResults: 50, // Max results per page
          key: YOUTUBE_API_KEY,
          pageToken: nextPageToken,
        },
      });

      const videos = playlistItemsResponse.data.items.map(item => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        publishedAt: item.snippet.publishedAt,
        formatted_date: new Date(item.snippet.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }));

      allVideos = allVideos.concat(videos);
      nextPageToken = playlistItemsResponse.data.nextPageToken;

    } while (nextPageToken);

    // Sort videos by published date, newest first
    allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    const outputPath = path.join(__dirname, '../public/videos_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(allVideos, null, 2));
    console.log(`Successfully updated ${outputPath} with ${allVideos.length} videos.`);

  } catch (error) {
    console.error('Error fetching YouTube videos:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
};

fetchAllVideos();
