import express from 'express';
import satori from 'satori';
import React from 'react';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware to normalize double/multiple slashes in incoming URL requests
app.use((req, res, next) => {
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/\/+/g, '/');
  }
  next();
});

const el = React.createElement;

// Cache for fonts in memory
let fontRegular = null;
let fontBold = null;

// Download/load fonts
async function loadFonts() {
  const fontDir = path.join(__dirname, 'fonts');
  if (!fs.existsSync(fontDir)) {
    fs.mkdirSync(fontDir, { recursive: true });
  }

  const regularPath = path.join(fontDir, 'inter-regular.woff');
  const boldPath = path.join(fontDir, 'inter-bold.woff');

  if (fs.existsSync(regularPath) && fs.existsSync(boldPath)) {
    console.log('Loading fonts from local cache...');
    fontRegular = fs.readFileSync(regularPath);
    fontBold = fs.readFileSync(boldPath);
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

      fs.writeFileSync(regularPath, regBuffer);
      fs.writeFileSync(boldPath, boldBuffer);

      fontRegular = regBuffer;
      fontBold = boldBuffer;
      console.log('Fonts saved locally and loaded.');
    } catch (error) {
      console.error('Error fetching fonts:', error);
      throw error;
    }
  }
}

// Design systems and themes mapping
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

app.get('/og-image', async (req, res) => {
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
    
    // Smart theme mapping based on category keywords
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

    // Vector SVG Icons for Header
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
      // Star fallback
      return el('svg', { width: 26, height: 26, viewBox: '0 0 24 24', style: { display: 'flex' } },
        el('polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2', ...strokeStyle })
      );
    };

    // Right side dynamic graphics component
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
            style: {
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }
          })
        );
      }

      // If no image, render dynamic abstract visualizers
      if (cleanCategory.includes('music') || cleanCategory.includes('sing') || cleanCategory.includes('song')) {
        // Equalizer wave graphic
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
        // Code terminal mockup graphic
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
          // Window dots
          el('div', { style: { display: 'flex', gap: '8px', marginBottom: '18px' } },
            el('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' } }),
            el('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' } }),
            el('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' } })
          ),
          // Code snippet
          el('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'Inter' } },
            el('span', { style: { color: '#6b7280', fontSize: '13px' } }, '$ agy deploy --vps'),
            el('span', { style: { color: themeData.primary, fontSize: '15px', fontWeight: 800 } }, '✔ Deploying Vibe Engine...'),
            el('span', { style: { color: '#9ca3af', fontSize: '13px' } }, '» Running edge compiler'),
            el('span', { style: { color: '#10b981', fontSize: '13px' } }, '» D1 bindings connected [OK]'),
            el('span', { style: { color: '#6b7280', fontSize: '12px', marginTop: '10px' } }, 'suvojeet@vps:~/portfolio$')
          )
        );
      }

      // Default Glowing Abstract Orb
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

    // Main React tree layout
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
      // Radial glow top-right
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
      // Dot grid overlay
      el("div", {
        style: {
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "36px 36px"
        }
      }),

      // Header row
      el("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative"
        }
      },
        // Logo / Title
        el("div", { style: { display: "flex", alignItems: "center", gap: "14px" } },
          getHeaderIcon(),
          el("span", {
            style: {
              color: "white",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "0.18em",
              fontFamily: "Inter"
            }
          }, author.toUpperCase())
        ),
        // Domain Label
        el("span", { style: { color: "#666", fontSize: "16px", fontWeight: 500, letterSpacing: "0.05em", fontFamily: "Inter" } }, "suvojeetsengupta.in")
      ),

      // Middle main section
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
        // Left details
        el("div", {
          style: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }
        },
          // Category Pill
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

          // Main Title
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

          // Subtitle
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

        // Right graphical preview
        el("div", {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "360px"
          }
        }, renderRightVisual())
      ),

      // Bottom Row / Footer
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
        // Decorative indicator dots
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
        // Branding Tag
        el("span", { style: { color: "#4b5563", fontSize: "14px", fontWeight: 600, fontFamily: "Inter" } }, "VIBE ARCHITECT × SOULFUL SINGER")
      ),

      // Bottom glowing border line
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
});

// Warm up fonts on start
loadFonts().then(() => {
  app.listen(PORT, () => {
    console.log(`OG Image Generator listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize fonts:', err);
  process.exit(1);
});
