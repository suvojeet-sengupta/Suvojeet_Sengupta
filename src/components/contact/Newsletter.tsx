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
        setStatus({ type: 'success', message: 'Thank you for subscribing!' });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-tertiary">
      <div className="section-container">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-8 rounded-sm bg-brand-orange flex items-center justify-center text-white">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Text */}
          <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Stay Connected</h2>
          <p className="text-secondary font-medium mb-10 max-w-md mx-auto">
            Subscribe for the latest music releases, technical articles, and creative updates.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-background border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-primary"
                required
              />
              <motion.button
                type="submit"
                className={uiStyles.btnSolid + " px-8 disabled:opacity-50"}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? '...' : 'SUBSCRIBE'}
              </motion.button>
            </div>
          </form>

          {/* Status Message */}
          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-6 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest ${status.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Privacy Note */}
          <p className="mt-8 text-xs text-muted uppercase tracking-widest font-bold">
            No spam. Ever.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
