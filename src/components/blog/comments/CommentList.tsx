"use client";

import React, { useState } from 'react';
import type { BlogComment } from '@/types/blog';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { useComments } from '@/hooks/useComments';

interface CommentListProps {
    initialComments: BlogComment[];
    initialCount: number;
    postId: number;
    commentsEnabled: boolean;
}

export const CommentList: React.FC<CommentListProps> = ({ 
    initialComments, 
    initialCount, 
    postId,
    commentsEnabled 
}) => {
    const { 
        comments, 
        commentsCount, 
        postingStatus, 
        message, 
        submitComment, 
        submitReply 
    } = useComments(initialComments, initialCount, postId);

    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

    const sortedComments = [...comments].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return (
        <section className="mt-16 border-t border-light pt-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">
                        Discussion ({commentsCount})
                    </h2>
                    <p className="text-muted text-xs font-bold uppercase tracking-widest mt-1">
                        Share your thoughts on this post
                    </p>
                </div>

                {comments.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">Sort By:</span>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-tertiary border border-light rounded-sm px-2 py-1 text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-orange"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                )}
            </div>

            {!commentsEnabled && (
                <div className="bg-tertiary border border-light p-4 rounded-sm text-center mb-8">
                    <p className="text-muted text-xs font-bold uppercase tracking-widest">
                        Comments are currently disabled for this post.
                    </p>
                </div>
            )}

            {commentsEnabled && (
                <div className="mb-12">
                    <CommentForm 
                        onSubmit={submitComment} 
                        status={postingStatus} 
                        message={message} 
                        postId={postId}
                    />
                </div>
            )}

            <div className="space-y-8">
                {sortedComments.map((comment) => (
                    <CommentItem 
                        key={comment.id} 
                        comment={comment} 
                        onReply={submitReply} 
                    />
                ))}
                
                {sortedComments.length === 0 && (
                    <div className="text-center py-12 bg-tertiary border border-dashed border-light rounded-sm">
                        <p className="text-muted text-sm font-medium">
                            No comments yet. Be the first to start the conversation!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};
