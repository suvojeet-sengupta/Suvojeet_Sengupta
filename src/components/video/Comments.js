import React from 'react';
import { motion } from 'framer-motion';

const Comment = ({ author, text, publishedAt }) => {
  const publishedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-elevated p-5 rounded-xl mb-4"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">
            {author.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-semibold text-[var(--text-primary)]">{author}</p>
            <span className="text-[var(--text-muted)] text-xs">•</span>
            <p className="text-xs text-[var(--text-muted)]">{publishedDate}</p>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed">{text}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Comments = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold gradient-text mb-6">Comments</h2>
        <div className="card-elevated p-8 rounded-xl text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-[var(--text-secondary)]">No comments available for this video yet.</p>
          <p className="text-sm text-[var(--text-muted)] mt-2">Be the first to comment on YouTube!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Comments</h2>
        <span className="text-sm text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-3 py-1 rounded-full">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>
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
