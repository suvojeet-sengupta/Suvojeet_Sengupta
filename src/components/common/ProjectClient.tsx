"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from './Icons';
import ModularContactForm from '../contact/ModularContactForm';
import Link from 'next/link';

interface ProjectClientProps {
    name: string;
    description: string;
    longDescription?: string;
    features: string[];
    techStack: string[];
    githubUrl: string;
    liveUrl?: string;
    stats?: { label: string; value: string }[];
}

// Inline SVGs to replace lucide-react dependencies
const ExternalLinkIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);

const ArrowLeftIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const ProjectClient: React.FC<ProjectClientProps> = ({
    name,
    description,
    longDescription,
    features,
    techStack,
    githubUrl,
    liveUrl,
    stats
}) => {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="section-container">
                <Link 
                    href="/#projects" 
                    className="inline-flex items-center gap-2 text-secondary hover:text-brand-orange transition-colors mb-8 group"
                >
                    <ArrowLeftIcon size={20} />
                    <span className="group-hover:-translate-x-1 transition-transform">Back to Projects</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter">
                                {name}
                            </h1>
                            <p className="text-xl text-secondary max-w-2xl">
                                {description}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <a 
                                href={githubUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn-outline flex items-center gap-2"
                            >
                                <Icons.GitHub className="w-5 h-5" /> GitHub
                            </a>
                            {liveUrl && (
                                <a 
                                    href={liveUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn-solid flex items-center gap-2"
                                >
                                    <ExternalLinkIcon size={20} /> View Live
                                </a>
                            )}
                        </div>
                    </div>

                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            {stats.map((stat, i) => (
                                <div key={i} className="professional-card p-4 text-center">
                                    <p className="text-xs font-black uppercase tracking-widest text-muted mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-brand-orange">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-12">
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-brand-orange" />
                                    Project Overview
                                </h2>
                                <p className="text-lg text-secondary leading-relaxed mb-6">
                                    {longDescription || description}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-brand-orange" />
                                    Key Features
                                </h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 p-4 bg-tertiary rounded-sm">
                                            <span className="text-brand-orange font-bold">✓</span>
                                            <span className="text-secondary">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        <div className="space-y-12">
                            <section className="professional-card">
                                <h3 className="text-xl font-bold mb-6">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.map((tech, i) => (
                                        <span 
                                            key={i} 
                                            className="px-3 py-1 bg-brand-black text-white text-xs font-bold uppercase tracking-widest"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section className="professional-card border-brand-orange">
                                <h3 className="text-xl font-bold mb-6">Project Inquiry</h3>
                                <ModularContactForm initialType="PROJECT" projectName={name} />
                            </section>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProjectClient;
