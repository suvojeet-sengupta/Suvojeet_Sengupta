'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTopButton from '@/components/common/BackToTopButton';
import PushPrompt from '@/components/common/PushPrompt';
import GlobalVisitorCount from '@/components/common/GlobalVisitorCount';
import { useVisitorCount } from '@/hooks/useVisitorCount';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const visitorCount = useVisitorCount();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <BackToTopButton />
      <PushPrompt />
      <GlobalVisitorCount count={visitorCount} />
    </>
  );
}
