'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Music, Play, ExternalLink, Calendar } from 'lucide-react';
import { Icons } from '@/components/common/Icons';
import type { MusicVideo } from '@/types/music';
import { FormattedDate } from '@/components/common/FormattedDate';

const MusicClient = () => {
  const [videos, setVideos] = useState<MusicVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<MusicVideo | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/public/music-videos');
        const data = await response.json();
        if (data.videos) {
          setVideos(data.videos);
          if (data.videos.length > 0) {
            setActiveVideo(data.videos[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoPlay = async (video: MusicVideo) => {
    setActiveVideo(video);
    try {
      await fetch(`/api/public/music-videos/${video.id}/play`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to track play:', err);
    }
  };

  return (
    <div className="pt-28 sm:pt-32 pb-16">
      <section className="section-container !pb-0">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl flex-1"
          >
            <div className="v-tag mb-7">Side B · The Voice</div>
            <h1 className="font-serif font-light leading-[0.92] tracking-tight mb-7 text-[clamp(48px,9vw,128px)]">
              The <em className="not-italic font-black text-[color:var(--neon)]">Voice</em>
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-[color:var(--text-secondary)] opacity-90 leading-relaxed mb-5 max-w-2xl">
              &ldquo;Sangeet mere liye saans lene jaisa hai.&rdquo; <span className="opacity-60 not-italic">(Music is like breathing for me.)</span>
            </p>
            <p className="text-base sm:text-lg text-[color:var(--text-secondary)] opacity-80 leading-relaxed max-w-2xl">
              From the timeless melodies of Kishore Kumar and Lata Mangeshkar to the soulful modern hits of Arijit Singh, my journey is a tribute to the legends of Indian music. Whether in Hindi or Bengali, every song I sing is a piece of my heart.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-4 w-full lg:w-auto"
          >
            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[color:var(--text-muted)]">Join the Set</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://youtube.com/@suvojeetsengupta"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#FF0000] text-white font-mono text-[11px] uppercase tracking-[0.15em] font-bold hover:opacity-90 transition-opacity"
                title="Subscribe on YouTube"
              >
                <Icons.YouTube className="w-4 h-4" />
                YouTube
              </a>
              <a
                href="https://facebook.com/suvojeetsenguptaofficial"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white font-mono text-[11px] uppercase tracking-[0.15em] font-bold hover:opacity-90 transition-opacity"
                title="Follow on Facebook"
              >
                <Icons.Facebook className="w-4 h-4" />
                Facebook
              </a>
              <a
                href="https://instagram.com/suvojeet_sengupta"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#E4405F] text-white font-mono text-[11px] uppercase tracking-[0.15em] font-bold hover:opacity-90 transition-opacity"
                title="Follow on Instagram"
              >
                <Icons.Instagram className="w-4 h-4" />
                Instagram
              </a>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mt-12 sm:mt-16">
          <div className="lg:col-span-2 space-y-8">
            {activeVideo && (
              <motion.div
                key={activeVideo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="aspect-video bg-black overflow-hidden border border-[color:var(--line-strong)] shadow-2xl relative group">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="mt-7 sm:mt-8">
                  <div className="flex items-center gap-2 text-[color:var(--neon)] font-mono text-[11px] uppercase tracking-[0.25em] mb-3">
                    <Calendar size={12} />
                    <FormattedDate date={activeVideo.publishedAt} options={{ day: '2-digit', month: 'long', year: 'numeric' }} />
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight leading-tight mb-4">{activeVideo.title}</h2>
                  <p className="text-[color:var(--text-secondary)] opacity-80 text-base sm:text-lg max-w-2xl leading-relaxed">
                    {activeVideo.description || 'Watch the latest performance from Suvojeet Sengupta.'}
                  </p>
                </div>
              </motion.div>
            )}

            {!activeVideo && loading && (
              <div className="aspect-video bg-[color:var(--bg-secondary)] animate-pulse" />
            )}
          </div>

          <aside>
            <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--line-strong)] p-5 sm:p-6 md:p-7 h-full max-h-[800px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg sm:text-xl font-semibold">Playlist</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--text-muted)]">{videos.length} Tracks</span>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--neon)] mb-3 sticky top-0 bg-[color:var(--bg-secondary)] py-1 z-10">More Songs</h4>
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => {
                      handleVideoPlay(video);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`w-full flex gap-3 p-2.5 transition-all text-left border ${
                      activeVideo?.id === video.id
                      ? 'bg-[color:var(--bg-primary)] border-[color:var(--neon)]'
                      : 'bg-[color:var(--bg-primary)]/40 border-transparent hover:bg-[color:var(--bg-primary)] hover:border-[color:var(--line)]'
                    }`}
                  >
                    <div className="w-28 sm:w-32 aspect-video bg-black overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play size={16} className="text-[color:var(--neon)] fill-[color:var(--neon)]" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-serif font-semibold text-sm line-clamp-2 leading-tight">{video.title}</h5>
                      <p className="font-mono text-[10px] text-[color:var(--text-muted)] mt-2 uppercase tracking-[0.15em]">
                        <FormattedDate date={video.publishedAt} options={{ month: 'long', year: 'numeric' }} />
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default MusicClient;
