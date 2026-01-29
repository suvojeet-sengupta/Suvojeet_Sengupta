import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, show, type = 'success' }) => {
  const iconMap = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const colorMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-[var(--accent-primary)]',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 ${colorMap[type]} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50`}
        >
          {iconMap[type]}
          <p className="font-medium">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
