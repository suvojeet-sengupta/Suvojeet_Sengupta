"use client";

import React from 'react';
import SocialLinks from '../contact/SocialLinks';
import suvojeet from '@/assets/suvojeet.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import useBlogPosts from '@/hooks/useBlogPosts';
import BlogPostCard from '../blog/BlogPostCard';
import videos from '@/data/videos.json';
import VideoCard from '../video/VideoCard';
import Button from '../common/Button';
import useContactForm from '@/hooks/useContactForm';
import SkeletonCard from '../common/SkeletonCard';

/**
 * The Home page component.
 * This component is the main landing page of the website.
 * It includes:
 * - A hero section with a background image and call-to-action.
 * - A music showcase section with embedded YouTube videos.
 * - A latest blog posts section.
 * - A contact form that submits to formsubmit.co.
 */
const HomePage = () => {
    const { formState, submitForm } = useContactForm();
    const { posts, loading, error } = useBlogPosts();

    /**
     * Handles the form submission for the contact form.
     * @param {React.FormEvent} e - The form event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        const success = await submitForm(data);
        if (success) {
            form.reset();
        }
    };

    // Animation variants for Framer Motion.
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const formContainerVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: 'auto', transition: { duration: 0.5, ease: 'easeOut' } },
        exit: { opacity: 0, height: 0, transition: { duration: 0.5, ease: 'easeIn' } },
    };

    return (
        <div className="bg-dark text-white">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-cover bg-top"
                    style={{ backgroundImage: `url(${suvojeet.src})` }}
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.1, transition: { duration: 10, ease: "easeOut" } }}
                    role="img"
                    aria-label="Suvojeet Sengupta performing"
                ></motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-dark"></div>
                <motion.div
                    className="relative z-10 w-full p-4 flex flex-col items-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-bold font-montserrat mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-lg tracking-tight">
                        Suvojeet Sengupta
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-xl md:text-3xl font-poppins mb-10 text-gray-300 tracking-wide font-light">
                        Singer <span className="text-primary mx-2">•</span> Performer <span className="text-primary mx-2">•</span> Composer
                    </motion.p>
                    <motion.div variants={itemVariants}>
                        <Button to="/music" primary className="animate-pulse shadow-primary/50">
                            Listen Now
                        </Button>
                    </motion.div>
                </motion.div>
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
                    <SocialLinks />
                </div>
            </section>

            {/* Music Showcase Section */}
            <motion.section
                id="music"
                className="py-24 bg-dark-2 relative overflow-hidden"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-center mb-16 text-4xl font-bold font-montserrat">
                        <span className="border-b-4 border-primary pb-2">Music Showcase</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.slice(0, 3).map(video => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                    <div className="mt-16 text-center">
                        <Button to="/music">View More</Button>
                    </div>
                </div>
            </motion.section>

            {/* Latest Blog Posts Section */}
            <motion.section
                id="blog"
                className="py-24 bg-dark relative"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-center mb-16 text-4xl font-bold font-montserrat">
                        <span className="border-b-4 border-primary pb-2">Latest From The Blog</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            // Show Skeleton Cards while loading
                            Array.from({ length: 3 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : !error && posts.length > 0 ? (
                            posts.slice(0, 3).map(post => (
                                <BlogPostCard key={post.sys.id} post={post} />
                            ))
                        ) : (
                            // Fallback if no posts or error (optional: add error UI)
                            <p className="text-center col-span-full text-grey">No posts found.</p>
                        )}
                    </div>
                    <div className="mt-16 text-center">
                        <Button to="/blog">View All Posts</Button>
                    </div>
                </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
                id="contact"
                className="py-24 bg-dark-2 relative overflow-hidden"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-center mb-16 text-4xl font-bold font-montserrat">
                        <span className="border-b-4 border-primary pb-2">Get in Touch</span>
                    </h2>
                    <div className="max-w-3xl mx-auto glass-panel p-10 rounded-2xl shadow-2xl">
                        <AnimatePresence>
                            {formState.status !== 'success' ? (
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    className="space-y-8"
                                    variants={formContainerVariants}
                                    initial="visible"
                                    exit="exit"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label htmlFor="name" className="block mb-2 font-semibold text-gray-300">Name</label>
                                            <input type="text" name="name" id="name" className="w-full px-4 py-3 bg-dark/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 hover:bg-dark/70" placeholder="Your Name" required />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block mb-2 font-semibold text-gray-300">Email</label>
                                            <input type="email" name="email" id="email" className="w-full px-4 py-3 bg-dark/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 hover:bg-dark/70" placeholder="your@email.com" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block mb-2 font-semibold text-gray-300">Message</label>
                                        <textarea name="message" id="message" rows="5" className="w-full px-4 py-3 bg-dark/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 hover:bg-dark/70" placeholder="How can I help you?" required></textarea>
                                    </div>
                                    <Button type="submit" primary className="w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center py-4 text-lg" disabled={formState.status === 'submitting'}>
                                        {formState.status === 'submitting' ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </Button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success-message"
                                    className="text-center py-10"
                                    variants={formContainerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5, type: 'spring', stiffness: 150 }}
                                    >
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-4">Message Sent!</h3>
                                        <p className="text-gray-300 text-lg">{formState.message}</p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {formState.status === 'error' && (
                            <div className="mt-6 text-center p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">{formState.message}</div>
                        )}
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default HomePage;
