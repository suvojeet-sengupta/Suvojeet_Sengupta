'use client';

import React from 'react';
import { motion } from 'framer-motion';

const MusicClient = () => {
  return (
    <div className="pt-32 pb-20">
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-8">
            The <span className="text-accent">Sound</span>
          </h1>
          <p className="text-xl text-secondary leading-relaxed mb-6">
            Music is my first language. From humming Kishore Kumar classics to producing modern vibes, it's how I express what code cannot.
          </p>
        </motion.div>
      </section>

      {/* Featured Tracks/Platforms */}
      <section className="bg-tertiary py-24 mt-20">
        <div className="section-container">
          <h2 className="text-4xl font-bold mb-12">Listen Anywhere</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="professional-card flex flex-col items-center text-center p-10">
              <div className="w-16 h-16 bg-brand-orange text-white flex items-center justify-center rounded-sm mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.907 14.907c-.146.146-.38.146-.526 0-2.997-2.997-7.632-2.997-10.629 0-.146.146-.38.146-.526 0-.146-.146-.146-.38 0-.526 3.287-3.287 8.394-3.287 11.681 0 .146.146.146.38 0 .526zM18 12c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Spotify</h3>
              <p className="text-secondary mb-6">Stream my latest tracks and covers on Spotify.</p>
              <a href="#" className="btn-solid w-full">Follow Me</a>
            </div>
            <div className="professional-card flex flex-col items-center text-center p-10">
              <div className="w-16 h-16 bg-brand-black text-white flex items-center justify-center rounded-sm mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">YouTube</h3>
              <p className="text-secondary mb-6">Watch music videos, live sessions and studio logs.</p>
              <a href="https://youtube.com/@suvojeetsengupta" target="_blank" className="btn-solid w-full">Subscribe</a>
            </div>
            <div className="professional-card flex flex-col items-center text-center p-10">
              <div className="w-16 h-16 bg-brand-orange text-white flex items-center justify-center rounded-sm mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1.2 13.2h-2.4v-4.8h2.4v4.8zm0-6h-2.4V7.2h2.4v2z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Apple Music</h3>
              <p className="text-secondary mb-6">Experience my music in high-fidelity audio.</p>
              <a href="#" className="btn-solid w-full">Listen Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-container py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="profile-frame">
            <div className="aspect-square bg-tertiary flex items-center justify-center text-6xl">🎵</div>
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-6">The Soul of Sound</h2>
            <p className="text-lg text-secondary mb-8">
              My music is inspired by the legends of Indian playback and the modern sounds of global pop. I believe music should be organic, felt in the heart, and technically perfect.
            </p>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-brand-orange bg-tertiary">
                <h4 className="font-bold uppercase tracking-widest text-xs text-muted mb-1">Vocal Style</h4>
                <p className="font-bold">Soulful, Versatile, Emotive</p>
              </div>
              <div className="p-4 border-l-4 border-brand-black bg-tertiary">
                <h4 className="font-bold uppercase tracking-widest text-xs text-muted mb-1">Instruments</h4>
                <p className="font-bold">Vocals, Keyboard, DAW Production</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MusicClient;
