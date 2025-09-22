import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const Posts = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-24 pb-8 text-white"
    >
      <Helmet>
        <title>Instagram Posts - Suvojeet Sengupta</title>
        <meta name="description" content="A collection of my latest Instagram posts." />
        <script type="text/javascript" src="https://www.juicer.io/embed/suvojeet__sengupta/embed-code.js" async defer></script>
      </Helmet>
      
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">My Instagram Feed</h1>
      
      {/* The script from Helmet will target this element */}
      <div className="juicer-feed" data-feed-id="suvojeet__sengupta">
      </div>
    </motion.div>
  );
};

export default Posts;
