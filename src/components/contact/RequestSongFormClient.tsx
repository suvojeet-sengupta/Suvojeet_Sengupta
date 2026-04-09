'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useContactForm from '@/hooks/useContactForm';

const RequestSongFormClient = () => {
  const { formState, submitForm } = useContactForm();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    songName: '',
    artistName: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitForm({
      ...formData,
      _subject: `New Song Request: ${formData.songName} by ${formData.artistName}`
    });
    
    if (success) {
      setFormData({
        name: '',
        email: '',
        songName: '',
        artistName: '',
        message: ''
      });
    }
  };

  return (
    <div className="professional-card">
      <AnimatePresence mode="wait">
        {formState.status !== 'success' ? (
          <motion.form 
            key="form"
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-muted">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-primary"
                  placeholder="Suvojeet"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-muted">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-primary"
                  placeholder="suvojeet@example.com"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="songName" className="text-sm font-bold uppercase tracking-widest text-muted">Song Name</label>
                <input 
                  type="text" 
                  id="songName" 
                  name="songName" 
                  required 
                  value={formData.songName}
                  onChange={handleChange}
                  className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-primary"
                  placeholder="Tum Hi Ho"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="artistName" className="text-sm font-bold uppercase tracking-widest text-muted">Artist Name</label>
                <input 
                  type="text" 
                  id="artistName" 
                  name="artistName" 
                  required 
                  value={formData.artistName}
                  onChange={handleChange}
                  className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-primary"
                  placeholder="Arijit Singh"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-bold uppercase tracking-widest text-muted">Message (Optional)</label>
              <textarea 
                id="message" 
                name="message" 
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-primary resize-none"
                placeholder="Can you sing it in your unique soulful style?"
              ></textarea>
            </div>
            
            {formState.status === 'error' && (
              <p className="text-red-500 font-medium text-sm">{formState.message}</p>
            )}

            <button 
              type="submit" 
              className="btn-solid w-full text-lg py-4"
              disabled={formState.status === 'submitting'}
            >
              {formState.status === 'submitting' ? 'SENDING...' : 'SUBMIT REQUEST'}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            className="text-center py-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-sm bg-brand-orange flex items-center justify-center text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Request Sent!</h3>
            <p className="text-secondary font-medium">{formState.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestSongFormClient;
