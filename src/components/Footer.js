import React from 'react';
import SocialLinks from './SocialLinks';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-10">
      <div className="container mx-auto">
        <div className="mb-6">
          <SocialLinks />
        </div>
        <p className="text-sm text-grey">
          &copy; {new Date().getFullYear()} Suvojeet Sengupta. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;