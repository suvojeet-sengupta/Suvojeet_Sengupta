import React, { useState } from 'react';
import { socket } from '../../services/socket';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJIS = ['❤️', '👍', '🔥', '😂', '😮'];

const EmojiReactionButton = ({ room }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sendReaction = (emoji) => {
    socket.emit('send_reaction', { room, emoji });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="btn-primary flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>React</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full mb-3 flex items-center gap-2 p-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-[var(--shadow-xl)] backdrop-blur-md"
          >
            {EMOJIS.map(emoji => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.25, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => sendReaction(emoji)}
                className="text-2xl w-10 h-10 flex items-center justify-center rounded-full transition-colors"
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmojiReactionButton;
