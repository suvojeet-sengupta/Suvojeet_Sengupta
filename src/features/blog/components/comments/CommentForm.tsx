"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEYS = {
    NAME: 'comment_author_name',
    EMAIL: 'comment_author_email'
};

interface CommentFormProps {
    onSubmit: (name: string, email: string, content: string) => Promise<boolean>;
    status: 'idle' | 'submitting' | 'success' | 'error';
    message: string;
    postId?: number;
    placeholder?: string;
    isReply?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({ 
    onSubmit, 
    status, 
    message, 
    placeholder = "Write your comment...",
    isReply = false 
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');

    // Load from localStorage on mount
    useEffect(() => {
        const savedName = localStorage.getItem(STORAGE_KEYS.NAME);
        const savedEmail = localStorage.getItem(STORAGE_KEYS.EMAIL);
        if (savedName) setName(savedName);
        if (savedEmail) setEmail(savedEmail);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await onSubmit(name, email, content);
        if (success) {
            // Save to localStorage for future use
            localStorage.setItem(STORAGE_KEYS.NAME, name);
            localStorage.setItem(STORAGE_KEYS.EMAIL, email);
            
            // Clear only the content, keep name and email
            setContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${isReply ? 'mt-4 pl-4 border-l border-[color:var(--line-strong)]' : 'mt-6'}`}>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    {!isReply && <label className="v-label">Name</label>}
                    <input
                        type="text"
                        placeholder="Your name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="v-input"
                    />
                </div>
                {!isReply && (
                    <div className="space-y-1">
                        <label className="v-label">Email (optional, never shown)</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="v-input"
                        />
                    </div>
                )}
            </div>
            <div className="space-y-1">
                {!isReply && <label className="v-label">Comment</label>}
                <textarea
                    placeholder={placeholder}
                    required
                    rows={isReply ? 3 : 4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="v-input resize-y"
                />
            </div>
            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className={`${isReply ? 'btn-outline' : 'btn-solid'} !py-2.5 !text-[14px] disabled:opacity-60`}
                >
                    {status === 'submitting' ? 'Posting…' : isReply ? 'Post reply' : 'Post comment'}
                </button>
                
                <AnimatePresence>
                    {message && (
                        <motion.p 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className={`text-[14px] ${status === 'error' ? 'text-[color:var(--danger)]' : 'text-[color:var(--ok)]'}`}
                        >
                            {message}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
};
