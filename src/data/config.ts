import config from '../config';

export const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/music', label: 'Music' },
];

export const socialLinks = [
    {
        name: 'GitHub',
        href: 'https://github.com/suvojeet-sengupta',
        icon: 'GitHub',
        color: 'hover:bg-gray-700',
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/suvojeet__sengupta',
        icon: 'Instagram',
        color: 'hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500',
    },
    {
        name: 'Facebook',
        href: 'https://www.facebook.com/suvojeetsengupta21',
        icon: 'Facebook',
        color: 'hover:bg-blue-600',
    },
    {
        name: 'Email',
        href: 'mailto:suvojeetsengupta@zohomail.in',
        icon: 'Email',
        color: 'hover:bg-[var(--accent-primary)]',
    },
];

export const siteConfig = {
    title: "Suvojeet Sengupta | Vibe Architect & Soulful Singer",
    description: "Official portfolio of Suvojeet Sengupta. Soulful Singer and Vibe Architect building high-performance logic-driven systems with AI.",
    formSubmitUrl: config.formSubmitUrl,
};
