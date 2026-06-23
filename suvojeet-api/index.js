import express from 'express';
import cors from 'cors';
import satori from 'satori';
import React from 'react';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve paths inside persistent data volume
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const fontDir = path.join(dataDir, 'fonts');
if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
}

const cacheFilePath = path.join(dataDir, 'github-cache.json');
const regularFontPath = path.join(fontDir, 'inter-regular.woff');
const boldFontPath = path.join(fontDir, 'inter-bold.woff');

const app = express();
const PORT = process.env.PORT || 5000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPOS = (process.env.REPOS || 'suvojeet-sengupta/SuvMusic,suvojeet-sengupta/NoteNext,suvojeet-sengupta/Suvojeet_Sengupta').split(',');
const FETCH_INTERVAL_MS = (parseInt(process.env.FETCH_INTERVAL_MINUTES, 10) || 15) * 60 * 1000;

app.use(cors());
app.use(express.json());

// Normalizes double/multiple slashes in incoming URLs
app.use((req, res, next) => {
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/\/+/g, '/');
  }
  next();
});

const el = React.createElement;

// ─── FONT LOADER & CACHER ────────────────────────────────────
let fontRegular = null;
let fontBold = null;

async function loadFonts() {
  if (fs.existsSync(regularFontPath) && fs.existsSync(boldFontPath)) {
    console.log('Loading fonts from local persistent volume...');
    fontRegular = fs.readFileSync(regularFontPath);
    fontBold = fs.readFileSync(boldFontPath);
  } else {
    console.log('Fetching fonts from CDN...');
    try {
      const [regRes, boldRes] = await Promise.all([
        fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-400-normal.woff'),
        fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-800-normal.woff')
      ]);

      if (!regRes.ok || !boldRes.ok) {
        throw new Error(`Failed to fetch fonts from CDN: ${regRes.status} / ${boldRes.status}`);
      }

      const regBuffer = Buffer.from(await regRes.arrayBuffer());
      const boldBuffer = Buffer.from(await boldRes.arrayBuffer());

      fs.writeFileSync(regularFontPath, regBuffer);
      fs.writeFileSync(boldFontPath, boldBuffer);

      fontRegular = regBuffer;
      fontBold = boldBuffer;
      console.log('Fonts saved locally in persistent data volume and loaded.');
    } catch (error) {
      console.error('Error fetching fonts:', error);
      throw error;
    }
  }
}

// ─── GITHUB STATS BACKGROUND WORKER ──────────────────────────
let repoCache = {};

function loadGithubCacheFromDisk() {
  try {
    if (fs.existsSync(cacheFilePath)) {
      const fileData = fs.readFileSync(cacheFilePath, 'utf8');
      repoCache = JSON.parse(fileData);
      console.log('Loaded GitHub stats cache from disk:', Object.keys(repoCache));
    }
  } catch (error) {
    console.error('Error reading GitHub cache from disk:', error);
  }
}

function saveGithubCacheToDisk() {
  try {
    fs.writeFileSync(cacheFilePath, JSON.stringify(repoCache, null, 2), 'utf8');
    console.log('Saved GitHub stats cache to disk.');
  } catch (error) {
    console.error('Error writing GitHub cache to disk:', error);
  }
}

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
    saveGithubCacheToDisk();
  }
  console.log('GitHub fetch cycle completed. Next run in', (FETCH_INTERVAL_MS / 60 / 1000), 'minutes.');
}

// ─── DYNAMIC OG IMAGE SYSTEMS & THEMES ────────────────────────
const THEMES = {
  orange: {
    name: 'orange',
    primary: '#f97316',
    primaryLight: 'rgba(249, 115, 22, 0.15)',
    primaryBorder: 'rgba(249, 115, 22, 0.35)',
    glow: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, rgba(249,115,22,0.06) 50%, transparent 70%)',
    barGradient: 'linear-gradient(90deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
  },
  blue: {
    name: 'blue',
    primary: '#3b82f6',
    primaryLight: 'rgba(59, 130, 246, 0.15)',
    primaryBorder: 'rgba(59, 130, 246, 0.35)',
    glow: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0.06) 50%, transparent 70%)',
    barGradient: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
  },
  purple: {
    name: 'purple',
    primary: '#a855f7',
    primaryLight: 'rgba(168, 85, 247, 0.15)',
    primaryBorder: 'rgba(168, 85, 247, 0.35)',
    glow: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0.06) 50%, transparent 70%)',
    barGradient: 'linear-gradient(90deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)',
  },
  pink: {
    name: 'pink',
    primary: '#ec4899',
    primaryLight: 'rgba(236, 72, 153, 0.15)',
    primaryBorder: 'rgba(236, 72, 153, 0.35)',
    glow: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, rgba(236,72,153,0.06) 50%, transparent 70%)',
    barGradient: 'linear-gradient(90deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
  },
  cyberpunk: {
    name: 'cyberpunk',
    primary: '#f43f5e',
    primaryLight: 'rgba(244, 63, 94, 0.15)',
    primaryBorder: 'rgba(244, 63, 94, 0.35)',
    glow: 'radial-gradient(circle, rgba(244,63,94,0.25) 0%, rgba(6,182,212,0.15) 50%, transparent 70%)',
    barGradient: 'linear-gradient(90deg, #f43f5e 0%, #d946ef 50%, #06b6d4 100%)',
  }
};

// OG Image rendering logic handler
async function handleOgImageRequest(req, res) {
  try {
    if (!fontRegular || !fontBold) {
      await loadFonts();
    }

    const title = req.query.title || 'Suvojeet Sengupta';
    const category = req.query.category || '';
    const subtitle = req.query.subtitle || '';
    const image = req.query.image || '';
    const author = req.query.author || 'SUVOJEET SENGUPTA';

    // Auto-detect theme or fallback to query parameter
    let selectedTheme = req.query.theme || 'orange';
    const cleanCategory = category.toLowerCase();
    
    if (!req.query.theme) {
      if (cleanCategory.includes('music') || cleanCategory.includes('sing') || cleanCategory.includes('song')) {
        selectedTheme = 'pink';
      } else if (cleanCategory.includes('code') || cleanCategory.includes('tech') || cleanCategory.includes('android') || cleanCategory.includes('next')) {
        selectedTheme = 'blue';
      } else if (cleanCategory.includes('vibe') || cleanCategory.includes('design')) {
        selectedTheme = 'cyberpunk';
      } else if (cleanCategory.includes('notenext')) {
        selectedTheme = 'purple';
      }
    }

    const themeData = THEMES[selectedTheme] || THEMES.orange;

    // Load external image to Base64 if provided
    let base64Image = null;
    if (image) {
      try {
        const imgRes = await fetch(image);
        if (imgRes.ok) {
          const arrayBuf = await imgRes.arrayBuffer();
          const contentType = imgRes.headers.get('content-type') || 'image/png';
          base64Image = `data:${contentType};base64,${Buffer.from(arrayBuf).toString('base64')}`;
        }
      } catch (err) {
        console.error('Failed to pre-fetch OG background image:', err.message);
      }
    }

    const fontSize = title.length > 70 ? 44 : title.length > 40 ? 52 : 62;
    const titleFontSize = subtitle ? Math.min(fontSize, 56) : fontSize;

    const getHeaderIcon = () => {
      const strokeStyle = { stroke: themeData.primary, strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
      if (cleanCategory.includes('music') || cleanCategory.includes('sing')) {
        return el('svg', { width: 26, height: 26, viewBox: '0 0 24 24', style: { display: 'flex' } },
          el('path', { d: 'M9 18V5l12-2v13', ...strokeStyle }),
          el('circle', { cx: 6, cy: 18, r: 3, ...strokeStyle }),
          el('circle', { cx: 18, cy: 16, r: 3, ...strokeStyle })
        );
      } else if (cleanCategory.includes('code') || cleanCategory.includes('tech') || cleanCategory.includes('android') || cleanCategory.includes('next')) {
        return el('svg', { width: 26, height: 26, viewBox: '0 0 24 24', style: { display: 'flex' } },
          el('polyline', { points: '16 18 22 12 16 6', ...strokeStyle }),
          el('polyline', { points: '8 6 2 12 8 18', ...strokeStyle })
        );
      }
      return el('svg', { width: 26, height: 26, viewBox: '0 0 24 24', style: { display: 'flex' } },
        el('polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2', ...strokeStyle })
      );
    };

    const renderRightVisual = () => {
      if (base64Image) {
        return el('div', {
          style: {
            display: 'flex',
            width: '360px',
            height: '240px',
            borderRadius: '24px',
            border: `2px solid ${themeData.primaryBorder}`,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.02)'
          }
        },
          el('img', {
            src: base64Image,
            style: { width: '100%', height: '100%', objectFit: 'cover' }
          })
        );
      }

      if (cleanCategory.includes('music') || cleanCategory.includes('sing') || cleanCategory.includes('song')) {
        return el('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '360px',
            height: '240px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '24px',
            border: '1.5px solid rgba(255, 255, 255, 0.05)',
          }
        },
          [40, 100, 70, 140, 180, 110, 150, 80, 120, 50].map((h, i) =>
            el('div', {
              key: i,
              style: {
                width: '10px',
                height: `${h}px`,
                background: themeData.barGradient,
                borderRadius: '5px',
                opacity: 0.2 + (i % 4) * 0.25
              }
            })
          )
        );
      } else if (cleanCategory.includes('code') || cleanCategory.includes('tech') || cleanCategory.includes('android') || cleanCategory.includes('next')) {
        return el('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            width: '360px',
            height: '240px',
            background: 'rgba(10, 10, 10, 0.8)',
            borderRadius: '24px',
            border: `1.5px solid ${themeData.primaryBorder}`,
            padding: '24px',
          }
        },
          el('div', { style: { display: 'flex', gap: '8px', marginBottom: '18px' } },
            el('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' } }),
            el('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' } }),
            el('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' } })
          ),
          el('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'Inter' } },
            el('span', { style: { color: '#6b7280', fontSize: '13px' } }, '$ agy deploy --vps'),
            el('span', { style: { color: themeData.primary, fontSize: '15px', fontWeight: 800 } }, '✔ Deploying Vibe Engine...'),
            el('span', { style: { color: '#9ca3af', fontSize: '13px' } }, '» Running edge compiler'),
            el('span', { style: { color: '#10b981', fontSize: '13px' } }, '» D1 bindings connected [OK]'),
            el('span', { style: { color: '#6b7280', fontSize: '12px', marginTop: '10px' } }, 'suvojeet@vps:~/portfolio$')
          )
        );
      }

      return el('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '360px',
          height: '240px',
          position: 'relative'
        }
      },
        el('div', {
          style: {
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: themeData.barGradient,
            opacity: 0.7,
            filter: 'blur(35px)'
          }
        }),
        el('div', {
          style: {
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.03)'
          }
        })
      );
    };

    const element = el("div", {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        background: "#080808",
        padding: "60px 80px",
        position: "relative",
        overflow: "hidden",
      },
    },
      el("div", {
        style: {
          position: "absolute",
          top: "-150px",
          right: "-150px",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: themeData.glow,
          filter: "blur(40px)"
        }
      }),
      el("div", {
        style: {
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "36px 36px"
        }
      }),
      el("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative"
        }
      },
        el("div", { style: { display: "flex", alignItems: "center", gap: "14px" } },
          getHeaderIcon(),
          el("span", {
            style: { color: "white", fontSize: "20px", fontWeight: 800, letterSpacing: "0.18em", fontFamily: "Inter" }
          }, author.toUpperCase())
        ),
        el("span", { style: { color: "#666", fontSize: "16px", fontWeight: 500, letterSpacing: "0.05em", fontFamily: "Inter" } }, "suvojeetsengupta.in")
      ),
      el("div", {
        style: {
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "40px",
          position: "relative",
          marginTop: "20px"
        }
      },
        el("div", {
          style: { display: "flex", flexDirection: "column", justifySelf: "center", flex: 1 }
        },
          category ? el("div", {
            style: {
              alignSelf: "flex-start",
              background: themeData.primaryLight,
              border: `1.5px solid ${themeData.primaryBorder}`,
              borderRadius: "50px",
              padding: "6px 20px",
              color: themeData.primary,
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              marginBottom: "24px",
              fontFamily: "Inter"
            }
          }, category.toUpperCase()) : null,
          el("div", {
            style: {
              color: "white",
              fontSize: `${titleFontSize}px`,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              fontFamily: "Inter"
            }
          }, title),
          subtitle ? el("div", {
            style: {
              color: "#9ca3af",
              fontSize: "24px",
              fontWeight: 400,
              lineHeight: 1.4,
              marginTop: "16px",
              maxWidth: "600px",
              fontFamily: "Inter"
            }
          }, subtitle) : null
        ),
        el("div", {
          style: { display: "flex", alignItems: "center", justifyContent: "center", minWidth: "360px" }
        }, renderRightVisual())
      ),
      el("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          paddingTop: "20px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)"
        }
      },
        el("div", { style: { display: "flex", gap: "6px", alignItems: "center" } },
          [1, 2, 3].map((v) =>
            el("div", {
              key: v,
              style: {
                width: v === 3 ? "18px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: v === 3 ? themeData.primary : "rgba(255, 255, 255, 0.15)"
              }
            })
          )
        ),
        el("span", { style: { color: "#4b5563", fontSize: "14px", fontWeight: 600, fontFamily: "Inter" } }, "VIBE ARCHITECT × SOULFUL SINGER")
      ),
      el("div", {
        style: {
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "6px",
          background: themeData.barGradient
        }
      })
    );

    const svg = await satori(element, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: fontBold, weight: 800, style: 'normal' },
      ],
    });

    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
    const rendered = resvg.render();
    const pngBuffer = rendered.asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
    res.send(pngBuffer);
  } catch (error) {
    console.error('OG Image Generation Error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

// ─── API ROUTING DEFINITIONS ───────────────────────────────

// 1. OG Image Endpoint (both paths supported for compatibility)
app.get('/api/og-image', handleOgImageRequest);
app.get('/og-image', handleOgImageRequest);

// 2. GitHub Stats Cache Endpoint
app.get('/api/github-stats', (req, res) => {
  res.json({
    success: true,
    data: repoCache,
    updatedAt: fs.existsSync(cacheFilePath) ? fs.statSync(cacheFilePath).mtime : new Date()
  });
});

// 3. Single Repository Query
app.get('/api/github-stats/:repoName', (req, res) => {
  const repoName = req.params.repoName;
  const repoData = repoCache[repoName];
  if (!repoData) {
    return res.status(404).json({ success: false, error: `Repository ${repoName} not found in cache` });
  }
  res.json({ success: true, data: repoData });
});

// 4. Root Endpoint (Dashboard/Healthcheck)
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Suvojeet Sengupta Unified Portfolio API',
    cachedReposCount: Object.keys(repoCache).length,
    cachedReposList: Object.keys(repoCache),
    githubSyncIntervalMinutes: (FETCH_INTERVAL_MS / 60 / 1000),
    endpoints: {
      ogImage: '/api/og-image?title=Hello&subtitle=World&category=tech',
      githubStats: '/api/github-stats'
    }
  });
});

// ─── INITIALIZATION STARTUP ──────────────────────────────────
loadGithubCacheFromDisk();

// Run immediate async fetch
updateAllRepos();

// Interval setup
setInterval(updateAllRepos, FETCH_INTERVAL_MS);

// Load fonts on start then bind server
loadFonts().then(() => {
  app.listen(PORT, () => {
    console.log(`Unified API listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize fonts/startup unified API:', err);
  process.exit(1);
});
