"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import uiStyles from '@/components/common/UI.module.css';
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
          className="max-w-4xl mx-auto bg-tertiary/40 border border-light/50 backdrop-blur-md p-8 md:p-16 rounded-[2rem] text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Subtle pattern background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--accent-primary) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          <div className="relative z-10">
            {/* Icon */}
            <motion.div 
              className="w-20 h-20 mx-auto mb-10 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.div>

            {/* Text */}
            <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-none">Stay <span className="text-brand-orange">Connected</span></h2>
            <p className="text-lg text-muted-foreground font-medium mb-12 max-w-lg mx-auto leading-relaxed">
              Get the latest music releases, technical insights, and exclusive updates delivered straight to your inbox.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto relative group">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-background/50 border border-light focus-within:border-brand-orange/50 transition-all rounded-2xl">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-sm font-medium"
                  required
                />
                <motion.button
                  type="submit"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'SENDING...' : 'JOIN NOW'}
                </motion.button>
              </div>

              {/* Status Message */}
              <AnimatePresence>
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute -bottom-10 left-0 right-0 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                      status.type === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${status.type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Privacy Note */}
            <p className="mt-16 text-[10px] text-muted-foreground/40 uppercase tracking-[0.3em] font-black">
              Zero Spam • One-Click Unsubscribe
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
