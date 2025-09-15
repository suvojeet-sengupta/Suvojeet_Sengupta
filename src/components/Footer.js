import React from 'react';
import SocialLinks from './SocialLinks';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-2 text-white py-10">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-bold font-montserrat mb-4">Suvojeet Sengupta</h3>
          <p className="text-grey mb-6">Singer | Performer | Composer</p>
          <SocialLinks />
        </div>
        <div className="flex justify-center space-x-6 mb-6">
          <NavLink to="/" className="text-grey hover:text-primary transition-colors duration-300">Home</NavLink>
          <NavLink to="/about" className="text-grey hover:text-primary transition-colors duration-300">About</NavLink>
          <NavLink to="/music" className="text-grey hover:text-primary transition-colors duration-300">Music</NavLink>
        </div>
        <p className="text-sm text-grey">
          &copy; {new Date().getFullYear()} Suvojeet Sengupta. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;