"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import VideoCard from '../video/VideoCard';
import useVideos from '@/hooks/useVideos';
import SkeletonCard from '../common/SkeletonCard';
import { socket } from '@/services/socket';
import LiveIndicator from '../common/LiveIndicator';

const MusicClient = () => {
    const { videos, loading, error } = useVideos();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewerCount, setViewerCount] = useState(0);
    const videosPerPage = 9;

    useEffect(() => {
        const room = 'music';
        socket.emit('join_room', { room });

        socket.on('update_viewer_count', (data) => {
            setViewerCount(data.count);
        });

        return () => {
            socket.emit('leave_room', { room });
            socket.off('update_viewer_count');
        };
    }, []);

    useEffect(() => {
        if (!loading) {
            const scrollPos = sessionStorage.getItem('musicScrollPos');
            if (scrollPos) {
                window.scrollTo(0, parseInt(scrollPos, 10));
                sessionStorage.removeItem('musicScrollPos');
            }
        }
    }, [loading]);

    const categories = useMemo(() => ['All', ...new Set(videos.map(video => video.category).filter(Boolean))], [videos]);

    const filteredVideos = useMemo(() => {
        const sortedVideos = [...videos].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        const filteredByCategory = selectedCategory === 'All'
            ? sortedVideos
            : sortedVideos.filter(video => video.category === selectedCategory);
        return filteredByCategory.filter(video =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [videos, selectedCategory, searchQuery]);

    const latestVideo = useMemo(() =>
        selectedCategory === 'All' && filteredVideos.length > 0 ? filteredVideos[0] : null
        , [filteredVideos, selectedCategory]);

    const videosToPaginate = useMemo(() =>
        latestVideo ? filteredVideos.slice(1) : filteredVideos
        , [filteredVideos, latestVideo]);

    const totalPages = useMemo(() =>
        Math.ceil(videosToPaginate.length / videosPerPage)
        , [videosToPaginate, videosPerPage]);

    const currentVideos = useMemo(() => {
        const indexOfLastVideo = currentPage * videosPerPage;
        const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
        return videosToPaginate.slice(indexOfFirstVideo, indexOfLastVideo);
    }, [videosToPaginate, currentPage, videosPerPage]);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen pt-20">
                <section className="relative overflow-hidden py-16 sm:py-24">
                    <div className="hero-gradient" />
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                            <span className="gradient-text">My Music</span>
                        </h1>
                        <p className="text-[var(--text-secondary)]">Loading your music...</p>
                    </div>
                </section>
                <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(videosPerPage)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                </main>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Error loading videos</h2>
                    <p className="text-[var(--text-secondary)]">Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 sm:py-24">
                <div className="hero-gradient" />
                <div className="blob-1 animate-blob" />
                <div className="blob-2 animate-blob animation-delay-200" />

                <motion.div
                    className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants}>
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 mb-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <svg className="w-4 h-4 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            <span className="text-sm font-medium text-[var(--accent-primary)]">YouTube Covers & Originals</span>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-montserrat mb-6">
                            <span className="text-[var(--text-primary)]">My </span>
                            <span className="gradient-text">Music</span>
                        </h1>

                        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
                            Explore the melodies and stories behind the songs. Each cover is crafted with passion and emotion.
                        </p>

                        {/* Live Indicator */}
                        {viewerCount > 0 && (
                            <div className="flex justify-center mb-8">
                                <LiveIndicator count={viewerCount} text={viewerCount === 1 ? 'person listening' : 'people listening'} />
                            </div>
                        )}
                    </motion.div>

                    {/* Search and Filters */}
                    <motion.div variants={itemVariants} className="max-w-4xl mx-auto space-y-6">
                        {/* Search Bar */}
                        <div className="relative max-w-xl mx-auto">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search for videos..."
                                className="input-modern pl-12"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${selectedCategory === category
                                            ? 'bg-[var(--accent-primary)] text-white shadow-lg'
                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/20 hover:text-[var(--accent-primary)]'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Request Song CTA */}
                        <div className="pt-4">
                            <Link href="/request-song" className="btn-primary inline-flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Request a Song
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Featured Latest Video */}
                {latestVideo && selectedCategory === 'All' && (
                    <motion.div
                        className="mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-gradient-to-b from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full" />
                            Latest Release
                        </h2>

                        <Link href={`/video/${latestVideo.id}`}>
                            <motion.div
                                className="card-elevated rounded-2xl overflow-hidden group cursor-pointer"
                                whileHover={{
                                    y: -8,
                                    boxShadow: "0 25px 50px rgba(99, 102, 241, 0.2)",
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video lg:aspect-auto">
                                        <img
                                            src={`https://i.ytimg.com/vi/${latestVideo.id}/maxresdefault.jpg`}
                                            alt={latestVideo.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent lg:bg-gradient-to-t" />

                                        {/* Play Button */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <motion.div
                                                className="w-20 h-20 rounded-full bg-[var(--accent-primary)] flex items-center justify-center shadow-2xl"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M8 5v10l8-5-8-5z" />
                                                </svg>
                                            </motion.div>
                                        </div>

                                        {/* NEW Badge */}
                                        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[var(--accent-primary)] text-white text-xs font-bold uppercase tracking-wider">
                                            Latest
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 lg:p-10 flex flex-col justify-center">
                                        <h3 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-[var(--accent-primary)] transition-colors">
                                            {latestVideo.title}
                                        </h3>
                                        <p className="text-[var(--text-muted)] text-sm mb-4 uppercase tracking-wider">
                                            {new Date(latestVideo.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <p className="text-[var(--text-secondary)] mb-6 line-clamp-3">
                                            {latestVideo.description || 'Watch now on YouTube'}
                                        </p>
                                        <div className="inline-flex items-center gap-2 text-[var(--accent-primary)] font-medium group-hover:gap-4 transition-all">
                                            <span>Watch Now</span>
                                            <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </motion.div>
                )}

                {/* Video Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {currentVideos.map((video) => (
                        <div key={video.id} onClick={() => sessionStorage.setItem('musicScrollPos', window.scrollY)}>
                            <VideoCard video={video} />
                        </div>
                    ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-16 gap-4">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => {
                                        setCurrentPage(page);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`w-10 h-10 rounded-lg font-medium transition-all ${page === currentPage
                                            ? 'bg-[var(--accent-primary)] text-white'
                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/20'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Next
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MusicClient;
