"use client";

import React from 'react';
import { motion } from 'framer-motion';

import { socialLinks } from '@/data/config';
import { Icons } from '@/components/common/Icons';

const SocialLinks = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: { icon: "w-5 h-5", button: "w-10 h-10" },
    default: { icon: "w-5 h-5", button: "w-11 h-11" },
    medium: { icon: "w-5 h-5", button: "w-11 h-11" },
    large: { icon: "w-6 h-6", button: "w-12 h-12" },
  };

  const { icon: iconSize, button: buttonSize } = sizeClasses[size] || sizeClasses.default;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`flex items-center justify-center gap-3 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {socialLinks.map((link) => {
        const IconComponent = Icons[link.icon];
        return (
          <motion.a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonSize} rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] flex items-center justify-center transition-all duration-300 ${link.color} hover:text-white hover:shadow-lg`}
            variants={itemVariants}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            aria-label={link.name}
          >
            {IconComponent && <IconComponent className={iconSize} />}
          </motion.a>
        );
      })}
    </motion.div>
  );
};

export default SocialLinks;