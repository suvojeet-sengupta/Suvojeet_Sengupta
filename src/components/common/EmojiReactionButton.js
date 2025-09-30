import React, { useState } from 'react';
import { socket } from '../socket';
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
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>React</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 flex items-center space-x-2 bg-gray-800 p-2 rounded-full shadow-xl"
          >
            {EMOJIS.map(emoji => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => sendReaction(emoji)}
                className="text-2xl p-1 hover:bg-gray-700 rounded-full transition-colors duration-200"
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
