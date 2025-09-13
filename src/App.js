import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import About from './components/About';
import Music from './components/Music';
import './App.css';

function App() {
  return (
    <BrowserRouter basename="/bio_page">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="music" element={<Music />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;