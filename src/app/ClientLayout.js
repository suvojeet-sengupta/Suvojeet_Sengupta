"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlobalVisitorCount from '@/components/common/GlobalVisitorCount';
import BackToTopButton from '@/components/common/BackToTopButton';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { socket } from '@/services/socket';

export default function ClientLayout({ children }) {
    const [visitorCount, setVisitorCount] = useState(0);

    useEffect(() => {
        socket.on('update_visitor_count', (data) => {
            setVisitorCount(data.count);
        });

        return () => {
            socket.off('update_visitor_count');
        };
    }, []);

    return (
        <ThemeProvider>
            <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
                <Navbar />
                <GlobalVisitorCount count={visitorCount} />
                <BackToTopButton />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer visitorCount={visitorCount} />
            </div>
        </ThemeProvider>
    );
}
