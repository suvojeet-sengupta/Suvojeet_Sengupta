
import React from 'react';
import SocialLinks from './SocialLinks';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center py-10 mt-20 shadow-lg">
      <div className="mb-6">
        <SocialLinks />
      </div>
      <p className="text-sm flex items-center justify-center">
        &copy; {new Date().getFullYear()} Suvojeet Sengupta. Made with{' '}
        <i className="fas fa-heart text-red-500 mx-1 animate-pulse"></i> by Suvojeet. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
