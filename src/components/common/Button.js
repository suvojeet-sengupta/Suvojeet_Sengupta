import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Button = ({
  to,
  children,
  onClick,
  primary = true,
  className = '',
  disabled = false,
  type = 'button',
  icon = null,
  size = 'default'
}) => {
  const sizeClasses = {
    small: 'py-2 px-4 text-sm',
    default: 'py-3 px-6',
    large: 'py-4 px-8 text-lg',
  };

  const baseClasses = cn(
    "font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    sizeClasses[size] || sizeClasses.default,
    className
  );

  const variantClasses = primary
    ? 'btn-primary'
    : 'btn-secondary';

  const motionProps = {
    whileHover: disabled ? {} : { y: -2, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" },
    whileTap: disabled ? {} : { scale: 0.98 },
  };

  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </>
  );

  if (to) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link
          href={to}
          className={cn(baseClasses, variantClasses)}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={cn(baseClasses, variantClasses)}
      disabled={disabled}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
};

export default Button;
