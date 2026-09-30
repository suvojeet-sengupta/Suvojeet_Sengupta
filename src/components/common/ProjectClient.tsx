"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ModularContactForm from '../contact/ModularContactForm';

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
    const [downloadUrl, setDownloadUrl] = useState<string | undefined>(initialDownloadUrl);
    const [latestVersion, setLatestVersion] = useState<string | undefined>();

    useEffect(() => {
        if (!repo) return;
        fetch(`https://api.github.com/repos/${repo}/releases/latest`)
            .then(res => res.json())
            .then(data => {
                const apkAsset = data.assets?.find((asset: any) => asset.name.endsWith('.apk'));
                if (apkAsset) setDownloadUrl(apkAsset.browser_download_url);
                if (typeof data.tag_name === 'string') setLatestVersion(data.tag_name);
            })
            .catch(err => console.error("Failed to fetch latest release:", err));
    }, [repo]);

    return (
        <div className="page">
            <Link href="/#work" className="text-link text-[14px] !border-transparent hover:!border-[color:var(--text-primary)] mb-12">
                ← All work
            </Link>

            <header className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 items-end">
                <div>
                    <p className="page-eyebrow">Project</p>
                    <h1 className="page-title">{name}</h1>
                    <p className="page-lede">{description}</p>
                </div>
                <div className="flex flex-wrap gap-3 lg:justify-end lg:pb-2">
                    {downloadUrl && (
                        <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-solid">
                            Download APK
                        </a>
                    )}
                    {liveUrl && (
                        <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="btn-solid">
                            Open live site
                        </a>
                    )}
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                        Source on GitHub ↗
                    </a>
                </div>
            </header>

            {stats && (
                <dl className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-x-6 border-y border-[color:var(--line-strong)]">
                    {stats.map((stat) => (
                        <div key={stat.label} className="py-6">
                            <dt className="text-[13px] text-[color:var(--text-muted)] mb-1">{stat.label}</dt>
                            <dd className="font-serif text-[24px] text-[color:var(--text-primary)]">
                                {stat.label === 'Version' && latestVersion ? latestVersion : stat.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            )}

            <div className="grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20 mt-4">
                <div>
                    <section className="sec !pt-16">
                        <h2 className="text-[30px] mb-5">Overview</h2>
                        <p className="text-[17px] leading-[1.75] max-w-2xl">{longDescription || description}</p>
                    </section>

                    {story && (
                        <section className="pt-14">
                            <h2 className="text-[30px] mb-5">Why I built it</h2>
                            <p className="text-[17px] leading-[1.75] max-w-2xl">{story}</p>
                        </section>
                    )}

                    <section className="pt-14">
                        <h2 className="text-[30px] mb-5">Features</h2>
                        <ul className="grid sm:grid-cols-2 gap-x-8 border-t border-[color:var(--line)]">
                            {features.map((feature) => (
                                <li key={feature} className="py-3.5 border-b border-[color:var(--line)] text-[16px] text-[color:var(--text-secondary)]">
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <aside className="space-y-14 lg:pt-16 lg:sticky lg:top-24 lg:self-start">
                    <section>
                        <h2 className="text-[13px] font-sans tracking-normal text-[color:var(--text-muted)] mb-4">Built with</h2>
                        <div className="flex flex-wrap gap-2">
                            {techStack.map((tech) => (
                                <span key={tech} className="tag">{tech}</span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[24px] mb-2">Questions or feedback</h2>
                        <p className="text-[15px] mb-6">Bug reports, feature ideas and collaboration requests are all welcome.</p>
                        <ModularContactForm initialType="PROJECT" projectName={name} />
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default ProjectClient;
