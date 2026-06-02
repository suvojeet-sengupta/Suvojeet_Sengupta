import ProjectClient from '@/components/common/ProjectClient';
import { getBreadcrumbJsonLd, getProjectSchema, SEO_CONFIG } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'NoteNext — Offline Android Notes App | Suvojeet Sengupta',
    description: 'NoteNext is an offline-first note-taking Android app with biometric privacy, rich text editing, and zero cloud dependency. Built by Suvojeet Sengupta.',
    keywords: ['NoteNext', 'NoteNext app', 'offline notes Android', 'biometric notes app', 'Suvojeet Sengupta NoteNext', 'Kotlin note app', 'open source notes Android'],
    alternates: { canonical: `${SEO_CONFIG.url}/notenext` },
    openGraph: {
        title: 'NoteNext — Offline Android Notes App',
        description: 'Offline-first note-taking app with biometric privacy. Built with Kotlin & Jetpack Compose.',
        url: `${SEO_CONFIG.url}/notenext`,
        type: 'website',
        images: [{ url: '/suvojeet.jpg', width: 1200, height: 630, alt: 'NoteNext by Suvojeet Sengupta' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NoteNext — Offline Android Notes App',
        description: 'Offline-first note-taking app with biometric privacy.',
        creator: SEO_CONFIG.twitterHandle,
    },
};

export default function NoteNextPage() {
    const breadcrumb = getBreadcrumbJsonLd([
        { name: 'Home', item: '/' },
        { name: 'NoteNext', item: '/notenext' },
    ]);

    const projectSchema = getProjectSchema(
        "NoteNext",
        "A modern, intuitive note-taking application built with native Android best practices and offline-first architecture.",
        "https://suvojeetsengupta.in/notenext"
    );

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
            />
            <ProjectClient 
                name="NoteNext"
            description="A modern, intuitive note-taking application built with native Android best practices and offline-first architecture."
            longDescription="NoteNext is designed for those who value speed and privacy in their note-taking workflow. It follows an offline-first approach, ensuring that your data is always accessible even without an internet connection. The app focuses on a 'no-distraction' interface while providing powerful organization tools underneath."
            story="I created NoteNext because I needed a note-taking tool that was as fast as my thoughts. Most apps were either too bloated or required a constant internet connection. I wanted something that was offline-first, private, and followed the 'Zen' of simplicity. It's a reflection of my philosophy: build things that are fast, clean, and intuitive."
            features={[
                "Offline-First Architecture",
                "Biometric Privacy Lock",
                "Rich Text Editing Support",
                "Smart Categorization & Tags",
                "Instant Full-Text Search",
                "Clean Minimalist UI",
                "Auto-save & Version History",
                "Dark Mode & Custom Themes"
            ]}
            techStack={[
                "Kotlin",
                "Jetpack Compose",
                "Room (Local Storage)",
                "DataStore (Preferences)",
                "Hilt (DI)",
                "ViewModel & LiveData",
                "Kotlin Serialization",
                "Navigation Component"
            ]}
            githubUrl="https://github.com/suvojeet-sengupta/NoteNext"
            stats={[
                { label: "Language", value: "Kotlin" },
                { label: "Architecture", value: "Clean/MVVM" },
                { label: "Storage", value: "Local SQLite" },
                { label: "UI", value: "Compose" }
            ]}
        />
        </>
    );
}
