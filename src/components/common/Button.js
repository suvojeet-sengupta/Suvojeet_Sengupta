
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Button = ({ to, children, onClick, primary = true, className = '' }) => {
  const buttonClasses = `
    font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg
    ${primary ? 'bg-primary text-dark hover:bg-primary-dark' : 'bg-gray-700 text-white hover:bg-gray-600'}
    ${className}
  `;

  const motionProps = {
    whileHover: { y: -2, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" },
    whileTap: { scale: 0.95 },
  };

  if (to) {
    return (
      <motion.div {...motionProps}>
        <Link href={to} className={buttonClasses}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button onClick={onClick} className={buttonClasses} {...motionProps}>
      {children}
    </motion.button>
  );
};

export default Button;
