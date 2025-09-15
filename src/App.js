import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import './App.css';

const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Music = lazy(() => import('./components/Music'));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="music" element={<Music />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;