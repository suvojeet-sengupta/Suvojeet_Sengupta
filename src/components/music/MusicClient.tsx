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
            The <span className="text-accent">Voice</span>
          </h1>
          <p className="text-xl text-secondary leading-relaxed mb-6 italic">
            "Sangeet mere liye saans lene jaisa hai." (Music is like breathing for me.)
          </p>
          <p className="text-xl text-secondary leading-relaxed mb-6">
            From the timeless melodies of Kishore Kumar and Lata Mangeshkar to the soulful modern hits of Arijit Singh, my journey is a tribute to the legends of Indian music. Whether in Hindi or Bengali, every song I sing is a piece of my heart.
          </p>
        </motion.div>
      </section>

      {/* Connection Section */}
      <section className="bg-tertiary py-24 mt-20">
        <div className="section-container">
          <h2 className="text-4xl font-bold mb-12">Connect with My Music</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="professional-card flex flex-col items-center text-center p-10">
              <div className="w-16 h-16 bg-brand-black text-white flex items-center justify-center rounded-sm mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">YouTube Channel</h3>
              <p className="text-secondary mb-6">Watch my latest covers, soulful renditions, and singing logs in Hindi and Bengali.</p>
              <a href="https://youtube.com/@suvojeetsengupta" target="_blank" className="btn-solid w-full">Subscribe Now</a>
            </div>
            <div className="professional-card flex flex-col items-center text-center p-10">
              <div className="w-16 h-16 bg-brand-orange text-white flex items-center justify-center rounded-sm mb-6">
                <span className="text-3xl">✉️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Request a Song</h3>
              <p className="text-secondary mb-6">Have a favorite Kishore Kumar or Arijit Singh track you'd like me to cover? Let's connect.</p>
              <a href="/request-song" className="btn-solid w-full">Make a Request</a>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-container py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="profile-frame">
            <div className="aspect-square bg-tertiary flex items-center justify-center text-6xl">🎙️</div>
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-6">Organic Practice</h2>
            <p className="text-lg text-secondary mb-8">
              I don't play instruments—I believe the human voice is the most powerful instrument of all. My practice is constant; I'm always humming, always singing. Even when I'm not in a studio, my voice is in training.
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
    </div>
  );
};

export default MusicClient;
