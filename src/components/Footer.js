import React, { useState, useEffect } from 'react';
import SocialLinks from './SocialLinks';
import { Link } from 'react-router-dom';
import Newsletter from './Newsletter';
import { socket } from '../socket'; // Import the socket instance

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Listen for visitor count updates
    socket.on('update_visitor_count', (data) => {
      setVisitorCount(data.count);
    });

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off('update_visitor_count');
    };
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <Newsletter />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Suvojeet</h3>
            <p className="text-gray-400">
              Musician, Developer, and Content Creator.
            </p>
          </div>
          <div className="mb-6 md:mb-0 text-center">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="flex flex-wrap justify-center md:justify-start space-x-4 sm:space-x-6">
              <li><Link to="/" className="hover:text-gray-300 transition-colors duration-300">Home</Link></li>
              <li><Link to="/about" className="hover:text-gray-300 transition-colors duration-300">About</Link></li>
              <li><Link to="/music" className="hover:text-gray-300 transition-colors duration-300">Music</Link></li>
              <li><Link to="/blog" className="hover:text-gray-300 transition-colors duration-300">Blog</Link></li>
            </ul>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Follow Me</h3>
            <SocialLinks />
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Suvojeet Sengupta. All Rights Reserved.
          </p>
          <div className="flex items-center mt-4 sm:mt-0">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span>{visitorCount} {visitorCount === 1 ? 'visitor' : 'visitors'} online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
