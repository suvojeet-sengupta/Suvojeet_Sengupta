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
    const { formState, submitForm, resetForm } = useContactForm();
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

    const handleReset = () => {
        resetForm();
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
        setType(initialType);
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
    };

    const typeIcons: Record<InquiryType, React.ReactNode> = {
        GENERAL: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        ),
        SONG: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
        ),
        PROJECT: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        ROM: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        )
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
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {/* Type Selector */}
                        {!projectName && (
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Choose Inquiry Type</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {(['GENERAL', 'SONG', 'PROJECT', 'ROM'] as InquiryType[]).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setType(t)}
                                            className={`flex items-center justify-center gap-2 px-3 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 rounded-md ${
                                                type === t 
                                                ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20 scale-[1.02]' 
                                                : 'bg-tertiary/40 border-light hover:border-brand-orange/50 hover:bg-tertiary/60'
                                            }`}
                                        >
                                            {typeIcons[t]}
                                            <span>{t}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="group space-y-1.5">
                                <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-focus-within:text-brand-orange transition-colors">Name</label>
                                <input 
                                    type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                                    className="w-full bg-tertiary/50 border border-light p-3.5 focus:border-brand-orange focus:bg-tertiary outline-none transition-all rounded-lg text-sm placeholder:text-muted-foreground/30"
                                    placeholder="Suvojeet"
                                />
                            </div>
                            <div className="group space-y-1.5">
                                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-focus-within:text-brand-orange transition-colors">Email</label>
                                <input 
                                    type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                                    className="w-full bg-tertiary/50 border border-light p-3.5 focus:border-brand-orange focus:bg-tertiary outline-none transition-all rounded-lg text-sm placeholder:text-muted-foreground/30"
                                    placeholder="suvojeet@example.com"
                                />
                            </div>
                        </div>

                        {/* Dynamic Fields */}
                        <AnimatePresence mode="popLayout">
                            {type === 'SONG' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid md:grid-cols-2 gap-5"
                                >
                                    <div className="group space-y-1.5">
                                        <label htmlFor="songName" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-focus-within:text-brand-orange transition-colors">Song Name</label>
                                        <input type="text" id="songName" name="songName" required value={formData.songName} onChange={handleChange} className="w-full bg-tertiary/50 border border-light p-3.5 focus:border-brand-orange focus:bg-tertiary outline-none rounded-lg text-sm placeholder:text-muted-foreground/30" placeholder="e.g., Tum Hi Ho" />
                                    </div>
                                    <div className="group space-y-1.5">
                                        <label htmlFor="artistName" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-focus-within:text-brand-orange transition-colors">Original Artist</label>
                                        <input type="text" id="artistName" name="artistName" required value={formData.artistName} onChange={handleChange} className="w-full bg-tertiary/50 border border-light p-3.5 focus:border-brand-orange focus:bg-tertiary outline-none rounded-lg text-sm placeholder:text-muted-foreground/30" placeholder="e.g., Arijit Singh" />
                                    </div>
                                </motion.div>
                            )}

                            {type === 'PROJECT' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid md:grid-cols-2 gap-5"
                                >
                                    <div className="space-y-1.5">
                                        <label htmlFor="projectName" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Project</label>
                                        <input type="text" value={projectName || 'New Collaboration'} readOnly className="w-full bg-background/40 border border-light/50 p-3.5 opacity-60 rounded-lg text-sm outline-none cursor-not-allowed" />
                                    </div>
                                    <div className="group space-y-1.5">
                                        <label htmlFor="interest" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-focus-within:text-brand-orange transition-colors">Interest</label>
                                        <div className="relative">
                                            <select name="interest" value={formData.interest} onChange={handleChange} className="w-full bg-tertiary/50 border border-light p-3.5 focus:border-brand-orange focus:bg-tertiary outline-none rounded-lg text-sm appearance-none cursor-pointer">
                                                <option value="General">General Inquiry</option>
                                                <option value="Bug Report">Bug Report</option>
                                                <option value="Feature Request">Feature Request</option>
                                                <option value="Collaboration">Collaboration</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/40">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {type === 'ROM' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-1.5"
                                >
                                    <label htmlFor="deviceName" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Device / ROM</label>
                                    <input type="text" id="deviceName" name="deviceName" value={formData.deviceName} readOnly className="w-full bg-background/40 border border-light/50 p-3.5 opacity-60 rounded-lg text-sm cursor-not-allowed" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="group space-y-1.5">
                            <label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-focus-within:text-brand-orange transition-colors">
                                {type === 'SONG' ? 'Dedication or Memory' : 'Message'}
                            </label>
                            <textarea 
                                id="message" name="message" rows={4} required value={formData.message} onChange={handleChange}
                                className="w-full bg-tertiary/50 border border-light p-3.5 focus:border-brand-orange focus:bg-tertiary outline-none transition-all rounded-lg text-sm resize-none placeholder:text-muted-foreground/30"
                                placeholder={type === 'SONG' ? "Why this song? Who is it for?" : "How can I help you?"}
                            ></textarea>
                        </div>
                        
                        <button 
                            type="submit" 
                            className={`group relative overflow-hidden btn-solid w-full text-sm font-black tracking-[0.2em] py-5 rounded-lg transition-all active:scale-[0.98] ${formState.status === 'submitting' ? 'opacity-80 cursor-wait' : ''}`}
                            disabled={formState.status === 'submitting'}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {formState.status === 'submitting' ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>PROCESSING...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>SEND {type} MESSAGE</span>
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                        
                        {formState.status === 'error' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-center gap-2 text-red-500 font-bold uppercase tracking-widest text-[10px] mt-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formState.message}
                            </motion.div>
                        )}
                    </motion.form>
                ) : (
                    <motion.div 
                        key="success" 
                        className="flex flex-col items-center justify-center text-center py-12 px-4 bg-tertiary/20 border border-brand-orange/20 rounded-2xl" 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="relative mb-8">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                                className="w-20 h-20 rounded-full bg-brand-orange flex items-center justify-center text-white shadow-xl shadow-brand-orange/30"
                            >
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <motion.path 
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="3" 
                                        d="M5 13l4 4L19 7" 
                                    />
                                </svg>
                            </motion.div>
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0, 0]
                                }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                                className="absolute inset-0 rounded-full bg-brand-orange/50 -z-10"
                            />
                        </div>
                        
                        <h3 className="text-3xl font-black mb-3 uppercase tracking-tighter">Sent Successfully!</h3>
                        <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
                            {formState.message}
                        </p>
                        
                        <button 
                            onClick={handleReset} 
                            className="mt-10 flex items-center gap-2 px-6 py-3 bg-tertiary border border-light hover:border-brand-orange/50 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:shadow-lg active:scale-95"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Send another message
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModularContactForm;
