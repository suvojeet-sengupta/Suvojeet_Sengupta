"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentFormProps {
    onSubmit: (name: string, email: string, content: string) => Promise<boolean>;
    status: 'idle' | 'submitting' | 'success' | 'error';
    message: string;
    postId: number;
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await onSubmit(name, email, content);
        if (success) {
            setName('');
            setEmail('');
            setContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${isReply ? 'mt-3 p-4 bg-background border border-light rounded-sm' : 'mt-6'}`}>
            <div className="grid md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-light rounded-sm px-4 py-3 bg-background focus:border-brand-orange outline-none transition-colors text-sm"
                />
                {!isReply && (
                    <input
                        type="email"
                        placeholder="Your email (optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-light rounded-sm px-4 py-3 bg-background focus:border-brand-orange outline-none transition-colors text-sm"
                    />
                )}
            </div>
            <textarea
                placeholder={placeholder}
                required
                rows={isReply ? 3 : 4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-light rounded-sm px-4 py-3 bg-background focus:border-brand-orange outline-none transition-colors text-sm resize-none"
            />
            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="bg-brand-orange hover:bg-orange-700 disabled:opacity-60 text-white px-6 py-3 rounded-sm font-bold uppercase tracking-wider text-xs transition-colors"
                >
                    {status === 'submitting' ? 'Posting...' : isReply ? 'Post Reply' : 'Post Comment'}
                </button>
                
                <AnimatePresence>
                    {message && (
                        <motion.p 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className={`text-xs font-bold uppercase tracking-widest ${status === 'error' ? 'text-red-500' : 'text-green-600'}`}
                        >
                            {message}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
};
