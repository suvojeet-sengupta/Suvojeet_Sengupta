import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import GlobalVisitorCount from './components/common/GlobalVisitorCount';
import ScrollToTop from './components/common/ScrollToTop';
import { AnimatePresence } from 'framer-motion';
import { socket } from './services/socket';
import './styles/App.css';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Music = lazy(() => import('./pages/Music'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const VideoPage = lazy(() => import('./pages/VideoPage'));
const Posts = lazy(() => import('./pages/Posts'));
const RequestSongPage = lazy(() => import('./pages/RequestSongPage'));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// This new component will handle the animation logic
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

function App() {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    socket.on('update_visitor_count', (data) => {
      setVisitorCount(data.count);
    });

    return () => {
      socket.off('update_visitor_count');
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalVisitorCount count={visitorCount} />
      <Suspense fallback={<LoadingSpinner />}>
        {/* We render the new animated routes component here */}
        <AnimatedRoutes visitorCount={visitorCount} />
      </Suspense>
    </BrowserRouter>
  );
}
export default App;
