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
import { Icons } from '../common/Icons';

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
                        <Icons.VideoNotFound className="w-10 h-10 text-[var(--text-muted)]" />
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
                                    <Icons.Calendar className="w-4 h-4" />
                                    {publishedDate}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Icons.User className="w-4 h-4" />
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
                                    <Icons.Watch className="w-5 h-5" />
                                    <span>Watch on YouTube</span>
                                </a>

                                <button
                                    onClick={handleShare}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <Icons.Share className="w-5 h-5" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        {video.description && (
                            <div className="card-elevated rounded-2xl p-6 mb-6">
                                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                    <Icons.Description className="w-5 h-5 text-[var(--accent-primary)]" />
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
                                    <Icons.BrowseAll className="w-4 h-4" />
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
