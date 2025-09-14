
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
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

  return (
    <nav className="relative pt-8">
      <div className="absolute top-5 right-5 z-50">
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none">
          {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
        </button>
      </div>

      <button id="menu-btn" onClick={() => setIsMenuOpen(true)} className="absolute top-5 left-5 z-50 text-gray-800 dark:text-gray-200 focus:outline-none md:hidden">
        <i className="fas fa-bars text-2xl"></i>
      </button>

      {isMenuOpen && (
        <div id="menu-overlay" onClick={() => setIsMenuOpen(false)} className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-30 md:hidden"></div>
      )}

      <div id="mobile-menu" className={`fixed top-0 left-0 w-1/2 h-full bg-gray-900 bg-opacity-95 text-white transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40 md:hidden`}>
        <div className="flex flex-col items-center justify-center h-full">
          <NavLink to="/" className="text-4xl font-bold my-4 hover:text-purple-400 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          <NavLink to="/music" className="text-4xl font-bold my-4 hover:text-purple-400 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Music</NavLink>
          <NavLink to="/about" className="text-4xl font-bold my-4 hover:text-purple-400 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>About</NavLink>
        </div>
        <button id="close-btn" onClick={() => setIsMenuOpen(false)} className="absolute top-5 right-5 text-white focus:outline-none">
          <i className="fas fa-times text-4xl"></i>
        </button>
      </div>

      <div className="hidden md:flex justify-center space-x-4 mb-8">
        <NavLink to="/" className={({ isActive }) => isActive ? "px-4 py-2 font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg transition-all duration-300" : "px-4 py-2 font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"}>Home</NavLink>
        <NavLink to="/music" className={({ isActive }) => isActive ? "px-4 py-2 font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg transition-all duration-300" : "px-4 py-2 font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"}>Music</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "px-4 py-2 font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg transition-all duration-300" : "px-4 py-2 font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"}>About</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
