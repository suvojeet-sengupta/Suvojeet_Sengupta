import React from 'react';
import SocialLinks from './SocialLinks';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-bold mb-4">Suvojeet</h3>
            <p className="text-gray-400">
              Musician, Developer, and Content Creator.
            </p>
          </div>
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-gray-300 transition-colors duration-300">Home</Link></li>
              <li><Link to="/about" className="hover:text-gray-300 transition-colors duration-300">About</Link></li>
              <li><Link to="/music" className="hover:text-gray-300 transition-colors duration-300">Music</Link></li>
              <li><Link to="/blog" className="hover:text-gray-300 transition-colors duration-300">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Me</h3>
            <SocialLinks />
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Suvojeet Sengupta. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;