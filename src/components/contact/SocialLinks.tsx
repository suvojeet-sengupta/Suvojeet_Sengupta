"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { socialLinks } from '@/data/config';
import { Icons } from '@/components/common/Icons';

interface SocialLinksProps {
  className?: string;
  size?: 'small' | 'default' | 'medium' | 'large';
}

const SocialLinks: React.FC<SocialLinksProps> = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: { icon: "w-5 h-5", button: "w-10 h-10" },
    default: { icon: "w-5 h-5", button: "w-11 h-11" },
    medium: { icon: "w-5 h-5", button: "w-11 h-11" },
    large: { icon: "w-6 h-6", button: "w-12 h-12" },
  };

  const { icon: iconSize, button: buttonSize } = sizeClasses[size] || sizeClasses.default;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { ease: "easeOut" }
    },
  };

  return (
    <motion.div
      className={`flex items-center justify-center gap-3 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {socialLinks.map((link) => {
        // @ts-ignore
        const IconComponent = Icons[link.icon];
        return (
          <motion.a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonSize} rounded-sm bg-tertiary text-secondary flex items-center justify-center transition-all duration-300 border border-light hover:bg-brand-orange hover:text-white hover:border-brand-orange hover:shadow-lg`}
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
