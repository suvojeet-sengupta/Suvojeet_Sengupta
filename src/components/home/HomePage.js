"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SocialLinks from '../contact/SocialLinks';
import useBlogPosts from '@/hooks/useBlogPosts';
import BlogPostCard from '../blog/BlogPostCard';
import videos from '@/data/videos.json';
import projects from '@/data/projects.json';
import VideoCard from '../video/VideoCard';
import Button from '../common/Button';
import useContactForm from '@/hooks/useContactForm';
import SkeletonCard from '../common/SkeletonCard';
import Link from 'next/link';

const suvojeet = '/suvojeet.jpg';

/**
 * Completely redesigned HomePage component
 * Dual identity: Singer + Android Vibe Coder
 */
const HomePage = () => {
    const { formState, submitForm } = useContactForm();
    const { posts, loading, error } = useBlogPosts();

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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    // Core competencies data
    const competencies = [
        {
            domain: 'System Architecture',
            focus: 'Scalability, Data Flow, Security, Performance',
            tech: 'MVVM, Clean Architecture, UML, Encryption'
        },
        {
            domain: 'Mobile Development',
            focus: 'Native & Cross-Platform Engineering',
            tech: 'Kotlin, Dart, Flutter, Android Jetpack'
        },
        {
            domain: 'AI Integration',
            focus: 'Workflow Augmentation, Code Generation',
            tech: 'Generative AI, Prompt Engineering'
        }
    ];

    // Engineering pipeline
    const pipeline = [
        {
            step: '01',
            title: 'Research & Validation',
            description: 'Deep analysis of official documentation, APIs, and technical specifications to establish optimal paths.',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            step: '02',
            title: 'Architectural Design',
            description: 'Create detailed blueprints using MVVM, Clean Architecture, and UML diagrams for scalable systems.',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            step: '03',
            title: 'AI Orchestration',
            description: 'Leverage AI for accelerated implementation with rigorous manual review and optimization.',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        }
    ];

    // Tech arsenal
    const techStack = {
        languages: ['Kotlin', 'Dart', 'JavaScript', 'Java', 'Python', 'TypeScript'],
        frameworks: ['Flutter', 'Android Jetpack', 'Next.js', 'Firebase', 'Compose'],
        tools: ['Android Studio', 'VS Code', 'Git', 'Figma', 'Postman']
    };

    // Language colors for project cards
    const languageColors = {
        'Kotlin': '#A97BFF',
        'Dart': '#00B4AB',
        'JavaScript': '#F7DF1E',
        'Java': '#ED8B00',
        'HTML': '#E34C26'
    };

    return (
        <div className="bg-[var(--bg-primary)]">
            {/* ========================================
                HERO SECTION
            ======================================== */}
            <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-16 pb-8 sm:pt-20 sm:pb-0">
                {/* Background Effects */}
                <div className="hero-gradient" />
                <div className="blob-1 animate-blob" />
                <div className="blob-2 animate-blob animation-delay-200" />
                <div className="blob-3 animate-blob animation-delay-400" />

                {/* Hero Content */}
                <motion.div
                    className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center safe-area-inset"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Profile Image */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <div className="profile-image-container mx-auto">
                            <img
                                src={suvojeet}
                                alt="Suvojeet Sengupta"
                                className="profile-image"
                            />
                        </div>
                    </motion.div>

                    {/* Name & Title */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-3xl sm:text-5xl md:text-7xl font-bold font-montserrat mb-3 sm:mb-4"
                    >
                        <span className="gradient-text">Suvojeet Sengupta</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl md:text-2xl font-medium text-[var(--text-secondary)] mb-2"
                    >
                        The Vibe Architect
                    </motion.p>

                    <motion.p
                        variants={itemVariants}
                        className="text-base sm:text-lg md:text-xl text-[var(--text-tertiary)] mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3 flex-wrap"
                    >
                        <span className="flex items-center gap-1.5 sm:gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-creative)]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                            Singer
                        </span>
                        <span className="text-[var(--accent-primary)]">•</span>
                        <span className="flex items-center gap-1.5 sm:gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-primary)]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.6 11.48L19.44 9.64a1.12 1.12 0 0 0 0-1.58 1.1 1.1 0 0 0-1.59 0L16 9.9V6.62a9.89 9.89 0 0 0-12.34.43c-4.09 3.53-4.52 9.72-.97 13.81a9.89 9.89 0 0 0 15.08.78c3.43-3.77 3.27-9.53-.35-12.96L17.6 11.48z" />
                            </svg>
                            Android Vibe Coder
                        </span>
                    </motion.p>

                    {/* Music Passion Tagline */}
                    <motion.p
                        variants={itemVariants}
                        className="text-sm sm:text-base text-[var(--text-muted)] mb-6 sm:mb-8 italic max-w-lg mx-auto"
                    >
                        "Singing since childhood • Inspired by <span className="text-[var(--accent-creative)] font-medium not-italic">Arijit Singh</span> • Music is not just a hobby, it's a part of my life"
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 w-full max-w-sm sm:max-w-none mx-auto"
                    >
                        <Link href="/music" className="btn-creative inline-flex items-center justify-center gap-2 w-full sm:w-auto">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Listen to Music
                        </Link>
                        <a
                            href="https://github.com/suvojeet-sengupta"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            View Projects
                        </a>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div variants={itemVariants}>
                        <SocialLinks className="justify-center" />
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator - hidden on very small screens */}
                <motion.div
                    className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-[var(--text-muted)]"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.div>
                </motion.div>
            </section>

            {/* ========================================
                PROFESSIONAL PROFILE SECTION
            ======================================== */}
            <motion.section
                className="py-16 sm:py-24 bg-[var(--bg-secondary)] relative overflow-hidden"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl md:text-4xl font-bold font-montserrat mb-6"
                        >
                            <span className="gradient-text">The Vibe Architect</span>
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8"
                        >
                            I am a <strong className="text-[var(--text-primary)]">Product-First Software Engineer</strong> and <strong className="text-[var(--text-primary)]">System Architect</strong> based in India,
                            specializing in the full-stack development lifecycle with a strong focus on mobile platforms (Android/Flutter).
                            My core mission is to translate complex, high-level product requirements into robust, scalable, and maintainable production code.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="card p-6 md:p-8 text-left"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">The "Vibe Coder" Methodology</h3>
                                    <p className="text-[var(--text-secondary)]">
                                        A development approach that prioritizes <em>deep, foundational understanding</em> and <em>architectural design</em> over
                                        rapid, unoptimized syntax generation. This allows me to function as a highly efficient, AI-augmented solo architect,
                                        delivering complex applications like <strong>SuvMusic</strong> and <strong>NoteNext</strong> with enterprise-grade precision.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* ========================================
                CORE COMPETENCIES SECTION
            ======================================== */}
            <motion.section
                className="py-16 sm:py-24 bg-[var(--bg-primary)]"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        variants={itemVariants}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat text-center mb-8 sm:mb-12"
                    >
                        Core <span className="gradient-text">Competencies</span>
                    </motion.h2>

                    {/* Mobile Cards View */}
                    <motion.div variants={itemVariants} className="md:hidden space-y-4">
                        {competencies.map((item, index) => (
                            <div key={index} className="card p-5">
                                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{item.domain}</h3>
                                <p className="text-sm text-[var(--text-secondary)] mb-3">{item.focus}</p>
                                <div className="flex flex-wrap gap-2">
                                    {item.tech.split(', ').map((tech, i) => (
                                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Desktop Table View */}
                    <motion.div variants={itemVariants} className="hidden md:block max-w-4xl mx-auto overflow-x-auto">
                        <table className="table-modern w-full">
                            <thead>
                                <tr>
                                    <th>Domain</th>
                                    <th>Focus Area</th>
                                    <th>Key Technologies</th>
                                </tr>
                            </thead>
                            <tbody>
                                {competencies.map((item, index) => (
                                    <tr key={index}>
                                        <td className="font-semibold text-[var(--text-primary)]">{item.domain}</td>
                                        <td>{item.focus}</td>
                                        <td>
                                            <span className="text-[var(--accent-primary)]">{item.tech}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </motion.section>

            {/* ========================================
                ENGINEERING PHILOSOPHY SECTION
            ======================================== */}
            <motion.section
                className="py-16 sm:py-24 bg-[var(--bg-secondary)] relative overflow-hidden"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div variants={itemVariants} className="text-center mb-10 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-3 sm:mb-4">
                            Logic-First <span className="gradient-text">Development</span>
                        </h2>
                        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto px-2">
                            A structured, three-stage pipeline designed for maximum efficiency and code quality.
                            Logic-First, Syntax-Second ensures every line of code serves a validated architectural purpose.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto">
                        {pipeline.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="step-card relative"
                            >
                                <div className="step-number">{item.step}</div>
                                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                    <span className="text-[var(--accent-primary)]">{item.icon}</span>
                                    <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">{item.title}</h3>
                                </div>
                                <p className="text-[var(--text-secondary)] text-xs sm:text-sm">{item.description}</p>
                                {index < pipeline.length - 1 && (
                                    <div className="step-connector hidden md:block" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ========================================
                TECHNICAL ARSENAL SECTION
            ======================================== */}
            <motion.section
                className="py-16 sm:py-24 bg-[var(--bg-primary)]"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        variants={itemVariants}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat text-center mb-8 sm:mb-12"
                    >
                        Technical <span className="gradient-text">Arsenal</span>
                    </motion.h2>

                    <motion.div variants={itemVariants} className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                        {/* Languages */}
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-[var(--text-secondary)] mb-3 sm:mb-4">Languages</h3>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {techStack.languages.map((tech) => (
                                    <span key={tech} className="tech-badge">{tech}</span>
                                ))}
                            </div>
                        </div>

                        {/* Frameworks */}
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-[var(--text-secondary)] mb-3 sm:mb-4">Frameworks & Platforms</h3>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {techStack.frameworks.map((tech) => (
                                    <span key={tech} className="tech-badge">{tech}</span>
                                ))}
                            </div>
                        </div>

                        {/* Tools */}
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-[var(--text-secondary)] mb-3 sm:mb-4">Development Tools</h3>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {techStack.tools.map((tech) => (
                                    <span key={tech} className="tech-badge">{tech}</span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* ========================================
                FEATURED PROJECTS SECTION
            ======================================== */}
            <motion.section
                className="py-16 sm:py-24 bg-[var(--bg-secondary)] relative overflow-hidden"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        variants={itemVariants}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat text-center mb-3 sm:mb-4"
                    >
                        Featured <span className="gradient-text">Projects</span>
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-sm sm:text-base text-[var(--text-secondary)] text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-2"
                    >
                        Open-source projects demonstrating architectural complexity and product-first thinking.
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {projects.map((project, index) => (
                            <motion.a
                                key={project.name}
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={itemVariants}
                                className="card p-6 group cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                        </svg>
                                        <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                                            {project.name}
                                        </h3>
                                    </div>
                                    <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                                <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
                                    {project.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1.5">
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: languageColors[project.language] || '#888' }}
                                        />
                                        <span className="text-[var(--text-tertiary)]">{project.language}</span>
                                    </span>
                                    <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                                        </svg>
                                        {project.stars}
                                    </span>
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    <motion.div variants={itemVariants} className="text-center mt-10">
                        <a
                            href="https://github.com/suvojeet-sengupta"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary inline-flex items-center gap-2"
                        >
                            View All on GitHub
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </motion.div>
                </div>
            </motion.section>

            {/* ========================================
                MUSIC SHOWCASE SECTION
            ======================================== */}
            <motion.section
                id="music"
                className="py-16 sm:py-24 bg-[var(--bg-primary)] relative overflow-hidden"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.h2
                        variants={itemVariants}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat text-center mb-3 sm:mb-4"
                    >
                        Music <span className="gradient-text-creative">Showcase</span>
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-sm sm:text-base text-[var(--text-secondary)] text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-2"
                    >
                        Singing is in my soul since childhood. Inspired by <span className="text-[var(--accent-creative)] font-medium">Arijit Singh</span>,
                        music is not just a passion — it's a part of who I am. Without music, I simply can't live.
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                        {videos.slice(0, 3).map(video => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                    <div className="mt-8 sm:mt-12 text-center">
                        <Link href="/music" className="btn-creative inline-flex items-center justify-center gap-2 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            View All Music
                        </Link>
                    </div>
                </div>
            </motion.section>

            {/* ========================================
                BLOG POSTS SECTION
            ======================================== */}
            <motion.section
                id="blog"
                className="py-16 sm:py-24 bg-[var(--bg-secondary)] relative"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-48 sm:w-96 h-48 sm:h-96 bg-[var(--accent-primary)] opacity-10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-48 sm:w-96 h-48 sm:h-96 bg-[var(--accent-secondary)] opacity-10 rounded-full blur-3xl" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.h2
                        variants={itemVariants}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat text-center mb-3 sm:mb-4"
                    >
                        Latest from the <span className="gradient-text">Blog</span>
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-sm sm:text-base text-[var(--text-secondary)] text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-2"
                    >
                        Thoughts on software architecture, mobile development, and technology.
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : !error && posts.length > 0 ? (
                            posts.slice(0, 3).map(post => (
                                <BlogPostCard key={post.sys.id} post={post} />
                            ))
                        ) : (
                            <p className="text-center col-span-full text-[var(--text-muted)]">No posts found.</p>
                        )}
                    </div>
                    <div className="mt-8 sm:mt-12 text-center">
                        <Link href="/blog" className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
                            View All Posts
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </motion.section>

            {/* ========================================
                CONTACT SECTION
            ======================================== */}
            <motion.section
                id="contact"
                className="py-16 sm:py-24 bg-[var(--bg-primary)] relative overflow-hidden safe-area-bottom"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.h2
                        variants={itemVariants}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat text-center mb-3 sm:mb-4"
                    >
                        Get in <span className="gradient-text">Touch</span>
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-sm sm:text-base text-[var(--text-secondary)] text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-2"
                    >
                        Open to discussing new architectural challenges, collaboration opportunities, and complex system design problems.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="max-w-2xl mx-auto glass p-5 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl"
                    >
                        <AnimatePresence mode="wait">
                            {formState.status !== 'success' ? (
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="input-modern"
                                                placeholder="Your name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                className="input-modern"
                                                placeholder="your@email.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                                            Message
                                        </label>
                                        <textarea
                                            name="message"
                                            id="message"
                                            rows="5"
                                            className="input-modern resize-none"
                                            placeholder="How can I help you?"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={formState.status === 'submitting'}
                                    >
                                        {formState.status === 'submitting' ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    className="text-center py-10"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                        className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                                    >
                                        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Message Sent!</h3>
                                    <p className="text-[var(--text-secondary)]">{formState.message}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {formState.status === 'error' && (
                            <div className="mt-6 text-center p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                                {formState.message}
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
};

export default HomePage;
