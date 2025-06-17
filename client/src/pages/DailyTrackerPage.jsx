// src/pages/DailyTrackerPage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const DailyTrackerPage = () => {
  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'Drink 8 glasses of water',
      frequency: 'daily',
      completed: { '2025-06-15': true, '2025-06-14': false, '2025-06-13': true },
    },
    {
      id: '2',
      title: 'Read 30 minutes',
      frequency: 'daily',
      completed: { '2025-06-15': false, '2025-06-14': true },
    },
    {
      id: '3',
      title: 'Meditate for 10 minutes',
      frequency: 'daily',
      completed: { '2025-06-15': true, '2025-06-14': true },
    },
    {
      id: '4',
      title: 'Plan next day',
      frequency: 'daily',
      completed: { '2025-06-15': false },
    },
    {
      id: '5',
      title: 'Weekly grocery shopping',
      frequency: 'weekly', // This should not appear in daily tracker
      completed: {},
    },
  ]);

  const today = new Date().toISOString().split('T')[0];
  const dailyGoals = goals.filter(goal => goal.frequency === 'daily');

  const handleToggleComplete = (goalId) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              completed: {
                ...goal.completed,
                [today]: !goal.completed[today],
              },
            }
          : goal
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <div className="container mx-auto p-6 lg:p-8">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-10 text-center lg:text-left">Daily Habit Tracker <br className="sm:hidden"/> for <span className="text-blue-600">{today}</span></h1>

        {dailyGoals.length === 0 ? (
          <p className="text-gray-600 text-xl text-center py-10 bg-white rounded-xl shadow-md">
            No daily goals found for today. Add some daily goals on your dashboard to start tracking!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dailyGoals.map((goal) => (
              <div
                key={goal.id}
                className={`bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-all duration-300 transform hover:-translate-y-1 ${
                  goal.completed[today] ? 'border-l-8 border-green-500' : 'border-l-8 border-gray-300'
                }`}
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{goal.title}</h3>
                  <p className="text-sm text-gray-500">Frequency: {goal.frequency}</p>
                </div>
                <button
                  onClick={() => handleToggleComplete(goal.id)}
                  className={`px-6 py-3 rounded-full font-bold text-base shadow-md hover:shadow-lg transition-all duration-300 ${
                    goal.completed[today]
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {goal.completed[today] ? 'Completed!' : 'Mark Complete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyTrackerPage;