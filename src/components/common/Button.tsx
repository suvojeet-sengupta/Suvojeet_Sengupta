import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import styles from './UI.module.css';

interface ButtonProps {
  to?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  primary?: boolean;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  size?: 'small' | 'default' | 'large';
}

const Button: React.FC<ButtonProps> = ({
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
    "font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    sizeClasses[size] || sizeClasses.default,
    className
  );

  const variantClass = primary ? styles.btnSolid : styles.btnOutline;

  const motionProps = {
    whileHover: disabled ? {} : { y: -1 },
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
          className={cn(baseClasses, variantClass)}
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
      className={cn(baseClasses, variantClass)}
      disabled={disabled}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
};

export default Button;
