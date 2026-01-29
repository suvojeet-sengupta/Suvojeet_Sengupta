import React from 'react';
import SocialLinks from '../contact/SocialLinks';
import { Link } from 'react-router-dom';
import Newsletter from '../contact/Newsletter';
import LiveIndicator from '../common/LiveIndicator';

const Footer = ({ visitorCount }) => {

  return (
    <footer className="bg-gray-900 text-white">
      <Newsletter />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Suvojeet</h3>
            <p className="text-gray-400">
              Singer, Developer, and Content Creator.
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
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Suvojeet Sengupta. All Rights Reserved.
          </p>
          <p className="text-sm mt-4 sm:mt-0">
            Designed & Built by{' '}
            <a
              href="https://github.com/suvojeet-sengupta"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Suvojeet Sengupta
            </a>
          </p>
          <div className="md:hidden mt-4 sm:mt-0">
            {visitorCount > 0 && <LiveIndicator count={visitorCount} text={visitorCount === 1 ? 'visitor online' : 'visitors online'} />}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
