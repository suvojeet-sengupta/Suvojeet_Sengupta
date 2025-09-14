
import React from 'react';

const Music = () => {
  return (
    <div>
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-center py-12 relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative">
          <h1 className="text-5xl font-bold">Music Collection</h1>
          <p className="mt-4 text-lg">Explore the melodies and stories behind the songs.</p>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto p-8">
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg">Music functionality is currently disabled.</p>
      </main>

      <footer className="bg-gray-800 text-white text-center py-8 mt-16">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://www.instagram.com/suvojeet__sengupta?igsh=MWhyMXE4YzhxaDVvNg==" className="hover:text-purple-400 transition-colors duration-300"><i className="fab fa-instagram fa-2x"></i></a>
          <a href="https://youtube.com/@suvojeetsengupta?si=xmXfnPFgxoYOzuzq" className="hover:text-purple-400 transition-colors duration-300"><i className="fab fa-youtube fa-2x"></i></a>
          <a href="https://www.facebook.com/suvojeetsengupta21" className="hover:text-purple-400 transition-colors duration-300"><i className="fab fa-facebook fa-2x"></i></a>
        </div>
        <p>&copy; 2025 Suvojeet Sengupta. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Music;
