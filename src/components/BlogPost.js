import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import client from '../contentful';
import { motion } from 'framer-motion';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
    })
    .then((response) => {
      setPost(response.items[0]);
      if (response.items[0]) {
        const post = response.items[0];
        document.title = `${post.fields.title} | Suvojeet Sengupta`;

        const updateMetaTag = (property, content) => {
          let element = document.querySelector(`meta[property="${property}"]`);
          if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            document.head.appendChild(element);
          }
          element.setAttribute('content', content);
        };

        updateMetaTag('og:title', post.fields.title);
        updateMetaTag('og:description', post.fields.excerpt);
        updateMetaTag('og:url', window.location.href);
        if (post.fields.featuredImage) {
          updateMetaTag('og:image', post.fields.featuredImage.fields.file.url);
        } else {
          updateMetaTag('og:image', '%PUBLIC_URL%/suvojeet.jpg');
        }

        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = post.fields.excerpt;
      }
    })
    .catch(console.error);
  }, [slug]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: post.fields.title,
        text: post.fields.excerpt,
        url: url,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-dark text-white pt-20">
      <motion.header
        className="py-20 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-4">{post.fields.title}</h1>
        <p className="text-xs text-gray-400 mt-2">Published on: {new Date(post.fields.publishedAt).toLocaleDateString()} by {post.fields.author}</p>
      </motion.header>

      <main className="w-full max-w-4xl mx-auto p-8">
        <motion.div
          className="bg-dark rounded-lg shadow-xl p-8 md:p-12 mb-16 shadow-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="prose prose-invert max-w-none">
            {documentToReactComponents(post.fields.content, {
              renderNode: {
                [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4">{children}</p>,
              },
            })}
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 font-bold text-dark bg-primary rounded-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share
            </button>
          </div>
        </motion.div>
      </main>
      {showCopied && (
        <div className="fixed bottom-10 right-10 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default BlogPost;
