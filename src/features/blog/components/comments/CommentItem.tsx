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
        <div className="border border-light rounded-sm p-5 bg-tertiary">
            <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-bold">{comment.name}</span>
                <span className="text-muted" suppressHydrationWarning>• {formatDate(comment.createdAt)}</span>
                {!comment.isApproved && (
                    <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-sm">
                        Pending
                    </span>
                )}
            </div>
            
            <p className="mt-3 whitespace-pre-wrap text-secondary">{comment.content}</p>
            
            <div className="mt-4 flex items-center gap-4">
                <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-brand-orange text-sm font-bold uppercase tracking-wider"
                >
                    {isReplying ? 'Cancel' : 'Reply'}
                </button>
                
                {comment.replies.length > 0 && (
                    <button
                        onClick={() => setIsRepliesCollapsed(!isRepliesCollapsed)}
                        className="text-muted text-[10px] font-black uppercase tracking-widest"
                    >
                        {isRepliesCollapsed ? `View ${comment.replies.length} replies` : 'Hide replies'}
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isReplying && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
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
                    <div className="mt-4 space-y-4">
                        {comment.replies.map((reply) => (
                            <div key={reply.id} className="ml-4 border-l-2 border-light pl-4">
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                    <span className="font-bold">{reply.name}</span>
                                    {reply.isOwner && (
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 px-2 py-0.5 rounded-sm">
                                            Author
                                        </span>
                                    )}
                                    <span className="text-muted" suppressHydrationWarning>• {formatDate(reply.createdAt)}</span>
                                </div>
                                <p className="mt-2 whitespace-pre-wrap text-secondary text-sm">{reply.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
