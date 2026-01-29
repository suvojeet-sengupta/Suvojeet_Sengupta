/**
 * @file App.js is the main entry point for the React application.
 * It sets up the main routing, lazy loading for pages, and global components.
 */

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import GlobalVisitorCount from './components/common/GlobalVisitorCount';
import ScrollToTop from './components/common/ScrollToTop';
import { AnimatePresence } from 'framer-motion';
import { socket } from './services/socket';
import './styles/App.css';

// Lazy load pages to improve initial load time.
// Components are only loaded when they are needed.
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Music = lazy(() => import('./pages/Music'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const VideoPage = lazy(() => import('./pages/VideoPage'));
const Posts = lazy(() => import('./pages/Posts'));
const RequestSongPage = lazy(() => import('./pages/RequestSongPage'));

/**
 * A simple loading spinner component to show while pages are loading.
 * @returns {JSX.Element} The loading spinner.
 */
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);

/**
 * Handles the animated transitions between routes.
 * Uses Framer Motion's AnimatePresence to animate routes as they enter and exit.
 * @param {{visitorCount: number}} props - The props for the component.
 * @returns {JSX.Element} The animated routes.
 */
const AnimatedRoutes = ({ visitorCount }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout visitorCount={visitorCount} />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="music" element={<Music />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="video/:id" element={<VideoPage />} />
          <Route path="posts" element={<Posts />} />
          <Route path="request-song" element={<RequestSongPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

/**
 * The main App component.
 * It initializes the socket connection to get the global visitor count
 * and sets up the main structure of the application with routing.
 * @returns {JSX.Element} The main application component.
 */
function App() {
  const [visitorCount, setVisitorCount] = useState(0);

  // Effect to listen for visitor count updates from the socket server.
  useEffect(() => {
    socket.on('update_visitor_count', (data) => {
      setVisitorCount(data.count);
    });

    // Clean up the socket listener on component unmount.
    return () => {
      socket.off('update_visitor_count');
    };
  }, []);

  return (
    <BrowserRouter>
      {/* Scrolls to the top of the page on route changes */}
      <ScrollToTop />
      {/* Displays the global visitor count */}
      <GlobalVisitorCount count={visitorCount} />
      {/* Suspense handles the loading state of lazy-loaded components */}
      <Suspense fallback={<LoadingSpinner />}>
        <AnimatedRoutes visitorCount={visitorCount} />
      </Suspense>
    </BrowserRouter>
  );
}
export default App;
