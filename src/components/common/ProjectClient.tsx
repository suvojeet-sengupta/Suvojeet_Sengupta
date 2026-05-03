"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icons } from './Icons';
import ModularContactForm from '../contact/ModularContactForm';
import Link from 'next/link';

interface ProjectClientProps {
    name: string;
    description: string;
    longDescription?: string;
    story?: string;
    features: string[];
    techStack: string[];
    githubUrl: string;
    repo?: string; // Format: "owner/repo"
    liveUrl?: string;
    downloadUrl?: string;
    stats?: { label: string; value: string }[];
}

const ExternalLinkIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);

const DownloadIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const ArrowLeftIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const ProjectClient: React.FC<ProjectClientProps> = ({
    name,
    description,
    longDescription,
    story,
    features,
    techStack,
    githubUrl,
    repo,
    liveUrl,
    downloadUrl: initialDownloadUrl,
    stats
}) => {
    const [dynamicDownloadUrl, setDynamicDownloadUrl] = useState<string | undefined>(initialDownloadUrl);

    useEffect(() => {
        if (repo) {
            fetch(`https://api.github.com/repos/${repo}/releases/latest`)
                .then(res => res.json())
                .then(data => {
                    const apkAsset = data.assets?.find((asset: any) => asset.name.endsWith('.apk'));
                    if (apkAsset) {
                        setDynamicDownloadUrl(apkAsset.browser_download_url);
                    }
                })
                .catch(err => console.error("Failed to fetch latest release:", err));
        }
    }, [repo]);

    return (
        <div className="min-h-screen pt-24 sm:pt-28 pb-16">
            <div className="section-container !pt-0">
                <Link
                    href="/#tracks"
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--text-secondary)] opacity-70 hover:text-[color:var(--neon)] hover:opacity-100 transition-colors mb-10 group"
                >
                    <ArrowLeftIcon size={14} />
                    <span className="group-hover:-translate-x-1 transition-transform">Back to Tracklist</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                        <div className="flex-1 min-w-0">
                            <div className="v-tag mb-6">Track · {name}</div>
                            <h1 className="font-serif font-light leading-[0.92] tracking-tight mb-5 text-[clamp(48px,9vw,128px)] break-words">
                                {name}
                            </h1>
                            <p className="text-base sm:text-lg lg:text-xl text-[color:var(--text-secondary)] opacity-85 max-w-2xl leading-relaxed">
                                {description}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline"
                            >
                                <Icons.GitHub className="w-4 h-4" /> GitHub
                            </a>
                            {dynamicDownloadUrl && (
                                <a
                                    href={dynamicDownloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-solid"
                                >
                                    <DownloadIcon size={16} /> Download APK
                                </a>
                            )}
                            {liveUrl && (
                                <a
                                    href={liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-solid"
                                >
                                    <ExternalLinkIcon size={16} /> View Live
                                </a>
                            )}
                        </div>
                    </div>

                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-14 sm:mb-16 pb-12 border-b border-[color:var(--line-strong)]">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center sm:text-left">
                                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--text-muted)] mb-2">{stat.label}</p>
                                    <p className="font-serif text-2xl sm:text-3xl font-semibold text-[color:var(--neon)]">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
                        <div className="lg:col-span-2 space-y-12 sm:space-y-14">
                            <section>
                                <div className="v-section-num">A1 / Overview</div>
                                <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-5 tracking-tight">Project Overview</h2>
                                <p className="text-base sm:text-lg text-[color:var(--text-secondary)] opacity-85 leading-relaxed">
                                    {longDescription || description}
                                </p>
                            </section>

                            {story && (
                                <section>
                                    <div className="v-section-num">A2 / The Story</div>
                                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-5 tracking-tight">The Story</h2>
                                    <p className="text-base sm:text-lg text-[color:var(--text-secondary)] opacity-85 leading-relaxed italic font-serif border-l-2 border-[color:var(--neon)] pl-5 sm:pl-6">
                                        {story}
                                    </p>
                                </section>
                            )}

                            <section>
                                <div className="v-section-num">A3 / Features</div>
                                <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-6 tracking-tight">Key Features</h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 p-4 border border-[color:var(--line)] hover:border-[color:var(--neon)]/50 transition-colors">
                                            <span className="text-[color:var(--neon)] font-mono mt-0.5 flex-shrink-0">/</span>
                                            <span className="text-sm sm:text-base text-[color:var(--text-secondary)] opacity-85">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        <div className="space-y-8 sm:space-y-10 lg:sticky lg:top-28 lg:self-start">
                            <section className="professional-card">
                                <div className="v-section-num !mb-3">B1 / Stack</div>
                                <h3 className="font-serif text-xl font-semibold mb-5 tracking-tight">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.map((tech, i) => (
                                        <span key={i} className="v-pill">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section className="professional-card border-[color:var(--neon)]/40">
                                <div className="v-section-num !mb-3">B2 / Inquiry</div>
                                <h3 className="font-serif text-xl font-semibold mb-5 tracking-tight">Project Inquiry</h3>
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
