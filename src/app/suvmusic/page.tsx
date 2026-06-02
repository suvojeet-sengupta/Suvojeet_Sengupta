import ProjectClient from '@/components/common/ProjectClient';
import { getBreadcrumbJsonLd, getProjectSchema, SEO_CONFIG } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SuvMusic — Android YouTube Music Client | Suvojeet Sengupta',
    description: 'SuvMusic is a high-performance YouTube Music client for Android built with Kotlin & Jetpack Compose. 200+ GitHub stars. Built by Suvojeet Sengupta.',
    keywords: ['SuvMusic', 'SuvMusic app', 'YouTube Music Android', 'Kotlin music app', 'Suvojeet Sengupta SuvMusic', 'open source music player Android'],
    alternates: { canonical: `${SEO_CONFIG.url}/suvmusic` },
    openGraph: {
        title: 'SuvMusic — Android YouTube Music Client',
        description: 'High-performance YouTube Music client for Android. 200+ GitHub stars. Built with Kotlin & Media3.',
        url: `${SEO_CONFIG.url}/suvmusic`,
        type: 'website',
        images: [{ url: '/suvojeet.jpg', width: 1200, height: 630, alt: 'SuvMusic by Suvojeet Sengupta' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SuvMusic — Android YouTube Music Client',
        description: 'High-performance YouTube Music client for Android. 200+ GitHub stars.',
        creator: SEO_CONFIG.twitterHandle,
    },
};

export default function SuvMusicPage() {
    const breadcrumb = getBreadcrumbJsonLd([
        { name: 'Home', item: '/' },
        { name: 'SuvMusic', item: '/suvmusic' },
    ]);

    const projectSchema = getProjectSchema(
        "SuvMusic",
        "A high-performance YouTube Music client built with Kotlin, featuring seamless streaming and advanced media handling.",
        `${SEO_CONFIG.url}/suvmusic`,
        { githubUrl: "https://github.com/suvojeet-sengupta/SuvMusic", operatingSystem: "Android" }
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
                name="SuvMusic"
            description="A high-performance YouTube Music client built with Kotlin, featuring seamless streaming and advanced media handling."
            longDescription="SuvMusic is a native Android application designed for a premium music streaming experience. It focuses on performance, minimalist design, and deep integration with Android's media capabilities. Built entirely in Kotlin, it demonstrates advanced use of modern Android libraries to deliver a smooth, high-fidelity audio experience."
            features={[
                "Seamless High-Quality Streaming",
                "Advanced Media3 Integration",
                "Background Playback & Notification Controls",
                "Dynamic Material You Theming",
                "Smart Offline Caching",
                "Lightweight & Battery Efficient",
                "Custom Playlists & Library Management",
                "Ad-free Experience Architecture"
            ]}
            techStack={[
                "Kotlin",
                "Jetpack Compose",
                "Media3 / ExoPlayer",
                "Coroutines & Flow",
                "Retrofit",
                "Room Database",
                "Hilt Dependency Injection",
                "MVVM Architecture"
            ]}
            githubUrl="https://github.com/suvojeet-sengupta/SuvMusic"
            repo="suvojeet-sengupta/SuvMusic"
            stats={[
                { label: "Language", value: "Kotlin" },
                { label: "Version", value: "v2.2.2.0" },
                { label: "Platform", value: "Android" },
                { label: "Status", value: "Active" }
            ]}
        />
        </>
    );
}
