"use client";

import React, { useState } from 'react';
import type { BlogComment } from '@/types/blog';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { useCommentsApi } from '../../api/useCommentsApi';

interface CommentListProps {
    initialComments: BlogComment[];
    initialCount: number;
    postId: number;
    slug: string;
    commentsEnabled: boolean;
}

export const CommentList: React.FC<CommentListProps> = ({ 
    initialComments, 
    initialCount, 
    postId,
    slug,
    commentsEnabled 
}) => {
    const { 
        comments, 
        count, 
        isPosting, 
        error, 
        postComment,
        postReply
    } = useCommentsApi(slug, { comments: initialComments, count: initialCount });

    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

    const sortedComments = [...comments].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return (
        <section>
            <div className="flex flex-wrap items-baseline justify-between gap-4 pb-5 border-b border-[color:var(--line-strong)]">
                <h2 className="text-[28px]">
                    {count} {count === 1 ? 'comment' : 'comments'}
                </h2>

                {comments.length > 0 && (
                    <label className="flex items-center gap-2 text-[14px] text-[color:var(--text-tertiary)]">
                        Sort
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-transparent border border-[color:var(--line-strong)] rounded-full px-3 py-1 text-[14px] text-[color:var(--text-primary)] outline-none cursor-pointer"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </label>
                )}
            </div>

            {!commentsEnabled && (
                <p className="py-6 text-[15px] text-[color:var(--text-tertiary)]">
                    Comments are turned off for this post.
                </p>
            )}

            {commentsEnabled && (
                <div className="mb-6">
                    <CommentForm 
                        onSubmit={async (name, email, content) => {
                            try {
                                await postComment({ author: name, email, content, postSlug: slug });
                                return true;
                            } catch (e) {
                                return false;
                            }
                        }} 
                        status={isPosting ? 'submitting' : 'idle'} 
                        message={error instanceof Error ? error.message : ''} 
                        postId={postId}
                    />
                </div>
            )}

            <div>
                {sortedComments.map((comment) => (
                    <CommentItem 
                        key={comment.id} 
                        comment={comment} 
                        onReply={async (commentId, name, content) => {
                            try {
                                await postReply({ commentId, author: name, content });
                                return true;
                            } catch (e) {
                                return false;
                            }
                        }} 
                    />
                ))}
                
                {sortedComments.length === 0 && (
                    <p className="py-8 text-[15px] text-[color:var(--text-tertiary)]">
                        No comments yet.
                    </p>
                )}
            </div>
        </section>
    );
};
