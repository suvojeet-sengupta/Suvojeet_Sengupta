'use client';

import React, { useEffect, useState } from 'react';
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
      </section>

      {/* Featured Video Section */}
      <section className="bg-tertiary py-16 mt-8">
        <div className="section-container !py-0">
          <div className="flex items-center gap-3 mb-8">
            <Music className="text-brand-orange" size={32} />
            <h2 className="text-3xl font-black uppercase tracking-tight">Featured Performances</h2>
          </div>

          {loading ? (
            <div className="aspect-video bg-zinc-200 animate-pulse rounded-sm"></div>
          ) : videos.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <div className="relative aspect-video bg-black rounded-sm overflow-hidden shadow-2xl border border-white/5">
                  {activeVideo && (
                    <iframe
                      src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0`}
                      title={activeVideo.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                {activeVideo && (
                  <div className="p-6 bg-background rounded-sm border-l-4 border-brand-orange shadow-sm">
                    <h3 className="text-2xl font-black mb-2">{activeVideo.title}</h3>
                    <div className="flex items-center gap-4 text-muted text-sm font-bold uppercase tracking-wider mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <FormattedDate date={activeVideo.publishedAt} options={{ month: 'long', year: 'numeric' }} />
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Icons.YouTube className="w-4 h-4" />
                        YouTube Official
                      </span>
                    </div>
                    {activeVideo.description && (
                      <p className="text-secondary leading-relaxed">{activeVideo.description}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
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
                      <img 
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                        alt={video.title}
                        className="w-full h-full object-cover"
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
          ) : (
            <div className="p-20 text-center border-2 border-dashed border-light rounded-sm">
              <Music className="mx-auto text-muted mb-4" size={48} />
              <p className="text-secondary font-medium italic">No performances added yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-container py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="profile-frame">
            <div className="aspect-square bg-tertiary flex items-center justify-center text-6xl">🎙️</div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Organic Practice</h2>
            <p className="text-lg text-secondary mb-6">
              I don&apos;t play instruments—I believe the human voice is the most powerful instrument of all. My practice is constant; I&apos;m always humming, always singing. Even when I&apos;m not in a studio, my voice is in training.
            </p>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-brand-orange bg-tertiary">
                <h4 className="font-bold uppercase tracking-widest text-xs text-muted mb-1">Languages</h4>
                <p className="font-bold">Hindi, Bengali</p>
              </div>
              <div className="p-4 border-l-4 border-brand-black bg-tertiary">
                <h4 className="font-bold uppercase tracking-widest text-xs text-muted mb-1">Musical Icons</h4>
                <p className="font-bold">Kishore Kumar, Lata Mangeshkar, Arijit Singh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-black text-white py-16">
        <div className="section-container !py-0 text-center">
          <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter">Collaborate with the Voice</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
            Looking for a soulful cover, a live performance, or a vocal collaboration? Let&apos;s create something beautiful together.
          </p>
          <a href="/contact" className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-black py-4 px-10 rounded-sm uppercase tracking-widest transition-colors">
            Contact for Collaboration
          </a>
        </div>
      </section>
    </div>
  );
};

export default MusicClient;
