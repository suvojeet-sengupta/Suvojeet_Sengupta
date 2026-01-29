"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Link from 'next/link';

import useBlogPosts from '@/hooks/useBlogPosts';
import { socket } from '@/services/socket';
import EmojiReactionButton from '../common/EmojiReactionButton';
import FloatingEmoji from '../common/FloatingEmoji';
import LiveIndicator from '../common/LiveIndicator';

const BlogPostClient = () => {
    const { slug } = useParams();
    const { posts } = useBlogPosts();
    const [post, setPost] = useState(null);
    const [showCopied, setShowCopied] = useState(false);
    const [room, setRoom] = useState(null);

    const [viewerCount, setViewerCount] = useState(0);
    const [reactions, setReactions] = useState([]);

    useEffect(() => {
        if (posts.length > 0 && slug) {
            const currentPost = posts.find((p) => p.fields.slug === slug);
            setPost(currentPost);
            if (currentPost) {
                setRoom(`blog-${slug}`);
            }
        }
    }, [slug, posts]);

    useEffect(() => {
        if (!room) return;

        socket.emit('join_room', { room });

        socket.on('update_viewer_count', (data) => {
            setViewerCount(data.count);
        });

        socket.on('new_reaction', (data) => {
            const newReaction = {
                id: Date.now() + Math.random(),
                emoji: data.emoji,
            };
            setReactions(prev => [...prev, newReaction]);
        });

        return () => {
            socket.emit('leave_room', { room });
            socket.off('update_viewer_count');
            socket.off('new_reaction');
        };
    }, [room]);

    const handleAnimationComplete = (reactionId) => {
        setReactions(prev => prev.filter(r => r.id !== reactionId));
    };

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: post.fields.title,
                text: post.fields.excerpt,
                url: url,
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        } else {
            navigator.clipboard.writeText(url);
            setShowCopied(true);
            setTimeout(() => {
                setShowCopied(false);
            }, 2000);
        }
    };

    // Loading State
    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center animate-pulse">
                        <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <p className="text-[var(--text-secondary)]">Loading article...</p>
                </div>
            </div>
        );
    }

    const publishedDate = new Date(post.fields.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen relative pt-20">
            {/* Floating Emojis Container */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
                {reactions.map(reaction => (
                    <FloatingEmoji
                        key={reaction.id}
                        emoji={reaction.emoji}
                        onAnimationComplete={() => handleAnimationComplete(reaction.id)}
                    />
                ))}
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 sm:py-20">
                <div className="hero-gradient" />

                <motion.div
                    className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Back Link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors mb-8"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Blog
                    </Link>

                    {/* Tags */}
                    {post.fields.tags && post.fields.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {post.fields.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
                        {post.fields.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--text-muted)] mb-6">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {publishedDate}
                        </span>
                        {post.fields.author && (
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {post.fields.author}
                            </span>
                        )}
                        <LiveIndicator count={viewerCount} text={viewerCount === 1 ? 'reading' : 'reading'} />
                    </div>
                </motion.div>
            </section>

            {/* Article Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <motion.article
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Cover Image */}
                    {post.fields.coverImage?.fields?.file?.url && (
                        <div className="rounded-2xl overflow-hidden shadow-2xl mb-10">
                            <img
                                src={`https:${post.fields.coverImage.fields.file.url}`}
                                alt={post.fields.title}
                                className="w-full h-auto"
                            />
                        </div>
                    )}

                    {/* Article Body */}
                    <div className="card-elevated rounded-2xl p-8 sm:p-10 lg:p-12">
                        <div className="prose prose-lg prose-invert max-w-none">
                            {documentToReactComponents(post.fields.content)}
                        </div>

                        {/* Actions */}
                        <div className="mt-10 pt-8 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                {room && <EmojiReactionButton room={room} />}
                            </div>

                            <button
                                onClick={handleShare}
                                className="btn-primary flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share Article
                            </button>
                        </div>
                    </div>
                </motion.article>
            </main>

            {/* Copied Toast */}
            {showCopied && (
                <motion.div
                    className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20 }}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied to clipboard!
                </motion.div>
            )}
        </div>
    );
};

export default BlogPostClient;
