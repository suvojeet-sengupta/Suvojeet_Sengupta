import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formsubmit.co/ajax/7bcff6a4aef91c254d8c32aaf5b0214d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          _subject: "New Newsletter Subscription!",
        })
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you for subscribing!' });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-dark-2 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-grey mb-8">Subscribe to my newsletter for the latest music, blog posts, and event updates.</p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-l-lg bg-dark border border-gray-700 text-white focus:ring-primary focus:border-primary"
              required
            />
            <motion.button
              type="submit"
              className="px-6 py-3 bg-primary text-dark font-bold rounded-r-lg hover:bg-primary-dark transition-all duration-300 shadow-primary disabled:opacity-50"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </motion.button>
          </div>
        </form>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-sm ${status.type === 'success' ? 'text-green-500' : 'text-red-500'}`}
          >
            {status.message}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
