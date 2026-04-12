'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useContactForm from '@/hooks/useContactForm';

export type InquiryType = 'GENERAL' | 'SONG' | 'PROJECT' | 'ROM';

interface ModularContactFormProps {
    initialType?: InquiryType;
    projectName?: string; // Optional: If coming from a specific project page
}

const ModularContactForm: React.FC<ModularContactFormProps> = ({ initialType = 'GENERAL', projectName }) => {
    const { formState, submitForm } = useContactForm();
    const [type, setType] = useState<InquiryType>(initialType);
    const [formData, setFormData] = useState<Record<string, string>>({
        name: '',
        email: '',
        message: '',
        // Song specific
        songName: '',
        artistName: '',
        dedication: '',
        // Project/ROM specific
        interest: 'General',
        deviceName: 'Redmi 12 5G / Poco M6 Pro 5G (sky)',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let subject = `[${type}] New Message from ${formData.name}`;
        if (type === 'SONG') subject = `🎵 Song Request: ${formData.songName} (${formData.name})`;
        if (type === 'PROJECT') subject = `🚀 Project Inquiry: ${projectName || 'General'} (${formData.name})`;
        if (type === 'ROM') subject = `📱 ROM Feedback: sky (${formData.name})`;

        const success = await submitForm({
            ...formData,
            inquiryType: type,
            _subject: subject,
            projectName: projectName || 'N/A'
        });
        
        if (success) {
            setFormData({
                name: '',
                email: '',
                message: '',
                songName: '',
                artistName: '',
                dedication: '',
                interest: 'General',
                deviceName: 'Redmi 12 5G / Poco M6 Pro 5G (sky)',
            });
        }
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {formState.status !== 'success' ? (
                    <motion.form 
                        key="form"
                        onSubmit={handleSubmit} 
                        className="space-y-6"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Type Selector - Hidden if coming from a specific project page to keep focus */}
                        {!projectName && (
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted">What are you looking for?</label>
                                <div className="flex flex-wrap gap-2">
                                    {(['GENERAL', 'SONG', 'PROJECT', 'ROM'] as InquiryType[]).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setType(t)}
                                            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${
                                                type === t 
                                                ? 'bg-brand-orange border-brand-orange text-white' 
                                                : 'border-light hover:border-brand-orange'
                                            }`}
                                        >
                                            {t.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted">Name</label>
                                <input 
                                    type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                                    className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-sm"
                                    placeholder="Suvojeet"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted">Email</label>
                                <input 
                                    type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                                    className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-sm"
                                    placeholder="suvojeet@example.com"
                                />
                            </div>
                        </div>

                        {/* Dynamic Fields for SONG */}
                        {type === 'SONG' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label htmlFor="songName" className="text-xs font-black uppercase tracking-widest text-muted">Song Name</label>
                                    <input type="text" id="songName" name="songName" required value={formData.songName} onChange={handleChange} className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none rounded-sm text-sm" placeholder="e.g., Tum Hi Ho" />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="artistName" className="text-xs font-black uppercase tracking-widest text-muted">Original Artist</label>
                                    <input type="text" id="artistName" name="artistName" required value={formData.artistName} onChange={handleChange} className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none rounded-sm text-sm" placeholder="e.g., Arijit Singh" />
                                </div>
                            </motion.div>
                        )}

                        {/* Dynamic Fields for PROJECT */}
                        {type === 'PROJECT' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label htmlFor="projectName" className="text-xs font-black uppercase tracking-widest text-muted">Project</label>
                                    <input type="text" value={projectName || 'New Collaboration'} readOnly className="w-full bg-background border border-light p-3 opacity-70 rounded-sm text-sm outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="interest" className="text-xs font-black uppercase tracking-widest text-muted">Interest</label>
                                    <select name="interest" value={formData.interest} onChange={handleChange} className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none rounded-sm text-sm appearance-none">
                                        <option value="General">General Inquiry</option>
                                        <option value="Bug Report">Bug Report</option>
                                        <option value="Feature Request">Feature Request</option>
                                        <option value="Collaboration">Collaboration</option>
                                    </select>
                                </div>
                            </motion.div>
                        )}

                        {/* Dynamic Fields for ROM */}
                        {type === 'ROM' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1">
                                <label htmlFor="deviceName" className="text-xs font-black uppercase tracking-widest text-muted">Device / ROM</label>
                                <input type="text" id="deviceName" name="deviceName" value={formData.deviceName} readOnly className="w-full bg-background border border-light p-3 opacity-70 rounded-sm text-sm" />
                            </motion.div>
                        )}

                        <div className="space-y-1">
                            <label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-muted">
                                {type === 'SONG' ? 'Dedication or Memory' : 'Message'}
                            </label>
                            <textarea 
                                id="message" name="message" rows={4} required value={formData.message} onChange={handleChange}
                                className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-sm resize-none"
                                placeholder={type === 'SONG' ? "Why this song? Who is it for?" : "How can I help you?"}
                            ></textarea>
                        </div>
                        
                        <button type="submit" className="btn-solid w-full text-lg py-4" disabled={formState.status === 'submitting'}>
                            {formState.status === 'submitting' ? 'SENDING...' : `SUBMIT ${type} INQUIRY`}
                        </button>
                    </motion.form>
                ) : (
                    <motion.div key="success" className="text-center py-10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="w-16 h-16 mx-auto mb-6 rounded-sm bg-brand-orange flex items-center justify-center text-white">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Received!</h3>
                        <p className="text-secondary font-medium">{formState.message}</p>
                        <button onClick={() => setType('GENERAL')} className="mt-8 text-brand-orange font-bold uppercase tracking-widest text-xs border-b border-brand-orange">
                            Send another message
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModularContactForm;
