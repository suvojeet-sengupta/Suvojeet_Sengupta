export interface Experience {
    id: string;
    role: string;
    company: string;
    period: string;
    icon: string;
    color?: string;
    description: string;
    details: string[];
    skills: string[];
    link?: string;
    linkLabel?: string;
}

export const experiences: Experience[] = [
    {
        id: "dishtv",
        role: "Customer Care Freelancer (Inbound Voice Process)",
        company: "DishTV India",
        period: "2024 - Present",
        icon: "📞",
        description: "Managed inbound customer calls for DishTV India's voice process, providing expert technical support and troubleshooting for DTH services while leveraging AI tools to enhance efficiency.",
        details: [
            "Handled inbound voice calls for DTH services, set-top boxes, and signal issues with professional communication",
            "Provided step-by-step technical troubleshooting for dish alignment, receiver setup, and channel packaging",
            "Resolved billing queries, subscription renewals, and package upgrade/downgrade requests",
            "Utilized AI-powered tools for faster query resolution and improved response time",
            "Maintained high customer satisfaction rates with minimal escalations to senior support",
            "Documented all interactions in CRM systems for future reference and quality assurance",
            "Applied AI-driven insights to predict common issues and proactively guide customers"
        ],
        skills: [
            "Customer Communication",
            "Technical Troubleshooting",
            "CRM Systems",
            "Conflict Resolution",
            "Active Listening",
            "Service Recovery",
            "Problem Solving",
            "Time Management"
        ]
    },
    {
        id: "gogig",
        role: "Software Developer Intern",
        company: "Gogig",
        period: "2026 - Present",
        icon: "💻",
        color: "brand-orange",
        description: "Currently honing my craft at Gogig, working on full-stack development and AI-driven automation workflows.",
        details: [
            "Developing and maintaining full-stack applications using modern frameworks",
            "Building AI-driven automation workflows to streamline business processes",
            "Collaborating with cross-functional teams to deliver scalable solutions",
            "Implementing clean code practices and architectural patterns",
            "Participating in code reviews and technical discussions",
            "Learning and applying industry best practices in a professional environment"
        ],
        skills: [
            "Full-Stack Development",
            "AI Automation",
            "React & Next.js",
            "Node.js & Express",
            "Database Management",
            "Git & Version Control",
            "Agile Methodology",
            "API Design"
        ],
        link: "https://gogig.tech",
        linkLabel: "gogig.tech"
    },
    {
        id: "sky-rom",
        role: "Custom ROM Maintainer (sky)",
        company: "Open Source Community",
        period: "2023 - Present",
        icon: "📱",
        description: "Official maintainer for the 'sky' custom ROM serving Redmi 12 5G / Poco M6 Pro 5G community.",
        details: [
            "Maintaining and optimizing the 'sky' custom ROM for multiple device variants",
            "Building and testing Android AOSP-based ROMs with custom modifications",
            "Fixing bugs, optimizing performance, and ensuring device stability",
            "Managing GitHub repositories and coordinating with other developers",
            "Providing technical support to ROM users in community forums",
            "Implementing kernel-level optimizations for better battery life and performance"
        ],
        skills: [
            "Android AOSP",
            "Kernel Development",
            "Device Trees",
            "GitHub & Git Workflows",
            "Linux & Bash Scripting",
            "Performance Optimization",
            "Community Support",
            "Open Source Collaboration"
        ],
        link: "https://github.com/suvojeet-sengupta",
        linkLabel: "GitHub Profile"
    },
    {
        id: "music",
        role: "Vocalist & Musician",
        company: "Freelance Artist",
        period: "Ongoing",
        icon: "🎤",
        description: "Soulful Hindi and Bengali vocalist bringing emotion and authenticity to every performance.",
        details: [
            "Performing Hindi and Bengali songs across various genres and moods",
            "Trained in classical techniques with influences from Arijit Singh, Kishore Kumar, and Lata Mangeshkar",
            "Creating original compositions blending traditional and contemporary styles",
            "Utilizing modern audio technology for recording and production",
            "Building a growing audience through digital platforms",
            "Collaborating with other artists for musical projects"
        ],
        skills: [
            "Hindi & Bengali Vocals",
            "Classical Training",
            "Emotional Storytelling",
            "Audio Production",
            "Music Technology",
            "Live Performance",
            "Content Creation",
            "Artistic Collaboration"
        ]
    },
    {
        id: "web-dev",
        role: "Creative Web Developer",
        company: "Personal & Freelance Projects",
        period: "2020 - Present",
        icon: "🌐",
        description: "Building beautiful, responsive web applications with a focus on user experience and modern design.",
        details: [
            "Developing responsive web applications using Next.js, React, and TypeScript",
            "Creating stunning UI/UX designs with Tailwind CSS and Framer Motion",
            "Building portfolio websites, landing pages, and web tools",
            "Implementing responsive design principles for cross-device compatibility",
            "Integrating APIs and third-party services for enhanced functionality",
            "Deploying applications on platforms like Vercel, Netlify, and Cloudflare Pages"
        ],
        skills: [
            "Next.js & React",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "RESTful APIs",
            "Responsive Design",
            "Performance Optimization",
            "Deployment & CI/CD"
        ]
    }
];

export const education = {
    institution: "Current Studies",
    degree: "Pursuing Higher Education",
    details: "Balancing academics with professional development in technology and music."
};

export const summary = "Singer, Creative Developer & AI Enthusiast. Born in Asansol, West Bengal, currently based in Dhanbad, Jharkhand. Born on 1st August 2005, I find balance between the precision of code and the raw emotion of music. Currently interning at Gogig while maintaining the 'sky' custom ROM ecosystem. Passionate about leveraging AI technologies to enhance productivity and drive innovation across all domains.";
