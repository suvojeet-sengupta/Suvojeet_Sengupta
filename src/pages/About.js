import React, { useReducer } from 'react';
import suvojeet from '../assets/suvojeet.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import SocialLinks from '../components/contact/SocialLinks';
import { Helmet } from 'react-helmet-async';

// Reducer function for form state management
const formInitialState = {
  status: 'idle', // 'idle', 'submitting', 'success', 'error'
  message: null,
};

/**
 * @file Manages the state of the contact form.
 * @param {object} state - The current state.
 * @param {object} action - The dispatched action.
 * @returns {object} The new state.
 */
function formReducer(state, action) {
  switch (action.type) {
    case 'SUBMIT':
      return { ...state, status: 'submitting', message: null };
    case 'SUCCESS':
      return { ...state, status: 'success', message: action.payload };
    case 'ERROR':
      return { ...state, status: 'error', message: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

/**
 * The About page component.
 * This component displays information about Suvojeet Sengupta, including his story, skills, and a contact form.
 */
const About = () => {
  const [formState, dispatch] = useReducer(formReducer, formInitialState);

  /**
   * Handles the submission of the contact form.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT' });

    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    try {
      const response = await fetch('https://formsubmit.co/ajax/7bcff6a4aef91c254d8c32aaf5b0214d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        dispatch({ type: 'SUCCESS', payload: 'Thanks for your message! I will get back to you soon.' });
        form.reset();
      } else {
        const responseData = await response.json();
        const errorMessage = responseData.errors 
          ? responseData.errors.map(error => error.message).join(", ")
          : 'Oops! There was a problem submitting your form';
        dispatch({ type: 'ERROR', payload: errorMessage });
      }
    } catch (error) {
      dispatch({ type: 'ERROR', payload: 'Something went wrong. Please try again.' });
    }
  };

  // Animation variants for Framer Motion.
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };
  
  const formContainerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  return (
    <div className="bg-dark text-white pt-20">
      <Helmet>
        <title>About | Suvojeet Sengupta</title>
        <meta name="description" content="Learn more about Suvojeet Sengupta, a passionate singer and composer from India. Discover his musical journey, inspirations, and the story behind his music." />
      </Helmet>
      {/* Page Header */}
      <motion.header
        className="py-20 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold font-montserrat">About Me</h1>
        <p className="mt-4 text-lg text-grey">The story behind the music.</p>
      </motion.header>

      <main className="w-full max-w-7xl mx-auto p-8">
        {/* Introduction Section */}
        <motion.div
          className="bg-dark rounded-lg shadow-xl p-8 md:p-12 mb-16 shadow-primary/10"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
            <motion.div className="md:col-span-1" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <img src={suvojeet} alt="Suvojeet Sengupta" className="rounded-lg shadow-lg w-full h-auto mx-auto" loading="lazy" />
            </motion.div>
            <div className="md:col-span-2">
              <p className="text-grey">
                Hi! I’m <strong>Suvojeet Sengupta</strong>, born on <strong>1st August 2005</strong> in Asansol, West Bengal, and currently living in Jharkhand. From a very young age, I found myself lost in the world of music. Singing wasn’t just something I enjoyed—it became a part of who I am. I used to hum and sing <strong>Kishore Kumar songs</strong> as a child, and over time, this simple joy grew into a lifelong passion.
              </p>
              <p className="text-grey mt-4">
                Singing for me is more than just hitting notes or performing in front of people—it’s a way to express myself. Whether I am happy, thoughtful, or even just daydreaming, I find myself <strong>humming, practicing, and experimenting</strong> with my voice. Friends and family often ask, “Do you practice?” but honestly, my practice is instinctive. Music flows naturally, and I have learned to refine my voice through self-practice, patience, and dedication.
              </p>
              <p className="text-grey mt-4">
                I’ve always been inspired by <strong>Arijit Singh</strong>. His voice, emotion, and style motivate me to push my own limits and develop my own unique singing style. Even without formal training, I focus on understanding nuances of melody, rhythm, and expression.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Details Section */}
        <motion.div
          className="mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center font-montserrat mb-12 text-white">My Story</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* My Philosophy & Approach */}
            <motion.div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10" variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
              <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">My Philosophy & Approach</h3>
                <p className="text-grey mb-4">
                I strongly believe that <strong>singing is not just learned—it’s lived</strong>. Every melody I create, every note I practice, is a step toward becoming better, more expressive, and more authentic. My approach is always:
                </p>
                <ul className="space-y-2 text-grey">
                    <li><strong>1. Consistent Practice</strong> – Every day, even a few minutes, counts.</li>
                    <li><strong>2. Experimentation</strong> – Trying new styles, genres, and techniques.</li>
                    <li><strong>3. Learning from Inspiration</strong> – Drawing lessons from artists like Arijit Singh.</li>
                    <li><strong>4. Expressing Emotion</strong> – Music is communication, not just sound.</li>
                </ul>
                <p className="text-grey mt-4">
                Music and technology together teach me discipline, creativity, and patience—values I carry into every part of life.
                </p>
            </motion.div>

            {/* Education & Interests */}
            <motion.div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10" variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
              <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">Education & Interests</h3>
                <p className="text-grey">
                Currently, I am pursuing a <strong>BA in Arts</strong>, but my curiosity doesn’t stop at music. I am deeply interested in <strong>technology</strong>. I’ve even created <strong>a few apps and websites</strong> on my own, experimenting and learning along the way. This combination of technology and music allows me to think creatively and approach challenges with a unique perspective.
                </p>
                <ul className="space-y-2 text-grey list-disc list-inside mt-4">
                    <li>Artificial Intelligence (AI)</li>
                    <li>Programming Languages</li>
                    <li>Custom ROMs and Mobile Tech</li>
                    <li>Science & Innovation</li>
                    <li>Web & App Development</li>
                </ul>
            </motion.div>


          </div>
        </motion.div>

        {/* Vision & Fun Facts Section */}
        <motion.div
          className="mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center font-montserrat mb-12 text-white">More About Me</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Future Goals */}
            <motion.div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10" variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
              <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">Future Goals</h3>
              <p className="text-grey">
                My ultimate goal is to become a <strong>professional singer</strong> and share my music with the world. I want to inspire people, evoke emotions, and connect hearts through my voice. At the same time, I continue to explore technology and hope to blend creativity with innovation in meaningful ways.
              </p>
            </motion.div>
            {/* Fun Facts */}
            <motion.div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10" variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
              <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">Fun Facts</h3>
              <ul className="space-y-2 text-grey list-disc list-inside">
                <li>Singing is my default mood-lifter—I hum even while doing daily chores!</li>
                <li>I love learning new things in tech just as much as I love experimenting with melodies.</li>
                <li>My singing is self-taught, but I constantly work on improving my vocal techniques.</li>
                <li>I strongly believe in following passion while balancing education and curiosity.</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* New Contact Form Section */}
        <motion.section
          id="contact-about"
          className="py-20"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-dark-2 p-8 rounded-lg shadow-lg grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column: Text */}
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-primary mb-4 font-montserrat">Get in Touch</h3>
                <p className="text-grey mb-6">
                  Have a question, a project proposal, or just want to say hello? Use the form, and I'll get back to you as soon as possible.
                </p>
                <p className="text-grey">
                  For bookings and collaborations, please provide as much detail as you can.
                </p>
              </div>

              {/* Right Column: Form */}
              <div>
                <AnimatePresence>
                  {formState.status !== 'success' ? (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      variants={formContainerVariants}
                      initial="visible"
                      exit="exit"
                    >
                      <div>
                        <label htmlFor="name-about" className="block mb-2 font-semibold text-grey">Name</label>
                        <input type="text" name="name" id="name-about" className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:ring-primary focus:border-primary text-white" required />
                      </div>
                      <div>
                        <label htmlFor="email-about" className="block mb-2 font-semibold text-grey">Email</label>
                        <input type="email" name="email" id="email-about" className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:ring-primary focus:border-primary text-white" required />
                      </div>
                      <div>
                        <label htmlFor="message-about" className="block mb-2 font-semibold text-grey">Message</label>
                        <textarea name="message" id="message-about" rows="4" className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:ring-primary focus:border-primary text-white" required></textarea>
                      </div>
                      <button type="submit" className="w-full px-6 py-4 font-bold text-dark bg-primary rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" disabled={formState.status === 'submitting'}>
                        {formState.status === 'submitting' ? 'Sending...' : 'Send Message'}
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
                        <p className="text-grey">{formState.message}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {formState.status === 'error' && (
                  <div className="mt-6 text-center text-red-500">{formState.message}</div>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      <div className="pb-16">
        <SocialLinks />
      </div>
    </div>
  );
};

export default About;