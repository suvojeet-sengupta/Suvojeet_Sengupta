'use client';

import React, { useState } from 'react';

const RequestSongFormClient = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your request! I will check it out.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm"
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
            className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm"
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
            className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm"
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
            className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm"
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
          className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm"
        ></textarea>
      </div>
      <button type="submit" className="btn-solid w-full text-lg py-4">
        SUBMIT REQUEST
      </button>
    </form>
  );
};

export default RequestSongFormClient;
