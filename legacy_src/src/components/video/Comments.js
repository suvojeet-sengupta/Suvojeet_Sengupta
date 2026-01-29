import React from 'react';
import { motion } from 'framer-motion';

const Comment = ({ author, text, publishedAt }) => {
  const publishedDate = new Date(publishedAt).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-4 rounded-lg mb-4"
    >
      <div className="flex items-center mb-2">
        <p className="font-semibold text-primary mr-2">{author}</p>
        <p className="text-xs text-gray-400">{publishedDate}</p>
      </div>
      <p className="text-gray-300">{text}</p>
    </motion.div>
  );
};

const Comments = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-primary mb-4">Comments</h2>
        <p className="text-gray-400">No comments available for this video yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-primary mb-4">Comments</h2>
      <div>
        {comments.map((comment, index) => (
          <Comment
            key={index}
            author={comment.author}
            text={comment.text}
            publishedAt={comment.publishedAt}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
