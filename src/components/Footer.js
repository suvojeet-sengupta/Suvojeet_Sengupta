
import React from 'react';
import SocialLinks from './SocialLinks';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-8 mt-16">
      <div className="mb-4">
        <SocialLinks />
      </div>
      <p>&copy; {new Date().getFullYear()} Suvojeet Sengupta. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
