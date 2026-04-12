"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import SocialLinks from '../contact/SocialLinks';
import Image from 'next/image';
import { skills, philosophy, futureGoals } from '@/data/aboutData';
import ModularContactForm from '../contact/ModularContactForm';

const suvojeet = '/suvojeet.jpg';

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
                                Born on 1st August 2005 in Asansol, West Bengal. I find balance between the precision of code and the raw emotion of music.
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
                                    <span className="text-3xl">{skill.icon}</span>
                                    <h3 className="text-lg font-bold">{skill.name}</h3>
                                </div>
                                <div className="relative h-2 bg-tertiary rounded-full overflow-hidden">
                                    <motion.div
                                        className="absolute left-0 top-0 h-full bg-brand-orange rounded-full"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.level}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                    />
                                </div>
                                <p className="text-right text-xs font-bold text-muted mt-2 uppercase tracking-widest">{skill.level}% Proficiency</p>
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
                            <div className="grid grid-cols-2 gap-4">
                                {futureGoals.map((goal, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800">
                                        <span className="text-2xl">{goal.icon}</span>
                                        <span className="text-xs font-black uppercase tracking-widest">{goal.label}</span>
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
                            Let's discuss collaborations, projects, or just talk music.
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
