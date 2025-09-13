
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 md:flex md:items-center md:justify-center min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
