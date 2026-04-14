import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'My Blog Post';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#0d0d0d', // Dark Background
            padding: '80px',
            borderBottom: '20px solid #f97316', // Orange Accent
          }}
        >
          {/* Logo/Name Label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                backgroundColor: '#f97316',
                width: '12px',
                height: '40px',
                marginRight: '15px',
              }}
            />
            <span
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Suvojeet Sengupta
            </span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '20px',
              maxWidth: '900px',
              wordBreak: 'break-word',
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              color: '#888',
              marginTop: 'auto',
            }}
          >
            <span>Read more at suvojeetsengupta.in</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
