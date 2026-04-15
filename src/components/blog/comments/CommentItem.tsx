"use client";

import React, { useState } from 'react';
import type { BlogComment } from '@/types/blog';
import { formatDate } from '@/lib/utils';
import { CommentForm } from './CommentForm';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentItemProps {
    comment: BlogComment;
    onReply: (commentId: number, name: string, content: string) => Promise<boolean>;
    isApprovedOnly?: boolean;
}

const Avatar = ({ name }: { name: string }) => {
    const letter = name.charAt(0).toUpperCase();
    const colors = [
        'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
        'bg-pink-500', 'bg-orange-500', 'bg-indigo-500'
    ];
    const colorIndex = name.length % colors.length;
    
    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg ${colors[colorIndex]}`}>
            {letter}
        </div>
    );
};

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [isRepliesCollapsed, setIsRepliesCollapsed] = useState(false);
    const [replyStatus, setReplyStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [replyMessage, setReplyMessage] = useState('');

    const handleReplySubmit = async (name: string, email: string, content: string) => {
        setReplyStatus('submitting');
        const success = await onReply(comment.id, name, content);
        if (success) {
            setReplyStatus('success');
            setReplyMessage('Reply posted!');
            setTimeout(() => {
                setIsReplying(false);
                setReplyStatus('idle');
                setReplyMessage('');
            }, 2000);
            return true;
        } else {
            setReplyStatus('error');
            setReplyMessage('Failed to reply.');
            return false;
        }
    };

    return (
        <div className="group border border-light rounded-sm p-6 bg-tertiary shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4">
                <Avatar name={comment.name} />
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-black text-primary uppercase tracking-tighter text-sm">{comment.name}</span>
                        <span className="text-muted text-xs uppercase tracking-widest font-bold" suppressHydrationWarning>
                            {formatDate(comment.createdAt)}
                        </span>
                        {!comment.isApproved && (
                            <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-sm">
                                Pending Approval
                            </span>
                        )}
                    </div>
                    <p className="mt-3 text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                    </p>
                    
                    <div className="mt-4 flex items-center gap-4">
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-brand-orange text-[10px] font-black uppercase tracking-widest hover:underline"
                        >
                            {isReplying ? 'Cancel' : 'Reply'}
                        </button>
                        
                        {comment.replies.length > 0 && (
                            <button
                                onClick={() => setIsRepliesCollapsed(!isRepliesCollapsed)}
                                className="text-muted text-[10px] font-black uppercase tracking-widest hover:text-primary"
                            >
                                {isRepliesCollapsed ? `Show ${comment.replies.length} Replies` : 'Hide Replies'}
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {isReplying && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <CommentForm 
                                    onSubmit={handleReplySubmit} 
                                    status={replyStatus} 
                                    message={replyMessage}
                                    postId={comment.blogId}
                                    isReply 
                                    placeholder={`Reply to ${comment.name}...`}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {!isRepliesCollapsed && comment.replies.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="mt-6 space-y-5"
                            >
                                {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-3 relative pl-4">
                                        {/* Thread line */}
                                        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-light" />
                                        
                                        <div className="w-8 h-8 flex-shrink-0">
                                            <Avatar name={reply.name} />
                                        </div>
                                        <div className="flex-1 min-w-0 bg-background/50 p-3 rounded-sm border border-light/50">
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                <span className="font-bold text-primary text-xs uppercase tracking-tight">{reply.name}</span>
                                                {reply.isOwner && (
                                                    <span className="text-[9px] font-black uppercase tracking-widest bg-brand-orange text-white px-2 py-0.5 rounded-sm flex items-center gap-1">
                                                        <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                                        Author
                                                    </span>
                                                )}
                                                <span className="text-muted text-[10px] uppercase font-medium" suppressHydrationWarning>
                                                    • {formatDate(reply.createdAt)}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-secondary text-xs leading-relaxed whitespace-pre-wrap">
                                                {reply.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
