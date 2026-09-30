'use client';

import { apiUrl } from '@/lib/api-base';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import type { MusicVideo } from '@/types/music';
import { FormattedDate } from '@/components/common/FormattedDate';

const CHANNELS = [
  { name: 'YouTube', href: 'https://youtube.com/@suvojeetsengupta' },
  { name: 'Instagram', href: 'https://instagram.com/suvojeet__sengupta' },
  { name: 'Facebook', href: 'https://facebook.com/suvojeetsenguptaofficial' },
];

const REPERTOIRE = ['Hindi film songs', 'Bengali songs', 'Modern Bollywood', 'Patriotic songs', 'Live performance'];

interface MusicClientProps {
  initialVideos: MusicVideo[];
}

const MusicClient = ({ initialVideos }: MusicClientProps) => {
  const [videos, setVideos] = useState<MusicVideo[]>(initialVideos);
  const [loading, setLoading] = useState(initialVideos.length === 0);
  const [activeVideo, setActiveVideo] = useState<MusicVideo | null>(initialVideos[0] ?? null);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    // Only fetch if the server render had nothing (DB error or empty table)
    if (initialVideos.length > 0) return;
    const fetchVideos = async () => {
      try {
        const response = await fetch(apiUrl('/api/public/music-videos'));
        const data = await response.json();
        if (data.videos) {
          setVideos(data.videos);
          setActiveVideo(data.videos[0] ?? null);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [initialVideos]);

  const handleVideoPlay = async (video: MusicVideo) => {
    setActiveVideo(video);
    setAutoplay(true);
    document.getElementById('player')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try {
      await fetch(apiUrl(`/api/public/music-videos/${video.id}/play`), { method: 'POST' });
    } catch (err) {
      console.error('Failed to track play:', err);
    }
  };

  return (
    <div className="page">
      <header className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 items-end">
        <div>
          <p className="page-eyebrow">Music</p>
          <h1 className="page-title">Hindi &amp; Bengali vocals</h1>
          <p className="page-lede">
            I grew up on Kishore Kumar and Lata Mangeshkar, and today sing everything from
            film classics to Arijit Singh&apos;s modern catalogue. Recordings are below;
            more are on YouTube.
          </p>
        </div>
        <div className="lg:pb-2">
          <ul className="flex flex-wrap gap-2 mb-6" aria-label="Repertoire">
            {REPERTOIRE.map((r) => (
              <li key={r} className="tag">{r}</li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
            {CHANNELS.map((c) => (
              <li key={c.name}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-link">
                  {c.name} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section id="player" className="sec scroll-mt-24">
        {loading && (
          <div className="aspect-video bg-[color:var(--bg-secondary)] rounded-[6px] animate-pulse" />
        )}

        {!loading && !activeVideo && (
          <div className="border-t border-[color:var(--line-strong)] pt-10 max-w-xl">
            <h2 className="text-[28px] mb-3">Recordings are being added</h2>
            <p className="text-[16px] mb-6">
              The library here is being updated. In the meantime, every recording is on my
              YouTube channel.
            </p>
            <a href={CHANNELS[0].href} target="_blank" rel="noopener noreferrer" className="btn-solid">
              Watch on YouTube
            </a>
          </div>
        )}

        {activeVideo && (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <div className="aspect-video bg-black overflow-hidden rounded-[6px]">
                <iframe
                  key={activeVideo.id}
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}${autoplay ? '?autoplay=1' : ''}`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="mt-7">
                <p className="text-[14px] text-[color:var(--text-tertiary)] mb-2">
                  <FormattedDate date={activeVideo.publishedAt} options={{ day: 'numeric', month: 'long', year: 'numeric' }} />
                </p>
                <h2 className="text-[clamp(26px,3vw,36px)] leading-tight mb-3">{activeVideo.title}</h2>
                {activeVideo.description && (
                  <p className="text-[16px] max-w-2xl">{activeVideo.description}</p>
                )}
              </div>
            </div>

            <aside>
              <div className="flex items-baseline justify-between pb-4 border-b border-[color:var(--line-strong)]">
                <h2 className="text-[22px]">All recordings</h2>
                <span className="text-[13px] text-[color:var(--text-muted)]">{videos.length}</span>
              </div>
              <ol className="max-h-[640px] overflow-y-auto custom-scrollbar">
                {videos.map((video) => {
                  const active = activeVideo?.id === video.id;
                  return (
                    <li key={video.id} className="border-b border-[color:var(--line)]">
                      <button
                        onClick={() => handleVideoPlay(video)}
                        aria-current={active ? 'true' : undefined}
                        className="w-full flex gap-4 py-4 text-left group"
                      >
                        <div className="w-28 aspect-video bg-black overflow-hidden flex-shrink-0 relative rounded-[3px]">
                          <Image
                            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                            alt=""
                            fill
                            sizes="112px"
                            className={`object-cover transition-opacity ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
                          />
                        </div>
                        <div className="min-w-0">
                          <h3
                            className={`text-[16px] leading-snug line-clamp-2 ${
                              active ? 'text-[color:var(--text-primary)] underline underline-offset-4 decoration-1' : 'text-[color:var(--text-secondary)] group-hover:text-[color:var(--text-primary)]'
                            }`}
                          >
                            {video.title}
                          </h3>
                          <p className="text-[13px] text-[color:var(--text-muted)] mt-1.5">
                            <FormattedDate date={video.publishedAt} options={{ month: 'short', year: 'numeric' }} />
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
};

export default MusicClient;
