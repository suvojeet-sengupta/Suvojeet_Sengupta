'use client';

import { apiUrl } from '@/lib/api-base';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Replace string with your actual public VAPID key
const PUBLIC_VAPID_KEY = 'BALkX6Mm8qnve2mdG2ZPhth422pULKyehs68v8L0aH57ziTI4jYifwh0vo5MO1WHy7S28RJC1l3bgm6ezbsDxnE';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Check if push messaging is supported
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    // Check existing permissions or local storage denial
    const pushDenied = localStorage.getItem('push_denied') === 'true';
    if (pushDenied || Notification.permission === 'granted' || Notification.permission === 'denied') {
      if (Notification.permission === 'granted') {
        setSubscribed(true);
      }
      return;
    }

    // Wait a few seconds before asking not to annoy immediately
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      });

      // Send to server
      await fetch(apiUrl('/api/public/subscribe'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });

      setSubscribed(true);
      setShowPrompt(false);
    } catch (error) {
      console.error('Failed to subscribe the user: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('push_denied', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt || subscribed) return null;

  return (
    <div
      role="dialog"
      aria-label="Get notified about new posts"
      className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-50 w-[calc(100vw-2.5rem)] max-w-sm p-5 rounded-[8px] bg-[color:var(--bg-elevated)] border border-[color:var(--line-strong)] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[19px] mb-1">Get notified</h3>
          <p className="text-[14px] leading-relaxed">A browser notification when I publish a new post or recording. No email needed.</p>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="p-1 -m-1 text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)] transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={handleSubscribe} disabled={loading} className="btn-solid !py-2 !px-4 !text-[14px] disabled:opacity-60">
          {loading ? 'Enabling…' : 'Turn on'}
        </button>
        <button onClick={handleDismiss} className="btn-outline !py-2 !px-4 !text-[14px]">
          Not now
        </button>
      </div>
    </div>
  );
}
