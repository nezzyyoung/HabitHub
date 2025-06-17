// src/pages/WelcomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-6xl font-extrabold mb-8 text-center leading-tight tracking-tight">
        Welcome to <span className="text-orange-300">GoalTracker!</span>
      </h1>
      <p className="text-xl md:text-2xl text-center mb-12 max-w-3xl font-light leading-relaxed">
        Achieve your dreams, one goal at a time. Track your habits, build streaks, and visualize your progress effortlessly.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <Link
          to="/auth?mode=login"
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-opacity-75"
        >
          Login
        </Link>
        <Link
          to="/auth?mode=register"
          className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;