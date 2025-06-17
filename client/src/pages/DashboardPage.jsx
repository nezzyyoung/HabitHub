// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GoalCard from '../components/GoalCard';

const DashboardPage = () => {
  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'Drink 8 glasses of water',
      description: 'Stay hydrated throughout the day, every day!',
      frequency: 'daily',
      startDate: '2025-06-01',
      endDate: '2025-12-31',
    },
    {
      id: '2',
      title: 'Read 30 minutes',
      description: 'Dive into a good book or an insightful article for at least half an hour.',
      frequency: 'daily',
      startDate: '2025-06-05',
      endDate: '2025-09-30',
    },
    {
      id: '3',
      title: 'Exercise for 45 minutes',
      description: 'Get your heart rate up with a run, gym session, or home workout.',
      frequency: 'weekly',
      startDate: '2025-06-10',
      endDate: '2026-06-10',
    },
    {
      id: '4',
      title: 'Learn new React concept',
      description: 'Spend time understanding a new feature or pattern in React.',
      frequency: 'weekly',
      startDate: '2025-06-12',
      endDate: '2025-12-01',
    },
  ]);

  const handleDeleteGoal = (id) => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      setGoals(goals.filter((goal) => goal.id !== id));
    }
  };

  const currentStreak = 7; // Example data
  const totalGoalsCompleted = 3; // Example data

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <div className="container mx-auto p-6 lg:p-8">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-10 text-center lg:text-left leading-tight">Your Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-7 text-center border-b-4 border-green-500 transform hover:scale-102 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-gray-700 mb-3">Current Streak</h3>
            <p className="text-green-600 text-6xl font-extrabold leading-none">{currentStreak}</p>
            <p className="text-gray-600 text-lg mt-2">days in a row!</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-7 text-center border-b-4 border-blue-500 transform hover:scale-102 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-gray-700 mb-3">Goals Completed</h3>
            <p className="text-blue-600 text-6xl font-extrabold leading-none">{totalGoalsCompleted}</p>
            <p className="text-gray-600 text-lg mt-2">total unique goals</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-7 text-center border-b-4 border-gray-400 flex flex-col justify-center items-center transform hover:scale-102 transition-transform duration-300">
            <Link
              to="/goal-form"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-xl transform hover:scale-105"
            >
              + Add New Goal
            </Link>
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center lg:text-left">Your Current Goals</h2>
        {goals.length === 0 ? (
          <p className="text-gray-600 text-xl text-center py-10 bg-white rounded-xl shadow-md">
            You don't have any goals yet. Click "Add New Goal" to get started on your journey!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteGoal} />
            ))}
          </div>
        )}

        <div className="mt-16 flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-8">
          <Link
            to="/daily-tracker"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg text-center"
          >
            Go to Daily Tracker
          </Link>
          <Link
            to="/progress"
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg text-center"
          >
            View Progress Overview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;