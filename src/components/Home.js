import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';
import suvojeet from '../assets/suvojeet.jpg';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  useEffect(() => {
    document.title = "Suvojeet Sengupta - Official Website";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Welcome to the official website of Suvojeet Sengupta, a talented singer, performer, and composer. Explore his music, biography, and get in touch for collaborations and events.";
  }, []);

  const [formStatus, setFormStatus] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

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
      setFormStatus({ type: 'success', message: 'Thanks for your message! I will get back to you soon.' });
      setIsFormSubmitted(true);
      form.reset();
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          setFormStatus({ type: 'error', message: data["errors"].map(error => error["message"]).join(", ") });
        } else {
          setFormStatus({ type: 'error', message: 'Oops! There was a problem submitting your form' });
        }
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const formContainerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  return (
    <div className="bg-dark text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(${suvojeet})` }}
          initial={{ scale: 1 }}
          animate={{ scale: 1.1, transition: { duration: 10, ease: "easeOut" } }}
          role="img"
          aria-label="Suvojeet Sengupta performing"
        ></motion.div>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <motion.div
          className="relative z-10 w-full p-4 flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold font-montserrat mb-4 text-white">
            Suvojeet Sengupta
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl md:text-3xl font-poppins mb-8 text-light-grey">
            Singer | Performer | Composer
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              to="/music"
              className="bg-primary text-dark font-bold py-3 px-8 rounded-full hover:bg-primary-dark transition duration-300 transform hover:scale-105 shadow-primary animate-pulse"
            >
              Listen Now
            </Link>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <SocialLinks />
        </div>
      </section>

      {/* Music Showcase Section */}
      <motion.section
        id="music"
        className="py-20 bg-dark-2"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center font-montserrat mb-12 text-white">
            Music Showcase
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="relative w-full overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 shadow-primary/20" style={{paddingTop: '56.25%'}}>
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/t7zF5Ye0JwE" title="Music video by Suvojeet Sengupta" loading="lazy" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </motion.div>
            <motion.div variants={itemVariants} className="relative w-full overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 shadow-primary/20" style={{paddingTop: '56.25%'}}>
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/Uuv-GwwNhGY" title="Music video by Suvojeet Sengupta" loading="lazy" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </motion.div>
            <motion.div variants={itemVariants} className="relative w-full overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 md:col-span-2 lg:col-span-1 shadow-primary/20" style={{paddingTop: '56.25%'}}>
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/qFovu9M41UE" title="Music video by Suvojeet Sengupta" loading="lazy" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </motion.div>
          </div>
          <div className="mt-12 text-center">
            <Link to="/music" className="inline-block px-8 py-3 font-bold text-dark bg-primary rounded-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-primary">
              View More
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="py-20 bg-dark"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center font-montserrat mb-12 text-white">
            Get in Touch
          </h2>
          <div className="max-w-3xl mx-auto bg-dark-2 p-8 rounded-lg shadow-lg">
            <AnimatePresence>
              {!isFormSubmitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  variants={formContainerVariants}
                  initial="visible"
                  exit="exit"
                >
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
                </motion.form>
              ) : (
                <motion.div
                  key="success-message"
                  className="text-center"
                  variants={formContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 150 }}
                  >
                    <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-grey">{formStatus?.message}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            {formStatus && formStatus.type === 'error' && (
              <div className="mt-6 text-center text-red-500">{formStatus.message}</div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;