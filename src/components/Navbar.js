import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }

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

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const activeLinkStyle = {
    color: '#f9a828',
    fontWeight: '600',
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark/70 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold font-montserrat text-white">
              Suvojeet
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink to="/" className="text-gray-300 hover:text-primary transition-colors duration-300" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Home</NavLink>
            <NavLink to="/about" className="text-gray-300 hover:text-primary transition-colors duration-300" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>About</NavLink>
            <NavLink to="/music" className="text-gray-300 hover:text-primary transition-colors duration-300" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Music</NavLink>
          </div>

          <div className="flex items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-300 hover:text-primary focus:outline-none"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

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
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-700" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-700" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setIsMenuOpen(false)}>About</NavLink>
            <NavLink to="/music" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-700" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setIsMenuOpen(false)}>Music</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;