// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';

const Navbar = () => {
  const location = useLocation();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-lg font-medium text-lg transition-colors duration-200 ease-in-out
    ${location.pathname === path
      ? 'bg-blue-700 text-white shadow-md' // Active link styling
      : 'text-blue-100 hover:bg-blue-700 hover:text-white' // Inactive link styling
    }`;

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    // Clear auth tokens or any login state here if applicable
    window.location.href = '/auth';
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  return (
    <>
      <nav className="bg-blue-800 p-4 shadow-xl">
        <div className="container mx-auto flex flex-wrap justify-between items-center py-2">
          <Link to="/dashboard" className="text-white text-3xl font-extrabold tracking-tight">
            Goal<span className="text-orange-400">Tracker</span>
          </Link>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0">
            <Link to="/dashboard" className={navLinkClass('/dashboard')}>
              Dashboard
            </Link>
            <Link to="/daily-tracker" className={navLinkClass('/daily-tracker')}>
              Daily Tracker
            </Link>
            <Link to="/progress" className={navLinkClass('/progress')}>
              Progress
            </Link>
            <button
              onClick={handleLogoutClick}
              className="text-blue-100 hover:text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-lg transition-colors duration-200 ease-in-out border border-blue-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </>
  );
};

export default Navbar;
