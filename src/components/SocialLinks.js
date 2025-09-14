
import React from 'react';

const SocialLinks = () => {
  return (
    <div className="flex justify-center space-x-6">
      <a href="https://www.instagram.com/suvojeet__sengupta?igsh=MWhyMXE4YzhxaDVvNg==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
        <i className="fab fa-instagram fa-2x"></i>
      </a>
      <a href="https://youtube.com/@suvojeetsengupta?si=xmXfnPFgxoYOzuzq" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
        <i className="fab fa-youtube fa-2x"></i>
      </a>
      <a href="https://www.facebook.com/suvojeetsengupta21" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
        <i className="fab fa-facebook fa-2x"></i>
      </a>
    </div>
  );
};

export default SocialLinks;
