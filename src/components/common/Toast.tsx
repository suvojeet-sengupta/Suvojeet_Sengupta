import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  show: boolean;
  type?: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ message, show, type = 'success' }) => {
  const iconMap = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const colorMap = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-brand-orange',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-10 left-1/2 -translate-x-1/2 ${colorMap[type]} text-white px-6 py-3 rounded-sm shadow-2xl flex items-center gap-3 z-50 border border-white/10`}
        >
          {iconMap[type]}
          <p className="font-black uppercase tracking-widest text-xs">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
