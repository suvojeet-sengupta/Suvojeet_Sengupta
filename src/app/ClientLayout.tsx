'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import BackToTopButton from '@/components/common/BackToTopButton';
import PushPrompt from '@/components/common/PushPrompt';
import GlobalVisitorCount from '@/components/common/GlobalVisitorCount';
import ScrollProgress from '@/components/layout/ScrollProgress';
import PageTransition from '@/components/layout/PageTransition';
import { useVisitorCount } from '@/hooks/useVisitorCount';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const visitorCount = useVisitorCount();
  const pathname = usePathname();

  return (
    <>
      <ScrollProgress />
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={pathname}>
          {children}
        </PageTransition>
      </AnimatePresence>
      <BackToTopButton />
      <PushPrompt />
      <GlobalVisitorCount count={visitorCount} />
    </>
  );
}
