"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import SocialLinks from '../contact/SocialLinks';
import Image from 'next/image';
import { skills, philosophy, futureGoals, timeline } from '@/data/aboutData';
import ModularContactForm from '../contact/ModularContactForm';
import ResumeHub from './ResumeHub';

const suvojeet = '/suvojeet.jpg';

// Icon Helper Components
const SkillIcon = ({ name }: { name: string }) => {
    const iconClass = "w-8 h-8 text-brand-orange";
    switch (name) {
        case 'music': return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
        );
        case 'ai': return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        );
        case 'rom': return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        );
        case 'android': return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4482-.9993-.9997 0-.5519.4482-1.0012.9993-1.0012.5519 0 1.0012.4493 1.0012 1.0012 0 .5515-.4493.9997-1.0012.9997m-11.046 0c-.5511 0-.9993-.4482-.9993-.9997 0-.5519.4482-1.0012.9993-1.0012.5519 0 1.0012.4493 1.0012 1.0012 0 .5515-.4493.9997-1.0012.9997m11.4045-6.0206l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.41 13.8533 7.8465 12 7.8465c-1.8533 0-3.5902.5635-5.1365 1.5426L4.8412 5.8861a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1859 0 14.4397 0 18.2606h24c0-3.8209-2.6889-7.1347-6.1182-9.1412" />
            </svg>
        );
        case 'web': return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
        );
        default: return null;
    }
};

const VisionIcon = ({ name }: { name: string }) => {
    const iconClass = "w-6 h-6 text-brand-orange";
    switch (name) {
        case 'mic': return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        );
        case 'music-note': return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
        );
        case 'cpu': return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
        );
        case 'rocket': return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.585 15.585a6.213 6.213 0 001.241-3.218 13.213 13.213 0 01-1.241 3.218zm0 0a6.213 6.213 0 01-3.218 1.241 13.213 13.213 0 003.218-1.241zM10.337 15.585a6.213 6.213 0 01-1.241-3.218 13.213 13.213 0 001.241 3.218zm0 0a6.213 6.213 0 003.218 1.241 13.213 13.213 0 01-3.218-1.241zM21 21l-6-6m-3 3a9 9 0 119-9 9 9 0 01-9 9z" />
            </svg>
        );
        default: return null;
    }
};

const AboutClient = () => {
    // Animation variants with explicit typing
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.6, ease: 'easeOut' } 
        },
    };

    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 sm:py-28">
                {/* Background Effects - Kept for compatibility but styled minimally */}
                <div className="hero-gradient opacity-20" />

                <motion.div
                    className="relative z-10 section-container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Profile Image */}
                        <motion.div
                            variants={itemVariants}
                            className="relative mx-auto lg:mx-0"
                        >
                            <div className="profile-frame">
                                <motion.div
                                    className="relative w-64 h-64 sm:w-80 sm:h-80 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Image
                                        src={suvojeet}
                                        alt="Suvojeet Sengupta"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority
                                    />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Intro Text */}
                        <motion.div variants={itemVariants} className="text-center lg:text-left">
                            <motion.div
                                className="inline-block px-3 py-1 bg-accent-subtle border border-brand-orange text-brand-orange text-sm font-medium rounded-sm mb-6"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Singer & Creative Developer
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                                About <span className="text-accent">Suvojeet</span>
                            </h1>

                            <p className="text-xl text-secondary mb-6 leading-relaxed">
                                Born in Asansol, West Bengal, currently based in Dhanbad, Jharkhand. I find balance between the precision of code and the raw emotion of music.
                            </p>

                            <p className="text-lg text-secondary mb-8 leading-relaxed">
                                Inspired by legendary artists like <strong className="text-brand-orange">Arijit Singh</strong>, I strive to bring the same level of depth and authenticity to everything I build and sing.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <SocialLinks size="medium" />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            <ResumeHub />

            {/* Timeline Section */}
            <section className="py-24 bg-tertiary">
                <motion.div
                    className="section-container"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">My <span className="text-brand-orange">Journey</span></h2>
                        <p className="text-secondary max-w-2xl mx-auto font-medium">
                            A timeline of growth, from the first note sung to the latest line of code.
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto relative px-4">
                        {/* Vertical line for desktop */}
                        <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-brand-orange/20" />
                        
                        <div className="space-y-12">
                            {timeline.map((event, index) => (
                                <motion.div 
                                    key={index}
                                    variants={itemVariants}
                                    className={`relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                >
                                    {/* Content */}
                                    <div className="w-full md:w-[45%] professional-card ml-8 md:ml-0">
                                        <span className="text-brand-orange font-black text-sm mb-2 block">{event.year}</span>
                                        <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                                        <p className="text-secondary text-sm leading-relaxed">{event.description}</p>
                                    </div>

                                    {/* Dot */}
                                    <div className="absolute left-[1.1rem] md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-brand-orange border-4 border-background z-10" />

                                    {/* Spacer for desktop */}
                                    <div className="hidden md:block w-[45%]" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Skills Section */}
            <section className="py-24">
                <motion.div
                    className="section-container"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Core Expertise</h2>
                        <p className="text-secondary max-w-2xl mx-auto font-medium">
                            Synthesizing creative vision with technical execution.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.name}
                                variants={itemVariants}
                                className="professional-card"
                                whileHover={{ y: -4, borderColor: 'var(--accent-primary)' }}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <SkillIcon name={skill.icon} />
                                    <h3 className="text-lg font-bold">{skill.name}</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted">
                                        <span>Proficiency</span>
                                        <span>{skill.level}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-background border border-light/50 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="h-full bg-brand-orange"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${skill.level}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Philosophy & Goals Section */}
            <section className="py-24 bg-brand-black text-white">
                <motion.div
                    className="section-container"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <motion.div
                            variants={itemVariants}
                            className="p-8 border border-gray-800 rounded-sm"
                        >
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 bg-brand-orange flex items-center justify-center text-white text-sm">01</span>
                                Philosophy
                            </h3>
                            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                                I believe music and code are two sides of the same coin: <strong className="text-white">Expression through Structure</strong>. Both require relentless practice and an obsession with detail.
                            </p>
                            <ul className="space-y-4">
                                {philosophy.map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-gray-400">
                                        <span className="text-brand-orange font-bold">/</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="p-8 border border-gray-800 rounded-sm"
                        >
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 bg-brand-orange flex items-center justify-center text-white text-sm">02</span>
                                Vision
                            </h3>
                            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                                My mission is to push the boundaries of creative technology while maintaining a soul-deep connection to my music.
                            </p>
                            <div className="space-y-4">
                                {futureGoals.map((goal, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-gray-900 border border-gray-800">
                                        <div className="mt-1 flex-shrink-0">
                                            <VisionIcon name={goal.icon} />
                                        </div>
                                        <div>
                                            <span className="text-xs font-black uppercase tracking-widest text-brand-orange block mb-1">{goal.label}</span>
                                            <p className="text-sm text-gray-400 leading-relaxed">{goal.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Contact Section */}
            <section className="py-24">
                <motion.div
                    className="section-container max-w-3xl"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Direct Message</h2>
                        <p className="text-secondary font-medium">
                            Let&apos;s discuss collaborations, projects, or just talk music.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="professional-card">
                        <ModularContactForm initialType="GENERAL" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Social Links Footer */}
            <section className="pb-24">
                <div className="section-container text-center">
                    <SocialLinks size="large" />
                </div>
            </section>
        </div>
    );
};

export default AboutClient;
