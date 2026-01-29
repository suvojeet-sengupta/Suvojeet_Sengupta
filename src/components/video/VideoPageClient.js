"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import videos from '@/data/videos.json';
import VideoPlayer from './VideoPlayer';
import Comments from './Comments';
import RelatedVideoCard from './RelatedVideoCard';
import Toast from '../common/Toast';
import { motion } from 'framer-motion';
import { socket } from '@/services/socket';
import EmojiReactionButton from '../common/EmojiReactionButton';
import FloatingEmoji from '../common/FloatingEmoji';
import LiveIndicator from '../common/LiveIndicator';
import Link from 'next/link';

const VideoPageClient = () => {
    const { id } = useParams();
    const video = videos.find(v => v.id === id);
    const room = `video-${id}`;

    const [relatedVideos, setRelatedVideos] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Real-time state
    const [viewerCount, setViewerCount] = useState(0);
    const [reactions, setReactions] = useState([]);

    useEffect(() => {
        if (video) {
            const related = videos
                .filter(v => v.id !== video.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
            setRelatedVideos(related);
        }

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
    }, [id, video, room]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const handleAnimationComplete = (reactionId) => {
        setReactions(prev => prev.filter(r => r.id !== reactionId));
    };

    if (!video) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                        <svg className="w-10 h-10 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Video not found</h2>
                    <p className="text-[var(--text-secondary)] mb-6">The video you're looking for doesn't exist.</p>
                    <Link href="/music" className="btn-primary">
                        Browse Music
                    </Link>
                </div>
            </div>
        );
    }

    const handleShare = () => {
        let url = window.location.href;

        if (url.includes('?')) {
            url += `&v=${Date.now()}`;
        } else {
            url += `?v=${Date.now()}`;
        }

        if (navigator.share) {
            navigator.share({
                title: video.title,
                url: url,
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        } else {
            navigator.clipboard.writeText(url);
            setToastMessage('Link Copied!');
            setShowToast(true);
        }
    };

    const publishedDate = new Date(video.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-24 pb-16"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-3 lg:gap-10">
                    {/* Left Column: Video Player and Details */}
                    <div className="lg:col-span-2 relative">
                        {/* Floating Emojis Container */}
                        <div className="absolute bottom-20 left-0 w-full h-64 pointer-events-none z-50">
                            {reactions.map(reaction => (
                                <FloatingEmoji
                                    key={reaction.id}
                                    emoji={reaction.emoji}
                                    onAnimationComplete={() => handleAnimationComplete(reaction.id)}
                                />
                            ))}
                        </div>

                        {/* Video Player */}
                        <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl">
                            <VideoPlayer videoId={video.id} />
                        </div>

                        {/* Video Info Header */}
                        <div className="card-elevated rounded-2xl p-6 mb-6">
                            {/* Title and Live Indicator */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
                                    {video.title}
                                </h1>
                                <div className="flex-shrink-0">
                                    <LiveIndicator count={viewerCount} text={viewerCount === 1 ? 'watching' : 'watching'} />
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] mb-6 pb-6 border-b border-[var(--border-subtle)]">
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {publishedDate}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Suvojeet Sengupta
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3">
                                <EmojiReactionButton room={room} />

                                <a
                                    href={`https://www.youtube.com/watch?v=${video.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/25"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                    <span>Watch on YouTube</span>
                                </a>

                                <button
                                    onClick={handleShare}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        {video.description && (
                            <div className="card-elevated rounded-2xl p-6 mb-6">
                                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                    Description
                                </h2>
                                <p className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                                    {video.description}
                                </p>
                            </div>
                        )}

                        <Comments comments={video.comments} />
                    </div>

                    {/* Right Column: Related Videos */}
                    <div className="lg:col-span-1 mt-10 lg:mt-0">
                        <div className="sticky top-24">
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-gradient-to-b from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full" />
                                Up Next
                            </h2>
                            <div className="space-y-3">
                                {relatedVideos.map(relatedVideo => (
                                    <RelatedVideoCard key={relatedVideo.id} video={relatedVideo} />
                                ))}
                            </div>

                            {/* Back to Music CTA */}
                            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
                                <Link
                                    href="/music"
                                    className="btn-secondary w-full flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Browse All Music
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toast message={toastMessage} show={showToast} />
        </motion.div>
    );
};

export default VideoPageClient;
