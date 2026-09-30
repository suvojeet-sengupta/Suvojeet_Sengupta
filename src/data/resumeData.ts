export interface Experience {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
    details: string[];
    skills: string[];
    link?: string;
    linkLabel?: string;
}

export const experiences: Experience[] = [
    {
        id: "gogig",
        role: "Software Developer Intern",
        company: "Gogig",
        period: "2026 – Present",
        description: "Full-stack and backend development on Gogig's products, working inside a professional team.",
        details: [
            "Develop and maintain full-stack features using modern frameworks",
            "Build backend APIs and automation workflows that streamline business processes",
            "Take part in code reviews and technical discussions",
            "Apply clean code practices and established architectural patterns"
        ],
        skills: ["Node.js", "NestJS", "React", "Next.js", "API design", "Databases", "Git"],
        link: "https://gogig.tech",
        linkLabel: "gogig.tech"
    },
    {
        id: "sky-rom",
        role: "Custom ROM Maintainer (sky)",
        company: "Open source",
        period: "2023 – Present",
        description: "Maintainer of a custom ROM for the Redmi 12 5G / Poco M6 Pro 5G community.",
        details: [
            "Build and test AOSP-based ROMs with device-specific modifications",
            "Fix bugs and stability issues across device variants",
            "Apply kernel-level changes for battery life and performance",
            "Manage the GitHub repositories and support users in community forums"
        ],
        skills: ["Android AOSP", "Kernel", "Device trees", "Linux", "Bash", "Git"],
        link: "https://github.com/suvojeet-sengupta",
        linkLabel: "GitHub"
    },
    {
        id: "web-dev",
        role: "Web & Android Developer",
        company: "Personal projects",
        period: "2020 – Present",
        description: "Designing, building and shipping my own apps and websites, including SuvMusic, NoteNext and this site.",
        details: [
            "SuvMusic: YouTube Music client for Android in Kotlin and Jetpack Compose, 290+ stars on GitHub",
            "NoteNext: offline-first Android notes app with biometric lock",
            "suvojeetsengupta.in: Next.js front end on Cloudflare Pages with a NestJS API running in Docker on a VPS",
            "Deploy and operate everything myself, from DNS and tunnels to databases"
        ],
        skills: ["Kotlin", "Jetpack Compose", "TypeScript", "Next.js", "NestJS", "Docker", "Cloudflare"]
    },
    {
        id: "music",
        role: "Vocalist",
        company: "Independent",
        period: "Ongoing",
        description: "Hindi and Bengali vocalist recording covers and performing live.",
        details: [
            "Perform Hindi and Bengali songs across classic and modern repertoire",
            "Influenced by Kishore Kumar, Lata Mangeshkar and Arijit Singh",
            "Record and publish covers on YouTube",
            "Working toward original releases"
        ],
        skills: ["Hindi vocals", "Bengali vocals", "Live performance", "Recording"]
    },
    {
        id: "dishtv",
        role: "Customer Care Associate (Inbound Voice)",
        company: "DishTV India",
        period: "2024 – Present",
        description: "Inbound voice support for DishTV's DTH customers.",
        details: [
            "Troubleshoot set-top box, signal and dish alignment issues over the phone",
            "Resolve billing, renewal and package change requests",
            "Record every interaction in the CRM for follow-up and quality review"
        ],
        skills: ["Customer communication", "Technical troubleshooting", "CRM"]
    }
];

export const summary = "Software developer and vocalist based in Dhanbad, India. Software developer intern at Gogig, focused on backend development with Node.js and NestJS, with a background in Android (Kotlin, Jetpack Compose, AOSP). Built SuvMusic (290+ GitHub stars) and NoteNext, and runs this site on a self-hosted NestJS API. Also a Hindi and Bengali vocalist who records and performs.";
