"use client";

import React, { useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SocialLinks from '../contact/SocialLinks';
import Image from 'next/image';

const suvojeet = '/suvojeet.jpg';

// Reducer function for form state management
const formInitialState = {
    status: 'idle', // 'idle', 'submitting', 'success', 'error'
    message: null,
};

function formReducer(state, action) {
    switch (action.type) {
        case 'SUBMIT':
            return { ...state, status: 'submitting', message: null };
        case 'SUCCESS':
            return { ...state, status: 'success', message: action.payload };
        case 'ERROR':
            return { ...state, status: 'error', message: action.payload };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

const AboutClient = () => {
    const [formState, dispatch] = useReducer(formReducer, formInitialState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: 'SUBMIT' });

        const form = e.target;
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

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
                    ? responseData.errors.map(error => error.message).join(", ")
                    : 'Oops! There was a problem submitting your form';
                dispatch({ type: 'ERROR', payload: errorMessage });
            }
        } catch (error) {
            dispatch({ type: 'ERROR', payload: 'Something went wrong. Please try again.' });
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const cardHover = {
        y: -8,
        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
        transition: { duration: 0.3 }
    };

    // Timeline data
    const timeline = [
        {
            year: "2005",
            title: "Birth & Early Years",
            description: "Born on 1st August in Asansol, West Bengal. Started humming Kishore Kumar songs as a child."
        },
        {
            year: "2015",
            title: "Discovering Passion",
            description: "Realized singing was more than a hobby—it became a part of my identity. Started self-practice."
        },
        {
            year: "2020",
            title: "Tech Meets Music",
            description: "Combined technology skills with music passion. Started creating apps and websites."
        },
        {
            year: "Present",
            title: "The Journey Continues",
            description: "Pursuing BA in Arts while building SuvMusic, NoteNext, and sharing music with the world."
        }
    ];

    // Skills data
    const skills = [
        { name: "Singing", level: 90, icon: "🎤" },
        { name: "Music Production", level: 70, icon: "🎵" },
        { name: "Android Development", level: 95, icon: "📱" },
        { name: "Web Development", level: 85, icon: "🌐" },
        { name: "UI/UX Design", level: 80, icon: "🎨" },
    ];

    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 sm:py-28">
                {/* Background Effects */}
                <div className="hero-gradient" />
                <div className="blob-1 animate-blob" />
                <div className="blob-2 animate-blob animation-delay-200" />

                <motion.div
                    className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8"
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
                            <div className="profile-image-container">
                                <motion.div
                                    className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-2xl"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        src={suvojeet}
                                        alt="Suvojeet Sengupta"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                </motion.div>
                                {/* Decorative ring */}
                                <div className="absolute -inset-4 rounded-3xl border-2 border-[var(--accent-primary)] opacity-20 animate-pulse-glow" />
                            </div>
                        </motion.div>

                        {/* Intro Text */}
                        <motion.div variants={itemVariants} className="text-center lg:text-left">
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 mb-6"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                                <span className="text-sm font-medium text-[var(--accent-primary)]">Singer & Developer</span>
                            </motion.div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-montserrat mb-6">
                                <span className="text-[var(--text-primary)]">About </span>
                                <span className="gradient-text">Me</span>
                            </h1>

                            <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
                                Hi! I'm <strong className="text-[var(--text-primary)]">Suvojeet Sengupta</strong>, born on 1st August 2005 in Asansol, West Bengal.
                                From a very young age, I found myself lost in the world of music. Singing wasn't just something I enjoyed—it became a part of who I am.
                            </p>

                            <p className="text-[var(--text-tertiary)] mb-8 leading-relaxed">
                                I've always been inspired by <strong className="text-[var(--accent-secondary)]">Arijit Singh</strong>.
                                His voice, emotion, and style motivate me to push my own limits and develop my own unique singing style.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <SocialLinks size="medium" />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 bg-[var(--bg-secondary)]">
                <motion.div
                    className="container mx-auto px-4 sm:px-6 lg:px-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold font-montserrat mb-4">
                            My <span className="gradient-text">Journey</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                            A timeline of the key moments that shaped who I am today.
                        </p>
                    </motion.div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] hidden md:block" />

                        {timeline.map((item, index) => (
                            <motion.div
                                key={item.year}
                                variants={itemVariants}
                                className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                                    <motion.div
                                        className="card-elevated p-6 rounded-xl"
                                        whileHover={cardHover}
                                    >
                                        <span className="inline-block px-3 py-1 text-sm font-bold rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] mb-3">
                                            {item.year}
                                        </span>
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                                        <p className="text-[var(--text-secondary)]">{item.description}</p>
                                    </motion.div>
                                </div>

                                {/* Timeline dot */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--accent-primary)] border-4 border-[var(--bg-secondary)] shadow-lg hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Skills Section */}
            <section className="py-20">
                <motion.div
                    className="container mx-auto px-4 sm:px-6 lg:px-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold font-montserrat mb-4">
                            My <span className="gradient-text">Skills</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                            A blend of creativity and technology that defines my approach.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.name}
                                variants={itemVariants}
                                className="card-elevated p-6 rounded-xl"
                                whileHover={cardHover}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-3xl">{skill.icon}</span>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{skill.name}</h3>
                                </div>
                                <div className="relative h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                    <motion.div
                                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.level}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                    />
                                </div>
                                <p className="text-right text-sm text-[var(--text-tertiary)] mt-2">{skill.level}%</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Philosophy & Goals Section */}
            <section className="py-20 bg-[var(--bg-secondary)]">
                <motion.div
                    className="container mx-auto px-4 sm:px-6 lg:px-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Philosophy Card */}
                        <motion.div
                            variants={itemVariants}
                            className="card-elevated p-8 rounded-2xl"
                            whileHover={cardHover}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)]">My Philosophy</h3>
                            </div>
                            <p className="text-[var(--text-secondary)] mb-6">
                                I strongly believe that <strong className="text-[var(--text-primary)]">singing is not just learned—it's lived</strong>.
                                Every melody I create, every note I practice, is a step toward becoming better and more authentic.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Consistent Practice – Every day, even a few minutes, counts.",
                                    "Experimentation – Trying new styles, genres, and techniques.",
                                    "Learning from Inspiration – Drawing lessons from Arijit Singh.",
                                    "Expressing Emotion – Music is communication, not just sound."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[var(--text-secondary)]">
                                        <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-[var(--accent-primary)]">{i + 1}</span>
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Goals Card */}
                        <motion.div
                            variants={itemVariants}
                            className="card-elevated p-8 rounded-2xl"
                            whileHover={cardHover}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-tertiary)] flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)]">Future Goals</h3>
                            </div>
                            <p className="text-[var(--text-secondary)] mb-6">
                                My ultimate goal is to become a <strong className="text-[var(--text-primary)]">professional singer</strong> and share my music with the world.
                                I want to inspire people, evoke emotions, and connect hearts through my voice.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: "🎤", label: "Professional Singer" },
                                    { icon: "🌍", label: "Global Reach" },
                                    { icon: "💿", label: "Album Release" },
                                    { icon: "🚀", label: "Tech Innovation" }
                                ].map((goal, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)]">
                                        <span className="text-2xl">{goal.icon}</span>
                                        <span className="text-sm font-medium text-[var(--text-secondary)]">{goal.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Contact Section */}
            <section className="py-20">
                <motion.div
                    className="container mx-auto px-4 sm:px-6 lg:px-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold font-montserrat mb-4">
                            Get in <span className="gradient-text">Touch</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Have a question, a project proposal, or just want to say hello? I'd love to hear from you.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="card-elevated p-8 sm:p-10 rounded-2xl">
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
                                            <div>
                                                <label htmlFor="name-about" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name-about"
                                                    className="input-modern"
                                                    placeholder="Your name"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email-about" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email-about"
                                                    className="input-modern"
                                                    placeholder="your@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="message-about" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                                                Message
                                            </label>
                                            <textarea
                                                name="message"
                                                id="message-about"
                                                rows="5"
                                                className="input-modern resize-none"
                                                placeholder="Your message..."
                                                required
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
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
                                            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
                                        >
                                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Message Sent!</h3>
                                        <p className="text-[var(--text-secondary)]">{formState.message}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {formState.status === 'error' && (
                                <motion.div
                                    className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center text-red-500"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {formState.message}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Social Links Footer */}
            <section className="pb-20">
                <div className="container mx-auto px-4 text-center">
                    <SocialLinks size="large" />
                </div>
            </section>
        </div>
    );
};

export default AboutClient;
