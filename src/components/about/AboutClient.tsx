"use client";

import React, { useReducer } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import SocialLinks from '../contact/SocialLinks';
import Image from 'next/image';
import { timeline, skills, philosophy, futureGoals } from '@/data/aboutData';

const suvojeet = '/suvojeet.jpg';

// Type definitions for form state
interface FormState {
    status: 'idle' | 'submitting' | 'success' | 'error';
    message: string | null;
}

type FormAction = 
    | { type: 'SUBMIT' }
    | { type: 'SUCCESS'; payload: string }
    | { type: 'ERROR'; payload: string };

const formInitialState: FormState = {
    status: 'idle',
    message: null,
};

function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case 'SUBMIT':
            return { ...state, status: 'submitting', message: null };
        case 'SUCCESS':
            return { ...state, status: 'success', message: action.payload };
        case 'ERROR':
            return { ...state, status: 'error', message: action.payload };
        default:
            return state;
    }
}

const AboutClient = () => {
    const [formState, dispatch] = useReducer(formReducer, formInitialState);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch({ type: 'SUBMIT' });

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data: Record<string, any> = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch('https://formsubmit.co/ajax/7bcff6a4aef91c254d8c32aaf5b0214d', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                dispatch({ type: 'SUCCESS', payload: 'Thanks for your message! I will get back to you soon.' });
                form.reset();
            } else {
                const responseData = await response.json();
                const errorMessage = responseData.errors
                    ? responseData.errors.map((error: any) => error.message).join(", ")
                    : 'Oops! There was a problem submitting your form';
                dispatch({ type: 'ERROR', payload: errorMessage });
            }
        } catch (error) {
            dispatch({ type: 'ERROR', payload: 'Something went wrong. Please try again.' });
        }
    };

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

    const cardHover = {
        y: -8,
        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
        transition: { duration: 0.3 }
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

            {/* Timeline Section */}
            <section className="py-24 bg-tertiary">
                <motion.div
                    className="section-container"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">The Journey</h2>
                        <p className="text-secondary max-w-2xl mx-auto font-medium">
                            Milestones that define my path in tech and music.
                        </p>
                    </motion.div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-brand-orange hidden md:block" />

                        {timeline.map((item, index) => (
                            <motion.div
                                key={item.year}
                                variants={itemVariants}
                                className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                                    <motion.div
                                        className="professional-card"
                                        whileHover={{ y: -4, borderColor: 'var(--accent-primary)' }}
                                    >
                                        <span className="inline-block px-3 py-1 text-xs font-black rounded-sm bg-brand-orange text-white mb-3">
                                            {item.year}
                                        </span>
                                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                        <p className="text-secondary">{item.description}</p>
                                    </motion.div>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-brand-orange border-4 border-white hidden md:block" />
                            </motion.div>
                        ))}
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
                        <AnimatePresence mode="wait">
                            {formState.status !== 'success' ? (
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name-about" className="text-xs font-black uppercase tracking-widest text-muted">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name-about"
                                                className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-primary"
                                                placeholder="Suvojeet"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email-about" className="text-xs font-black uppercase tracking-widest text-muted">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email-about"
                                                className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-primary"
                                                placeholder="suvojeet@example.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="message-about" className="text-xs font-black uppercase tracking-widest text-muted">
                                            Message
                                        </label>
                                        <textarea
                                            name="message"
                                            id="message-about"
                                            rows={5}
                                            className="w-full bg-tertiary border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-primary resize-none"
                                            placeholder="Your vision..."
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-solid w-full text-lg py-4"
                                        disabled={formState.status === 'submitting'}
                                    >
                                        {formState.status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    className="text-center py-10"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-sm bg-brand-orange flex items-center justify-center text-white">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Message Received</h3>
                                    <p className="text-secondary font-medium">{formState.message}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
