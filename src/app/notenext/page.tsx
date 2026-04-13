import ProjectClient from '@/components/common/ProjectClient';

export const metadata = {
    title: 'NoteNext | Suvojeet Sengupta',
    description: 'A modern, intuitive note-taking application built with native Android best practices.',
};

export default function NoteNextPage() {
    return (
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
    );
}
