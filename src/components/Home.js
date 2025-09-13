
import React from 'react';
import { Link } from 'react-router-dom';
import suvojeet from '../assets/suvojeet.jpg';

const Home = () => {
  return (
    <main className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden md:flex">
      {/* Left Column */}
      <div className="md:w-1/3 p-8 bg-gradient-to-b from-purple-600 to-indigo-700 text-white flex flex-col items-center justify-center slide-in-left">
        <img className="w-32 h-32 rounded-full border-4 border-white shadow-lg" src={suvojeet} alt="Suvojeet Sengupta" />
        <h1 className="text-3xl font-bold mt-4 text-center">Suvojeet Sengupta</h1>
        <p className="text-indigo-200 text-center mt-2">🎤 Singer | Performer | Composer</p>
        <div className="mt-4 text-center text-sm text-indigo-100">
          <p>✨ Introvert, but music makes me shine</p>
          <p>🎶 Living my childhood dream – where words turn into melodies & emotions into magic.</p>
        </div>
      </div>

      {/* Right Column */}
      <div className="md:w-2/3 p-8 slide-in-right">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">Follow Me</h2>
        <div className="space-y-5">
          <a href="https://www.instagram.com/suvojeet__sengupta?igsh=MWhyMXE4YzhxaDVvNg==" className="group flex items-center w-full px-6 py-4 font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-300 hover:shadow-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white">
            <i className="fab fa-instagram text-3xl text-purple-500 group-hover:text-white transition-colors duration-300"></i>
            <div className="ml-4 flex-grow">
              <span className="block text-lg">Instagram</span>
              <span className="block text-sm text-gray-500 dark:text-gray-400 group-hover:text-white">@suvojeet__sengupta</span>
            </div>
            <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
          </a>
          <a href="https://youtube.com/@suvojeetsengupta?si=xmXfnPFgxoYOzuzq" className="group flex items-center w-full px-6 py-4 font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-300 hover:shadow-lg hover:bg-red-600 hover:text-white">
            <i className="fab fa-youtube text-3xl text-red-500 group-hover:text-white transition-colors duration-300"></i>
            <div className="ml-4 flex-grow">
              <span className="block text-lg">YouTube</span>
              <span className="block text-sm text-gray-500 dark:text-gray-400 group-hover:text-white">@suvojeetsengupta</span>
            </div>
            <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
          </a>
          <a href="https://www.facebook.com/suvojeetsengupta21" className="group flex items-center w-full px-6 py-4 font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-300 hover:shadow-lg hover:bg-blue-600 hover:text-white">
            <i className="fab fa-facebook text-3xl text-blue-500 group-hover:text-white transition-colors duration-300"></i>
            <div className="ml-4 flex-grow">
              <span className="block text-lg">Facebook</span>
              <span className="block text-sm text-gray-500 dark:text-gray-400 group-hover:text-white">@suvojeetsengupta21</span>
            </div>
            <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
          </a>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">Music Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative w-full overflow-hidden rounded-lg shadow-lg" style={{paddingTop: '56.25%'}}>
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/t7zF5Ye0JwE" title="Music video by Suvojeet Sengupta" loading="lazy" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div className="relative w-full overflow-hidden rounded-lg shadow-lg" style={{paddingTop: '56.25%'}}>
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/Uuv-GwwNhGY" title="Music video by Suvojeet Sengupta" loading="lazy" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div className="relative w-full overflow-hidden rounded-lg shadow-lg md:col-span-2" style={{paddingTop: '56.25%'}}>
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/qFovu9M41UE" title="Music video by Suvojeet Sengupta" loading="lazy" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link to="/music" className="inline-block px-8 py-3 font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105">View More</Link>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">Get in Touch</h2>
          <form id="contact-form" action="https://formsubmit.co/suvojitsengupta21@gmail.com" method="POST" className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Name</label>
              <input type="text" name="name" id="name" className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500" required />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" name="email" id="email" className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500" required />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Message</label>
              <textarea name="message" id="message" rows="4" className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500" required></textarea>
            </div>
            <button type="submit" className="w-full px-6 py-3 font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300">Send Message</button>
          </form>
          <div id="form-status" className="mt-4 text-center"></div>
        </div>
      </div>
    </main>
  );
};

export default Home;
