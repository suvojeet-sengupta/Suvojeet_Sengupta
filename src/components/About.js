
import React from 'react';
import suvojeet from '../assets/suvojeet.jpg';

const About = () => {
  return (
    <div>
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-center py-12 relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative">
          <h1 className="text-5xl font-bold">About Me</h1>
          <p className="mt-4 text-lg">The story behind the music.</p>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto p-8">
        {/* Introduction Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
            <div className="md:col-span-1">
              <img src={suvojeet} alt="Suvojeet Sengupta" className="rounded-lg shadow-lg w-full h-auto mx-auto" />
            </div>
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Hi, I’m Suvojeet Sengupta – a passionate singer, performer, and music enthusiast from India. Music has been a part of my life since childhood, and I believe it’s the purest way to connect with people’s hearts. Whether it’s performing live, recording covers, or experimenting with new compositions, I always try to bring emotions alive through melodies.
              </p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* My Musical Journey */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Musical Journey</h3>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li><strong>🎤 Inspiration:</strong> Inspired deeply by Arijit Singh, I admire his ability to blend soul with simplicity. While I look up to him, I’ve developed my own unique style that reflects my personality and emotions.</li>
              <li><strong>🌍 Languages:</strong> I enjoy singing in Hindi and Bengali, and I often explore songs across genres to challenge myself as an artist.</li>
              <li><strong>📺 YouTube Journey:</strong> I also share my music through my YouTube channel – Suvojeet Sengupta, where I upload covers and performances to reach a wider audience.</li>
            </ul>
          </div>

          {/* Beyond Music */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Beyond Music</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Apart from music, I’m pursuing my Bachelor’s in History Honours with a Minor in Political Science. Balancing academics and passion hasn’t always been easy, but it has shaped me into someone disciplined and focused.
            </p>
          </div>
        </div>

        {/* Vision & Fun Facts Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Vision */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Vision</h3>
            <p className="text-gray-600 dark:text-gray-300">
              For me, music is not just about singing—it’s about creating an emotional connection. My dream is to continue growing as an artist, perform on bigger stages, and create original music that inspires people the same way music inspires me.
            </p>
          </div>
          {/* Fun Facts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Fun Facts</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc list-inside">
              <li>First stage performance at a young age built my confidence.</li>
              <li>A history student who finds stories not only in books but also in songs.</li>
              <li>Coffee + Music = My perfect creative combo.</li>
            </ul>
          </div>
        </div>
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

export default About;
