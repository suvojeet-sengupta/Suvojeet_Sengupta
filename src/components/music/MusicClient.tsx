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
    <div className="pt-32 pb-16">
      <section className="section-container !pb-0">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              The <span className="text-accent">Voice</span>
            </h1>
            <p className="text-xl text-secondary leading-relaxed mb-6 italic">
              &quot;Sangeet mere liye saans lene jaisa hai.&quot; (Music is like breathing for me.)
            </p>
            <p className="text-lg text-secondary leading-relaxed font-medium">
              From the timeless melodies of Kishore Kumar and Lata Mangeshkar to the soulful modern hits of Arijit Singh, my journey is a tribute to the legends of Indian music. Whether in Hindi or Bengali, every song I sing is a piece of my heart.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted">Join the Community</h3>
            <div className="flex flex-wrap gap-3">
              <a 
                href="https://youtube.com/@suvojeetsengupta" 
                target="_blank" 
                className="flex items-center gap-2 px-4 py-2 bg-[#FF0000] text-white rounded-sm font-bold text-sm hover:scale-105 transition-transform"
                title="Subscribe on YouTube"
              >
                <Icons.YouTube className="w-4 h-4" />
                YouTube
              </a>
              <a 
                href="https://facebook.com/suvojeetsenguptaofficial" 
                target="_blank" 
                className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-sm font-bold text-sm hover:scale-105 transition-transform"
                title="Follow on Facebook"
              >
                <Icons.Facebook className="w-4 h-4" />
                Facebook
              </a>
              <a 
                href="https://instagram.com/suvojeet_sengupta" 
                target="_blank" 
                className="flex items-center gap-2 px-4 py-2 bg-[#E4405F] text-white rounded-sm font-bold text-sm hover:scale-105 transition-transform"
                title="Follow on Instagram"
              >
                <Icons.Instagram className="w-4 h-4" />
                Instagram
              </a>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mt-16">
          <div className="lg:col-span-2 space-y-8">
            {activeVideo && (
              <motion.div
                key={activeVideo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="aspect-video bg-black rounded-sm overflow-hidden border border-light shadow-2xl relative group">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="mt-8">
                  <div className="flex items-center gap-2 text-brand-orange text-xs font-black uppercase tracking-widest mb-3">
                    <Calendar size={12} />
                    <FormattedDate date={activeVideo.publishedAt} options={{ day: '2-digit', month: 'long', year: 'numeric' }} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-4">{activeVideo.title}</h2>
                  <p className="text-secondary font-medium text-lg max-w-2xl leading-relaxed">
                    {activeVideo.description || 'Watch the latest performance from Suvojeet Sengupta.'}
                  </p>
                </div>
              </motion.div>
            )}

            {!activeVideo && loading && (
              <div className="aspect-video bg-tertiary animate-pulse rounded-sm" />
            )}
          </div>

          <aside>
            <div className="bg-tertiary border border-light/50 rounded-sm p-6 md:p-8 h-full max-h-[800px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase tracking-tighter">Playlist</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">{videos.length} Tracks</span>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-muted mb-4 sticky top-0 bg-tertiary py-2 z-10">More Songs</h4>
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => {
                      handleVideoPlay(video);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`w-full flex gap-4 p-3 rounded-sm transition-all text-left border ${
                      activeVideo?.id === video.id
                      ? 'bg-background border-brand-orange shadow-md scale-[1.02]'
                      : 'bg-background/50 border-transparent hover:bg-background hover:border-light'
                    }`}
                  >
                    <div className="w-32 aspect-video bg-zinc-200 rounded-sm overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play size={16} className="text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-sm line-clamp-2 leading-tight">{video.title}</h5>
                      <p className="text-[10px] text-muted mt-2 font-bold uppercase tracking-wider">
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
