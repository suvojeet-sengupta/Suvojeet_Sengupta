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
        <div className="py-6 border-b border-[color:var(--line)]">
            <div className="flex flex-wrap items-baseline gap-x-2 text-[14px]">
                <span className="text-[color:var(--text-primary)] font-medium">{comment.name}</span>
                <span className="text-[color:var(--text-muted)]" suppressHydrationWarning>· {formatDate(comment.createdAt)}</span>
                {!comment.isApproved && (
                    <span className="text-[12px] text-[color:var(--text-tertiary)] border border-[color:var(--line-strong)] rounded-full px-2 py-px">
                        Awaiting approval
                    </span>
                )}
            </div>
            
            <p className="mt-2 whitespace-pre-wrap text-[16px]">{comment.content}</p>
            
            <div className="mt-3 flex items-center gap-5 text-[14px]">
                <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors"
                >
                    {isReplying ? 'Cancel' : 'Reply'}
                </button>
                
                {comment.replies.length > 0 && (
                    <button
                        onClick={() => setIsRepliesCollapsed(!isRepliesCollapsed)}
                        className="text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors"
                    >
                        {isRepliesCollapsed ? `Show ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}` : 'Hide replies'}
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
                            <div key={reply.id} className="ml-1 border-l border-[color:var(--line-strong)] pl-4">
                                <div className="flex flex-wrap items-baseline gap-x-2 text-[14px]">
                                    <span className="text-[color:var(--text-primary)] font-medium">{reply.name}</span>
                                    {reply.isOwner && (
                                        <span className="text-[12px] text-[color:var(--text-secondary)] border border-[color:var(--line-strong)] rounded-full px-2 py-px">
                                            Author
                                        </span>
                                    )}
                                    <span className="text-[color:var(--text-muted)]" suppressHydrationWarning>· {formatDate(reply.createdAt)}</span>
                                </div>
                                <p className="mt-1.5 whitespace-pre-wrap text-[15px]">{reply.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
