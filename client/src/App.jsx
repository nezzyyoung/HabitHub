// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import GoalFormPage from './pages/GoalFormPage';
import DailyTrackerPage from './pages/DailyTrackerPage';
import ProgressOverviewPage from './pages/ProgressOverviewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/goal-form" element={<GoalFormPage />} />
        <Route path="/goal-form/:id" element={<GoalFormPage />} />
        <Route path="/daily-tracker" element={<DailyTrackerPage />} />
        <Route path="/progress" element={<ProgressOverviewPage />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-700">404 - Page Not Found</h1>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;