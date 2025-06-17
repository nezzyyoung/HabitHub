// src/pages/GoalFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GoalForm from '../components/GoalForm';

const GoalFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simulate a global state or context for goals
  const [allGoals, setAllGoals] = useState([
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
  ]);

  const [initialGoalData, setInitialGoalData] = useState(null);
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const goalToEdit = allGoals.find((goal) => goal.id === id);
      if (goalToEdit) {
        setInitialGoalData(goalToEdit);
      } else {
        navigate('/dashboard'); // Goal not found
      }
    }
  }, [id, isEditMode, allGoals, navigate]);

  const handleSubmit = (formData) => {
    if (isEditMode) {
      setAllGoals(allGoals.map((goal) => (goal.id === id ? { ...formData, id: id } : goal)));
      alert('Goal updated successfully!');
    } else {
      const newGoal = { ...formData, id: String(Date.now()) };
      setAllGoals([...allGoals, newGoal]);
      alert('Goal added successfully!');
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <div className="container mx-auto p-6 lg:p-8">
        <GoalForm initialData={initialGoalData} onSubmit={handleSubmit} isEditMode={isEditMode} />
      </div>
    </div>
  );
};

export default GoalFormPage;