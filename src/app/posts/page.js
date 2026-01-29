"use client";

import React from 'react';
import Script from 'next/script';
import { motion } from 'framer-motion';

const PostsPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 pt-24 pb-8 text-white"
        >
            <Script src="https://www.juicer.io/embed/suvojeet__sengupta/embed-code.js" async defer strategy="lazyOnload" />

            <h1 className="text-4xl font-bold text-primary mb-8 text-center">My Instagram Feed</h1>
            <div className="juicer-feed" data-feed-id="suvojeet__sengupta"></div>
        </motion.div>
    );
};

export default PostsPage;
