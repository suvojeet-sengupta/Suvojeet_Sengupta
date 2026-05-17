'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Vinyl from './Vinyl';

const VinylSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Vinyl nowPlaying="Tum Hi Ho (Cover)" />
    </motion.div>
  );
};

export default VinylSection;
