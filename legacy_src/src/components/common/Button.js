
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Button = ({ to, children, onClick, primary = true, className = '', ...props }) => {
  const buttonClasses = `
    relative overflow-hidden font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg group
    ${primary
      ? 'bg-gradient-to-r from-primary to-primary-dark text-dark hover:shadow-primary/50'
      : 'bg-dark-2 text-white border border-white/10 hover:bg-dark-2/80 hover:border-primary/50'}
    ${className}
  `;

  const motionProps = {
    whileHover: { y: -2, boxShadow: primary ? "0px 10px 20px rgba(249, 168, 40, 0.3)" : "0px 10px 20px rgba(0,0,0,0.2)" },
    whileTap: { scale: 0.95 },
  };

  if (to) {
    return (
      <motion.div {...motionProps}>
        <Link to={to} className={buttonClasses}>
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
