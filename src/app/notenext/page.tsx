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
