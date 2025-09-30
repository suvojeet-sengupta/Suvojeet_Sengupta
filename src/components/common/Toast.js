import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-primary text-dark px-6 py-3 rounded-full shadow-lg"
        >
          <p className="font-semibold">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
