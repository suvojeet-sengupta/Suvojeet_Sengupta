'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      await fetch('/api/public/subscribe', {
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
    <div className="fixed bottom-6 right-6 z-50 bg-background border border-brand-orange/30 shadow-2xl rounded-xl p-5 max-w-sm w-[calc(100vw-3rem)] flex items-start gap-4 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-full flex-shrink-0 animate-pulse">
        <Bell size={24} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-primary mb-1">Enable Notifications</h3>
        <p className="text-sm text-secondary mb-4">Get instantly notified when Suvojeet posts new music or blogs!</p>
        <div className="flex gap-2">
          <button 
            onClick={handleSubscribe} 
            disabled={loading}
            className="flex-1 bg-brand-orange text-white text-xs font-bold uppercase tracking-wider py-2 rounded-sm hover:bg-orange-600 transition-colors"
          >
            {loading ? 'Wait...' : 'Subscribe'}
          </button>
          <button 
            onClick={handleDismiss} 
            className="flex-shrink-0 border border-light text-secondary text-xs p-2 rounded-sm hover:bg-tertiary transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
