// src/pages/ProgressOverviewPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const ProgressOverviewPage = () => {
  const currentStreak = 15;
  const totalDaysCompleted = 68;
  const totalPossibleDays = 90;

  const progressPercentage = totalPossibleDays > 0 ? ((totalDaysCompleted / totalPossibleDays) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <div className="container mx-auto p-6 lg:p-8">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-10 text-center lg:text-left">Your Progress Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-7 text-center border-b-4 border-green-500 transform hover:scale-102 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-gray-700 mb-3">Longest Streak</h3>
            <p className="text-green-600 text-6xl font-extrabold leading-none">{currentStreak}</p>
            <p className="text-gray-600 text-lg mt-2">days achieved</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-7 text-center border-b-4 border-blue-500 transform hover:scale-102 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-gray-700 mb-3">Total Days Completed</h3>
            <p className="text-blue-600 text-6xl font-extrabold leading-none">{totalDaysCompleted}</p>
            <p className="text-gray-600 text-lg mt-2">of your goals</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-7 text-center border-b-4 border-gray-400 flex flex-col justify-center transform hover:scale-102 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">Overall Completion</h3>
            <div className="w-full bg-gray-200 rounded-full h-5 mb-3 overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-gray-700 text-2xl font-bold">{progressPercentage}%</p>
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center lg:text-left">Detailed Progress & Insights</h2>
        <div className="bg-white rounded-xl shadow-lg p-10 text-center text-gray-600 italic border border-gray-200">
          <p className="text-xl mb-4">A powerful calendar view and detailed analytics are on their way!</p>
          <p className="text-lg">This section will soon offer granular insights into your goal journey, helping you stay motivated and focused.</p>
          <p className="mt-4 font-semibold text-gray-500">Coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverviewPage;