// src/components/GoalCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const GoalCard = ({ goal, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">{goal.title}</h3>
      {goal.description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{goal.description}</p>}
      <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          {goal.frequency.charAt(0).toUpperCase() + goal.frequency.slice(1)}
        </span>
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          {goal.startDate} - {goal.endDate}
        </span>
      </div>
      <div className="mt-5 flex space-x-3">
        <Link
          to={`/goal-form/${goal.id}`}
          className="flex-grow bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-base transition-colors duration-200 shadow"
        >
          Edit Goal
        </Link>
        <button
          onClick={() => onDelete(goal.id)}
          className="flex-grow bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-base transition-colors duration-200 shadow"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default GoalCard;