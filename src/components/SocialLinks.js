import React from 'react';

const SocialLinks = () => {
  return (
    <div className="flex justify-center space-x-6">
      {/* Instagram */}
      <a href="https://www.instagram.com/suvojeet__sengupta?igsh=MWhyMXE4YzhxaDVvNg==" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:opacity-80 transition-opacity duration-300">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="insta-gradient" cx="0.3" cy="1" r="1">
              <stop offset="0" stopColor="#FFD600"/>
              <stop offset="0.5" stopColor="#FF7A00"/>
              <stop offset="1" stopColor="#D62976"/>
            </radialGradient>
          </defs>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.116 0-3.478.012-4.696.068-2.453.113-3.638 1.32-3.752 3.752-.056 1.218-.067 1.578-.067 4.696s.011 3.478.067 4.696c.114 2.432 1.299 3.638 3.752 3.752 1.218.056 1.578.067 4.696.067s3.478-.011 4.696-.067c2.453-.114 3.638-1.299 3.752-3.752.056-1.218.067-1.578.067-4.696s-.011-3.478-.067-4.696c-.114-2.432-1.299-3.638-3.752-3.752C15.478 3.977 15.116 3.965 12 3.965zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm6.405-8.573a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" fill="url(#insta-gradient)"/>
        </svg>
      </a>
      {/* YouTube */}
      <a href="https://youtube.com/@suvojeetsengupta?si=xmXfnPFgxoYOzuzq" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:opacity-80 transition-opacity duration-300">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.502-9.407-.502-9.407-.502s-7.537 0-9.407.502A3.007 3.007 0 00.505 6.205C0 8.075 0 12 0 12s0 3.925.505 5.795a3.007 3.007 0 002.088 2.088c1.87.502 9.407.502 9.407.502s7.537 0 9.407-.502a3.007 3.007 0 002.088-2.088C24 15.925 24 12 24 12s0-3.925-.505-5.795z" fill="#FF0000"/>
          <path d="M9.75 15.3V8.7l6.5 3.3-6.5 3.3z" fill="#FFFFFF"/>
        </svg>
      </a>
      {/* Facebook */}
      <a href="https://www.facebook.com/suvojeetsengupta21" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:opacity-80 transition-opacity duration-300">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z" fill="#1877F2"/>
        </svg>
      </a>
    </div>
  );
};

export default SocialLinks;