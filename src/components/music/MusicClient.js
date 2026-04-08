"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * Professional Musical Profile - Redesigned
 * Focus: Journey, Training, and Musical Identity
 */
const MusicClient = () => {
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

    const musicalStyles = [
        {
            title: "Soulful Bollywood",
            description: "Deeply inspired by Arijit Singh's emotive storytelling through vocals. I focus on capturing the 'vibe' and raw emotion of every track.",
            icon: "🎵"
        },
        {
            title: "Acoustic Interpretations",
            description: "Stripping down complex arrangements to their melodic core. Exploring the harmony between simple instrumentation and powerful vocals.",
            icon: "🎸"
        },
        {
            title: "Rhythmic Precision",
            description: "Where the 'Architect' meets the 'Singer'. Precise timing and controlled dynamics that mirror the structural integrity of a well-built system.",
            icon: "🥁"
        }
    ];

    return (
        <div className="min-h-screen pt-20 bg-[var(--bg-primary)]">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="hero-gradient" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[var(--accent-creative)]/10 border border-[var(--accent-creative)]/20 text-[var(--accent-creative)] text-sm font-medium">
                            Musical Identity
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold font-montserrat mb-6">
                            The Soul of <span className="gradient-text-creative">Music</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto italic">
                            "Without music, I simply can't live. It's not just a hobby—it's the rhythm of my life."
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* The Journey Section */}
            <section className="py-20 bg-[var(--bg-secondary)]">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl font-bold mb-6 gradient-text">A Lifelong Passion</h2>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-lg">
                                <p>
                                    My relationship with music began in early childhood. It started as a fascination with melody and evolved into a deep-seated passion that defines who I am today.
                                </p>
                                <p>
                                    As a singer, I've spent years refining my vocal texture, focusing on the nuances of Indian music and the powerful emotional resonance found in Bollywood compositions.
                                </p>
                                <p>
                                    Inspired by the technical brilliance and soulful delivery of <strong className="text-[var(--text-primary)]">Arijit Singh</strong>, I strive to bring that same level of 'vibe' and precision to my own performances.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div 
                            className="relative"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-[var(--glass-border)]">
                                <img 
                                    src="/suvojeet.jpg" 
                                    alt="Suvojeet Sengupta - Musician" 
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--accent-creative)] opacity-20 rounded-full blur-3xl animate-pulse" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Experience & Crossover Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Musical <span className="gradient-text-creative">Philosophy</span></h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                            The same principles that guide my system architecture apply to my music: structure, rhythm, and a deep understanding of the core elements.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {musicalStyles.map((style, index) => (
                            <motion.div 
                                key={index}
                                className="card-creative p-8 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <div className="text-4xl mb-4">{style.icon}</div>
                                <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">{style.title}</h3>
                                <p className="text-[var(--text-secondary)] text-sm">
                                    {style.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vocal Training Highlight */}
            <section className="py-20 bg-[var(--bg-tertiary)] border-y border-[var(--border-light)]">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h2 className="text-2xl font-bold mb-8">Technical Proficiency</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {["Classical Foundation", "Vocal Dynamics", "Texture Control", "Emotion-First Delivery", "Rhythm Integrity"].map((skill, i) => (
                            <span key={i} className="px-6 py-3 rounded-full glass border border-[var(--accent-creative)]/20 text-[var(--text-primary)] font-medium">
                                {skill}
                            </span>
                        ))}
                    </div>
                    <div className="mt-12 p-8 glass rounded-2xl border border-[var(--glass-border)]">
                        <p className="text-[var(--text-secondary)] italic text-lg leading-relaxed">
                            "In music, just as in code, the foundation must be solid. Every note has its place in the architecture of a song, creating a 'vibe' that resonates beyond the simple execution of melody."
                        </p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">Let's Connect Through Music</h2>
                    <p className="text-[var(--text-secondary)] mb-10 max-w-xl mx-auto">
                        I am always open to collaborations, musical discussions, or sharing the stage with fellow artists.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/request-song" className="btn-creative">
                            Request a Cover
                        </Link>
                        <Link href="/#contact" className="btn-secondary">
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MusicClient;
