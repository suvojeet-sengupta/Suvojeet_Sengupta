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
                Suvojeet Sengupta is a passionate singer, music lover, and dedicated performer with a unique ability to bring emotions alive through music. A student of History (BA Honours, Semester 3), he balances academics with his deep commitment to music, practicing daily and constantly refining his vocal style.
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
            {/* My Musical Journey */}
            <motion.div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10" variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
              <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">My Musical Journey</h3>
              <ul className="space-y-4 text-grey">
                <li><strong>🎤 Regular practice and continuous vocal training</strong></li>
                <li><strong>🎶 Genres:</strong> Romantic ballads, soulful covers, and contemporary Hindi & Bengali tracks</li>
                <li><strong>🎸 Performances:</strong> Small shows, studio recordings, and online showcases</li>
                <li><strong>⭐ Influences:</strong> Arijit Singh, with a focus on developing a personalized style</li>
              </ul>
            </motion.div>

            {/* Beyond Music */}
            <motion.div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10" variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
              <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">Beyond Music</h3>
              <p className="text-grey">
                Alongside his singing career, Suvojeet works part-time as a Customer Care Executive at DishTV, managing his professional responsibilities while keeping his passion for music at the forefront.
              </p>
            </motion.div>

            {/* AI-Powered Learning */}
            <motion.div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10" variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
              <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">AI-Powered Learning</h3>
              <p className="text-grey">
                Suvojeet leverages AI to accelerate his learning process in every field, from music to technology. This allows him to quickly adapt to new challenges and continuously expand his skills.
              </p>
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
            {/* Vision */}
            <motion.div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10" variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
              <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">Vision</h3>
              <p className="text-grey">
                For me, music is not just about singing—it’s about creating an emotional connection. My dream is to continue growing as an artist, perform on bigger stages, and create original music that inspires people the same way music inspires me.
              </p>
            </motion.div>
            {/* Quick Facts */}
            <motion.div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10" variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
              <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">Quick Facts</h3>
              <ul className="space-y-2 text-grey list-disc list-inside">
                <li><strong>Name:</strong> Suvojeet Sengupta</li>
                <li><strong>Profession:</strong> Singer | Student | Content Creator</li>
                <li><strong>Languages:</strong> Hindi & Bengali</li>
                <li><strong>Inspiration:</strong> Arijit Singh</li>
                <li><strong>Platform:</strong> YouTube channel “Suvojeet Sengupta”</li>
                <li><strong>Personality:</strong> Tech-savvy, disciplined, and music-focused</li>
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