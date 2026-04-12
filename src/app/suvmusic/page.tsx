import ProjectClient from '@/components/common/ProjectClient';

export const metadata = {
    title: 'SuvMusic | Suvojeet Sengupta',
    description: 'A high-performance YouTube Music client built with Kotlin.',
};

export default function SuvMusicPage() {
    return (
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
            stats={[
                { label: "Language", value: "Kotlin" },
                { label: "Version", value: "v2.2.2.0" },
                { label: "Platform", value: "Android" },
                { label: "Status", value: "Active" }
            ]}
        />
    );
}
