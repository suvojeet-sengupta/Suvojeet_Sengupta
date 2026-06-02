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
            <section className="relative overflow-hidden">
                <div className="hero-gradient opacity-30" />

                <motion.div
                    className="relative z-10 section-container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
                        {/* Profile Image */}
                        <motion.div
                            variants={itemVariants}
                            className="relative mx-auto lg:mx-0"
                        >
                            <div className="profile-frame">
                                <motion.div
                                    className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500"
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
                            <div className="v-tag mb-7 justify-center lg:justify-start">Side B · Liner Notes</div>

                            <h1 className="font-serif font-light leading-[0.92] tracking-tight mb-8 text-[clamp(48px,9vw,120px)]">
                                About <em className="not-italic font-black text-[color:var(--neon)]">Suvojeet</em>
                            </h1>

                            <p className="text-lg sm:text-xl mb-5 leading-relaxed text-[color:var(--text-secondary)] opacity-85 max-w-xl mx-auto lg:mx-0">
                                Born in <strong className="text-[color:var(--neon)] italic font-semibold">Asansol (Burnpur), West Bengal</strong>; based in <strong className="text-[color:var(--neon)] italic font-semibold">Dhanbad, Jharkhand</strong>. I understand architecture. I understand logic. And I solve real problems — just not by typing code manually.
                            </p>

                            <p className="text-base sm:text-lg mb-5 leading-relaxed text-[color:var(--text-secondary)] opacity-80 max-w-xl mx-auto lg:mx-0">
                                I think in systems. I design the solution completely — data flow, failure modes, edge cases, performance — before a single line runs. Then AI implements it. That&apos;s not a shortcut. That&apos;s production thinking without the bottleneck of syntax.
                            </p>

                            <p className="text-base sm:text-lg mb-9 leading-relaxed text-[color:var(--text-secondary)] opacity-80 max-w-xl mx-auto lg:mx-0">
                                The same mental discipline applies when I sing. Inspired by <strong className="text-[color:var(--neon)] italic font-semibold">Kishore Kumar, Lata Mangeshkar, and Arijit Singh</strong> — every note I hit is considered, not accidental. Two crafts. One philosophy.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <SocialLinks size="medium" />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* ── THE WAY I WORK ── */}
            <section className="bg-[color:var(--ink)] text-[color:var(--paper)] overflow-hidden">
                <motion.div
                    className="section-container max-w-5xl"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                >
                    <motion.div variants={itemVariants} className="mb-14">
                        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[color:var(--neon)] mb-4">02 / The Method</div>
                        <h2 className="font-serif font-light text-[clamp(36px,6vw,80px)] leading-[0.95] tracking-tight mb-0">
                            The Way <em className="font-black not-italic text-[color:var(--neon)]">I Work</em>
                        </h2>
                    </motion.div>

                    {/* The big honest statement */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <p className="font-serif text-[clamp(20px,3vw,32px)] leading-[1.35] text-[color:var(--bone)] opacity-90 max-w-3xl">
                            I&apos;m not a traditional developer. I don&apos;t memorise syntax. I don&apos;t write code line by line.{' '}
                            <em className="not-italic text-[color:var(--neon)] font-semibold">What I do is think.</em>
                        </p>
                    </motion.div>

                    {/* Three-pillar breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[color:var(--line)]">
                        {[
                            {
                                num: '01',
                                title: 'I Understand Architecture',
                                body: 'Before anything is built, I map the entire system. How data moves, where it can break, what happens under load, what the user actually experiences. The mental model has to be complete — or the output will be broken by design.'
                            },
                            {
                                num: '02',
                                title: 'I Think in Production',
                                body: 'Speed, memory, security, edge cases — these aren\'t afterthoughts. They\'re part of how I think about the problem from the first minute. SuvMusic streams without stutter. NoteNext protects data with biometrics. That\'s not luck — that\'s upfront thinking.'
                            },
                            {
                                num: '03',
                                title: 'AI Implements, I Direct',
                                body: 'AI is my implementation engine. I give it a clear architectural brief — data models, component contracts, performance constraints — and it writes the code. The logic and the decisions are mine. The syntax is the machine\'s job.'
                            }
                        ].map((item) => (
                            <motion.div
                                key={item.num}
                                variants={itemVariants}
                                className="bg-[color:var(--ink)] p-8 sm:p-10 group hover:bg-[color:var(--ink-2)] transition-colors duration-300"
                            >
                                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--neon)] mb-5">{item.num}</div>
                                <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-4 text-[color:var(--paper)]">{item.title}</h3>
                                <p className="text-sm sm:text-base text-[color:var(--bone)] opacity-75 leading-relaxed">{item.body}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* The distinction — important clarification */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-12 p-8 sm:p-10 border border-[color:var(--neon)]/30 bg-[color:var(--neon)]/5"
                    >
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[color:var(--neon)] mb-4">The Distinction</p>
                        <p className="font-serif text-lg sm:text-xl text-[color:var(--bone)] opacity-90 leading-relaxed">
                            There&apos;s a difference between someone who <em className="text-[color:var(--neon)] not-italic font-semibold">prompts randomly and hopes</em> and someone who{' '}
                            <em className="text-[color:var(--neon)] not-italic font-semibold">designs the system completely before asking AI to write it.</em>{' '}
                            The first gets spaghetti that breaks in production. The second ships software with 200+ GitHub stars and real daily users.
                            I&apos;m the second kind.
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            <ResumeHub />

            {/* Timeline Section */}
            <section className="bg-[color:var(--bg-secondary)]">
                <motion.div
                    className="section-container"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <div className="v-section-num">04 / Timeline</div>
                        <h2 className="v-section-title">My <em>Journey</em></h2>
                        <p className="mt-6 max-w-2xl mx-auto text-[color:var(--text-secondary)] opacity-80">
                            A timeline of growth, from the first note sung to the latest line of code.
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto relative px-4">
                        {/* Vertical line for desktop */}
                        <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-px h-full bg-[color:var(--line-strong)]" />

                        <div className="space-y-10 md:space-y-14">
                            {timeline.map((event, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className={`relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                >
                                    {/* Content */}
                                    <div className="w-full md:w-[46%] professional-card ml-10 md:ml-0">
                                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--neon)] block mb-2">{event.year}</span>
                                        <h3 className="font-serif text-xl md:text-2xl font-semibold mb-3">{event.title}</h3>
                                        <p className="text-[color:var(--text-secondary)] opacity-80 text-sm leading-relaxed">{event.description}</p>
                                    </div>

                                    {/* Dot */}
                                    <div className="absolute left-[1rem] md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[color:var(--neon)] ring-4 ring-[color:var(--bg-secondary)] z-10" />

                                    {/* Spacer for desktop */}
                                    <div className="hidden md:block w-[46%]" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Skills Section */}
            <section>
                <motion.div
                    className="section-container"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <div className="v-section-num">05 / Expertise</div>
                        <h2 className="v-section-title">Core <em>Expertise</em></h2>
                        <p className="mt-6 max-w-2xl mx-auto text-[color:var(--text-secondary)] opacity-80">
                            Synthesizing creative vision with technical execution.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.name}
                                variants={itemVariants}
                                className="professional-card"
                                whileHover={{ y: -4 }}
                            >
                                <div className="flex items-center gap-4 mb-5">
                                    <SkillIcon name={skill.icon} />
                                    <h3 className="font-serif text-lg sm:text-xl font-semibold">{skill.name}</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                                        <span>Proficiency</span>
                                        <span>{skill.level}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-[color:var(--bg-tertiary)] overflow-hidden">
                                        <motion.div
                                            className="h-full bg-[color:var(--neon)]"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${skill.level}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: 0.4 + (index * 0.08) }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Philosophy & Goals Section */}
            <section className="bg-[color:var(--ink)] text-[color:var(--paper)]">
                <motion.div
                    className="section-container"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <motion.div
                            variants={itemVariants}
                            className="p-8 sm:p-10 border border-[color:var(--line-strong)]"
                        >
                            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--neon)] mb-3">01 / Side A</div>
                            <h3 className="font-serif text-2xl sm:text-3xl font-semibold mb-6">Philosophy</h3>
                            <p className="text-[color:var(--bone)] opacity-80 mb-8 text-base sm:text-lg leading-relaxed">
                                I believe music and code are two sides of the same record: <em className="text-[color:var(--neon)] not-italic font-semibold italic">Expression through Structure</em>. Both require relentless practice and an obsession with detail.
                            </p>
                            <ul className="space-y-3">
                                {philosophy.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[color:var(--bone)] opacity-80 text-sm sm:text-base">
                                        <span className="text-[color:var(--neon)] font-mono mt-1">/</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="p-8 sm:p-10 border border-[color:var(--line-strong)]"
                        >
                            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--neon)] mb-3">02 / Side B</div>
                            <h3 className="font-serif text-2xl sm:text-3xl font-semibold mb-6">Vision</h3>
                            <p className="text-[color:var(--bone)] opacity-80 mb-8 text-base sm:text-lg leading-relaxed">
                                My mission is to push the boundaries of creative technology while maintaining a soul-deep connection to my music.
                            </p>
                            <div className="space-y-3">
                                {futureGoals.map((goal, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-[color:var(--ink-2)] border border-[color:var(--line)]">
                                        <div className="mt-1 flex-shrink-0">
                                            <VisionIcon name={goal.icon} />
                                        </div>
                                        <div>
                                            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--neon)] block mb-1">{goal.label}</span>
                                            <p className="text-sm text-[color:var(--bone)] opacity-75 leading-relaxed">{goal.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Contact Section */}
            <section>
                <motion.div
                    className="section-container max-w-3xl"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <div className="v-section-num">07 / Direct Line</div>
                        <h2 className="v-section-title">Direct <em>Message</em></h2>
                        <p className="mt-6 max-w-xl mx-auto text-[color:var(--text-secondary)] opacity-80">
                            Let&apos;s discuss collaborations, projects, or just talk music.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="professional-card p-6 sm:p-8">
                        <ModularContactForm initialType="GENERAL" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Social Links Footer */}
            <section className="pb-20">
                <div className="section-container !pt-0 text-center">
                    <SocialLinks size="large" />
                </div>
            </section>
        </div>
    );
};

export default AboutClient;
