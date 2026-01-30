import React from 'react';
import { cn } from '@/lib/utils';

export const Icons = {
    GitHub: ({ className, ...props }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-5 h-5", className)} {...props}>
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
    ),
    YouTube: ({ className, ...props }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-5 h-5", className)} {...props}>
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
    Instagram: ({ className, ...props }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-5 h-5", className)} {...props}>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.116 0-3.478.012-4.696.068-2.453.113-3.638 1.32-3.752 3.752-.056 1.218-.067 1.578-.067 4.696s.011 3.478.067 4.696c.114 2.432 1.299 3.638 3.752 3.752 1.218.056 1.578.067 4.696.067s3.478-.011 4.696-.067c2.453-.114 3.638-1.299 3.752-3.752.056-1.218.067-1.578.067-4.696s-.011-3.478-.067-4.696c-.114-2.432-1.299-3.638-3.752-3.752C15.478 3.977 15.116 3.965 12 3.965zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm6.405-8.573a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" />
        </svg>
    ),
    Facebook: ({ className, ...props }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-5 h-5", className)} {...props}>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    Email: ({ className, ...props }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("w-5 h-5", className)} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    VideoNotFound: ({ className, ...props }) => (
        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" className={cn("w-10 h-10", className)} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    ),
    Watch: ({ className, ...props }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-5 h-5", className)} {...props}>
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
    Share: ({ className, ...props }) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={cn("w-5 h-5", className)} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
    ),
    Description: ({ className, ...props }) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={cn("w-5 h-5", className)} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
    ),
    BrowseAll: ({ className, ...props }) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={cn("w-4 h-4", className)} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    ),
    Calendar: ({ className, ...props }) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={cn("w-4 h-4", className)} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    User: ({ className, ...props }) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={cn("w-4 h-4", className)} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    Play: ({ className, ...props }) => (
        <svg fill="currentColor" viewBox="0 0 20 20" className={cn("w-7 h-7", className)} {...props}>
            <path d="M8 5v10l8-5-8-5z" />
        </svg>
    ),
    ArrowRight: ({ className, ...props }) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={cn("w-4 h-4", className)} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
    ),
    Menu: ({ className, ...props }) => (
        <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" className={cn("w-6 h-6", className)} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
    ),
    Close: ({ className, ...props }) => (
        <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" className={cn("w-6 h-6", className)} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
};
