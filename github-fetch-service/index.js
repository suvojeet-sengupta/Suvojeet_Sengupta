import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cacheDir = path.join(__dirname, 'data');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}
const cacheFilePath = path.join(cacheDir, 'github-cache.json');

const app = express();
const PORT = process.env.PORT || 5003;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPOS = (process.env.REPOS || 'suvojeet-sengupta/SuvMusic,suvojeet-sengupta/NoteNext').split(',');
const FETCH_INTERVAL_MS = (parseInt(process.env.FETCH_INTERVAL_MINUTES, 10) || 15) * 60 * 1000;

app.use(cors());
app.use(express.json());

// In-memory cache
let repoCache = {};

// Load cache from disk if exists
function loadCacheFromDisk() {
  try {
    if (fs.existsSync(cacheFilePath)) {
      const fileData = fs.readFileSync(cacheFilePath, 'utf8');
      repoCache = JSON.parse(fileData);
      console.log('Loaded GitHub cache from disk:', Object.keys(repoCache));
    }
  } catch (error) {
    console.error('Error reading cache from disk:', error);
  }
}

// Save cache to disk
function saveCacheToDisk() {
  try {
    fs.writeFileSync(cacheFilePath, JSON.stringify(repoCache, null, 2), 'utf8');
    console.log('Saved GitHub cache to disk.');
  } catch (error) {
    console.error('Error writing cache to disk:', error);
  }
}

// Fetch single repository details
async function fetchRepoData(repoPath) {
  const cleanPath = repoPath.trim();
  if (!cleanPath) return null;

  console.log(`Fetching statistics for repository: ${cleanPath}...`);
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Suvojeet-Portfolio-Fetcher'
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/repos/${cleanPath}`, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      name: data.name,
      description: data.description,
      stargazers_count: data.stargazers_count,
      language: data.language,
      html_url: data.html_url,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error(`Failed to fetch data for ${cleanPath}:`, error.message);
    return null;
  }
}

// Fetch all repositories and update cache
async function updateAllRepos() {
  console.log('Starting scheduled GitHub fetch cycle...');
  const newCache = { ...repoCache };
  let hasUpdates = false;

  for (const repoPath of REPOS) {
    const data = await fetchRepoData(repoPath);
    if (data) {
      const repoName = repoPath.split('/')[1];
      newCache[repoName] = data;
      hasUpdates = true;
    }
  }

  if (hasUpdates) {
    repoCache = newCache;
    saveCacheToDisk();
  }
  console.log('GitHub fetch cycle completed. Next run in', (FETCH_INTERVAL_MS / 60 / 1000), 'minutes.');
}

// Endpoint to fetch cached stats
app.get('/api/github-stats', (req, res) => {
  res.json({
    success: true,
    data: repoCache,
    updatedAt: fs.existsSync(cacheFilePath) ? fs.statSync(cacheFilePath).mtime : new Date()
  });
});

// Single repository endpoint
app.get('/api/github-stats/:repoName', (req, res) => {
  const repoName = req.params.repoName;
  const repoData = repoCache[repoName];
  if (!repoData) {
    return res.status(404).json({ success: false, error: `Repository ${repoName} not found in cache` });
  }
  res.json({ success: true, data: repoData });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'GitHub Stats Cache Service',
    monitoredRepos: REPOS,
    cachedReposCount: Object.keys(repoCache).length
  });
});

// Start the service
loadCacheFromDisk();

// Run immediate fetch on startup
updateAllRepos();

// Schedule background updates
setInterval(updateAllRepos, FETCH_INTERVAL_MS);

app.listen(PORT, () => {
  console.log(`GitHub Fetch Service listening on port ${PORT}`);
});
