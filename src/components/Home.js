import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';
import suvojeet from '../assets/suvojeet.jpg';

const Home = () => {
  const [formStatus, setFormStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    const response = await fetch('https://formsubmit.co/ajax/suvojitsengupta21@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      setFormStatus('Thanks for your message! I will get back to you soon.');
      form.reset();
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          setFormStatus(data["errors"].map(error => error["message"]).join(", "));
        } else {
          setFormStatus('Oops! There was a problem submitting your form');
        }
      });
    }
  };

  return (
    <div className="bg-dark text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-top animate-ken-burns"
          style={{ backgroundImage: `url(${suvojeet})` }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 w-full p-4 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-bold font-montserrat mb-4 text-white animate-fade-in-down">
            Suvojeet Sengupta
          </h1>
          <p className="text-xl md:text-3xl font-poppins mb-8 text-light-grey animate-fade-in-up">
            Singer | Performer | Composer
          </p>
          <Link
            to="/music"
            className="bg-primary text-dark font-bold py-3 px-8 rounded-full hover:bg-primary-dark transition duration-300 transform hover:scale-105 shadow-primary animate-pulse"
          >
            Listen Now
          </Link>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <SocialLinks />
        </div>
      </section>

      {/* Music Showcase Section */}
      <section id="music" className="py-20 bg-dark-2">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center font-montserrat mb-12 text-white">
            Music Showcase
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative w-full overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 shadow-primary/20" style={{paddingTop: '56.25%'}}>
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/t7zF5Ye0JwE" title="Music video by Suvojeet Sengupta" loading="lazy" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div className="relative w-full overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 shadow-primary/20" style={{paddingTop: '56.25%'}}>
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/Uuv-GwwNhGY" title="Music video by Suvojeet Sengupta" loading="lazy" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div className="relative w-full overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 md:col-span-2 lg:col-span-1 shadow-primary/20" style={{paddingTop: '56.25%'}}>
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/qFovu9M41UE" title="Music video by Suvojeet Sengupta" loading="lazy" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link to="/music" className="inline-block px-8 py-3 font-bold text-dark bg-primary rounded-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-primary">
              View More
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center font-montserrat mb-12 text-white">
            Get in Touch
          </h2>
          <div className="max-w-3xl mx-auto bg-dark-2 p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-semibold text-grey">Name</label>
                <input type="text" name="name" id="name" className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:ring-primary focus:border-primary text-white" required />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-semibold text-grey">Email</label>
                <input type="email" name="email" id="email" className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:ring-primary focus:border-primary text-white" required />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 font-semibold text-grey">Message</label>
                <textarea name="message" id="message" rows="4" className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:ring-primary focus:border-primary text-white" required></textarea>
              </div>
              <button type="submit" className="w-full px-6 py-4 font-bold text-dark bg-primary rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-primary">
                Send Message
              </button>
            </form>
            <div className="mt-6 text-center text-grey">{formStatus}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;