
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTopButton from '../common/BackToTopButton';
import { motion } from 'framer-motion';

// Simplified variants for a simple fade
const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

// Shorter and simpler transition
const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3, // Reduced duration
};

/**
 * The main layout component for the application.
 * It includes the Navbar, the main content area (using Outlet), and the Footer.
 */
const Layout = ({ visitorCount }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main
        className="flex-grow"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Outlet />
      </motion.main>
      <Footer visitorCount={visitorCount} />
      <BackToTopButton />
    </div>
  );
};

export default Layout;
