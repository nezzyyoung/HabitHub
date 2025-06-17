// src/components/GoalForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoalForm = ({ initialData = {}, onSubmit, isEditMode = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily',
    startDate: '',
    endDate: '',
    ...initialData,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl max-w-md mx-auto my-12 border border-gray-200">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        {isEditMode ? 'Edit Goal' : 'Create New Goal'}
      </h2>

      <div className="mb-6">
        <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-base transition-colors duration-200"
          placeholder="e.g., Drink 8 glasses of water"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-base h-28 resize-y transition-colors duration-200"
          placeholder="Detailed description of your goal"
        ></textarea>
      </div>

      <div className="mb-6">
        <label htmlFor="frequency" className="block text-gray-700 text-sm font-semibold mb-2">
          Frequency
        </label>
        <select
          id="frequency"
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-base transition-colors duration-200"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="startDate" className="block text-gray-700 text-sm font-semibold mb-2">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-base transition-colors duration-200"
          required
        />
      </div>

      <div className="mb-8">
        <label htmlFor="endDate" className="block text-gray-700 text-sm font-semibold mb-2">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-base transition-colors duration-200"
          required
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="submit"
          className="flex-grow bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg"
        >
          {isEditMode ? 'Save Changes' : 'Add Goal'}
        </button>
        {isEditMode && (
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-grow bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default GoalForm;