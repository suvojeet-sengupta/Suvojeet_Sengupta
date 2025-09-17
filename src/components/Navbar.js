import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const activeLinkStyle = {
    color: '#f9a828',
    fontWeight: '600',
  };

  const navVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const mobileMenuVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const NavLinkMotion = ({ to, children, style, onClick }) => (
    <motion.div whileHover={{ scale: 1.1, color: '#f9a828' }} transition={{ duration: 0.2 }}>
      <NavLink to={to} className="text-gray-300 transition-colors duration-300" style={style} onClick={onClick}>
        {children}
      </NavLink>
    </motion.div>
  );

  return (
    <motion.nav
      variants={navVariants}
      initial="initial"
      animate="animate"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark/70 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <NavLink to="/" className="text-2xl font-bold font-montserrat text-white">
              Suvojeet
            </NavLink>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLinkMotion to="/" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>Home</NavLinkMotion>
            <NavLinkMotion to="/about" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>About</NavLinkMotion>
            <NavLinkMotion to="/music" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>Music</NavLinkMotion>
            <NavLinkMotion to="/blog" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>Blog</NavLinkMotion>
          </div>

          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-300 hover:text-primary focus:outline-none"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-700" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
              <NavLink to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-700" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setIsMenuOpen(false)}>About</NavLink>
              <NavLink to="/music" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-700" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setIsMenuOpen(false)}>Music</NavLink>
              <NavLink to="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-700" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setIsMenuOpen(false)}>Blog</NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;