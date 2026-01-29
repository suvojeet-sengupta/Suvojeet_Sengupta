const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const VIDEOS_PATH = path.join(__dirname, '../src/data/videos.json');

// Helper to ask questions
const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    console.log('\n🎵  ADD NEW VIDEO TO WEBSITE  🎵\n');

    try {
        // 1. Get Video Details
        const id = await ask('Enter YouTube Video ID (e.g., dQw4w9WgXcQ): ');
        if (!id) throw new Error("Video ID is required!");

        const title = await ask('Enter Title: ');
        const category = await ask('Enter Category (Cover, Original, Arijit Singh, etc.): ');

        // 2. Create Video Object
        const newVideo = {
            id: id.trim(),
            title: title.trim(),
            description: "",
            publishedAt: new Date().toISOString(),
            category: category.trim() || 'Cover',
            comments: []
        };

        // 3. Read Existing File
        const rawData = fs.readFileSync(VIDEOS_PATH, 'utf8');
        const videos = JSON.parse(rawData);

        // 4. Add to Top
        videos.unshift(newVideo);

        // 5. Save
        fs.writeFileSync(VIDEOS_PATH, JSON.stringify(videos, null, 2), 'utf8');

        console.log('\n✅ Video added successfully!');
        console.log(`Title: ${newVideo.title}`);
        console.log(`Total Videos: ${videos.length}`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

main();
