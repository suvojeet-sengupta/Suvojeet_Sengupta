'use client';

import React from 'react';
import BackToTopButton from '@/components/common/BackToTopButton';
import PushPrompt from '@/components/common/PushPrompt';
import GlobalVisitorCount from '@/components/common/GlobalVisitorCount';
import { useVisitorCount } from '@/hooks/useVisitorCount';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const visitorCount = useVisitorCount();

  return (
    <>
      {children}
      <BackToTopButton />
      <PushPrompt />
      <GlobalVisitorCount count={visitorCount} />
    </>
  );
}
