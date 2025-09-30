import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoDescriptionModal = ({ video, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (video) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  const handleBlur = (event) => {
    const relatedTarget = event.relatedTarget;
    if (modalRef.current && !modalRef.current.contains(relatedTarget)) {
      // If focus tries to escape, bring it back to the first focusable element
      modalRef.current.focus();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        onClick={onClose}
        onBlur={handleBlur}
      >
        <motion.div
          ref={modalRef}
          tabIndex="-1"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-dark rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-primary mb-4">{video.title}</h2>
          <div className="text-grey text-base max-h-96 overflow-y-auto" style={{ whiteSpace: 'pre-wrap' }}>
            {video.description}
          </div>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-primary text-dark font-bold rounded-lg hover:bg-opacity-80 transition duration-300"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoDescriptionModal;
