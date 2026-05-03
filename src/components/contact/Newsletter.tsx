"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '@/config';

interface NewsletterStatus {
  type: 'success' | 'error';
  message: string;
}

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<NewsletterStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(config.formSubmitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          _subject: "New Newsletter Subscription!",
          _captcha: "false"
        })
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Welcome to the inner circle!' });
        setEmail('');
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus({ type: 'error', message: 'Submission failed. Try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-brand-orange/5 blur-[100px] rounded-full -z-10" />

      <div className="section-container">
        <motion.div
          className="max-w-4xl mx-auto professional-card p-8 sm:p-12 md:p-16 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--neon) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          <div className="relative z-10">
            <motion.div
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-8 bg-[color:var(--neon)]/10 border border-[color:var(--neon)]/30 flex items-center justify-center text-[color:var(--neon)]"
              whileHover={{ y: -2 }}
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.div>

            <div className="v-section-num">06 / Newsletter</div>
            <h2 className="font-serif font-light text-[clamp(36px,6vw,72px)] mb-6 leading-[0.95] tracking-tight">
              Stay <em className="not-italic font-black italic text-[color:var(--neon)]">Connected</em>
            </h2>
            <p className="text-base sm:text-lg text-[color:var(--text-secondary)] opacity-80 mb-10 max-w-lg mx-auto leading-relaxed">
              Get the latest music releases, technical insights, and exclusive updates straight to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
              <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-[color:var(--bg-tertiary)] border border-[color:var(--line-strong)] focus-within:border-[color:var(--neon)] transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-sm font-serif placeholder:text-[color:var(--text-muted)]/60"
                  required
                />
                <motion.button
                  type="submit"
                  className="bg-[color:var(--neon)] hover:bg-[color:var(--ember)] text-[color:var(--ink)] px-6 sm:px-8 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Sending...' : 'Subscribe'}
                </motion.button>
              </div>

              <AnimatePresence>
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute -bottom-10 left-0 right-0 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] ${
                      status.type === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${status.type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <p className="mt-14 font-mono text-[10px] text-[color:var(--text-muted)] uppercase tracking-[0.3em]">
              Zero Spam · One-Click Unsubscribe
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
