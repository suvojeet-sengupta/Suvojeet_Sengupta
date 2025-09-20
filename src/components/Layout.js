
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * The main layout component for the application.
 * It includes the Navbar, the main content area (using Outlet), and the Footer.
 * For desktop screens, it uses a two-column layout with a fixed sidebar.
 */
const Layout = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="lg:flex">
        <Navbar />
        <main className="flex-grow lg:w-3/4 lg:ml-auto">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
