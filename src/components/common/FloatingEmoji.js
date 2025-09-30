import React from 'react';
import { motion } from 'framer-motion';

const FloatingEmoji = ({ emoji, onAnimationComplete }) => {
  // Randomize starting position and animation path
  const xStart = Math.random() * 100;
  const xEnd = Math.random() * 100;
  const duration = 3 + Math.random() * 2; // Animate for 3-5 seconds

  return (
    <motion.div
      initial={{ 
        x: `${xStart}%`, 
        y: 0, 
        opacity: 1, 
        scale: 0.5
      }}
      animate={{ 
        x: `${xEnd}%`, 
        y: -300, // Float upwards
        opacity: 0, 
        scale: 1.5,
        rotate: Math.random() * 360 - 180 // Add some spin
      }}
      transition={{
        duration,
        ease: "easeOut"
      }}
      onAnimationComplete={onAnimationComplete}
      className="absolute bottom-0 text-4xl pointer-events-none"
      style={{ zIndex: 1000, left: '-1rem' }} // Position relative to parent
    >
      {emoji}
    </motion.div>
  );
};

export default FloatingEmoji;
