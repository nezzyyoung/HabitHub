// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { loginUser, registerUser } from '../helpers/fetchApi';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsLoginMode(params.get('mode') === 'login');
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
      try {
        if (isLoginMode) {
          let response;
          try {
            response = await loginUser(formData.email, formData.password);
            console.log('Login response:', response);
          } catch (loginError) {
            console.error('Login error:', loginError);
            setError(`Login error: ${loginError.message || loginError}`);
            return;
          }
          const token = response.data?.token || response.data || response.token;
          if (token) {
            localStorage.setItem('token', token);
            navigate('/dashboard');
          } else {
            setError('Login failed: No token received');
          }
        } else {
          if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match!");
            return;
          }
          let registerResponse;
          try {
            registerResponse = await registerUser(formData.name, formData.email, formData.password);
            console.log('Register response:', registerResponse);
          } catch (registerError) {
            console.error('Registration error:', registerError);
            setError(`Registration error: ${registerError.message || registerError}`);
            return;
          }
          // Automatically log in after registration
          let response;
          try {
            response = await loginUser(formData.email, formData.password);
            console.log('Login response after registration:', response);
          } catch (loginError) {
            console.error('Login error after registration:', loginError);
            setError(`Login error after registration: ${loginError.message || loginError}`);
            return;
          }
          const token = response.data?.token || response.data || response.token;
          if (token) {
            localStorage.setItem('token', token);
            navigate('/dashboard');
          } else {
            setError('Login failed after registration: No token received');
          }
        }
      } catch (err) {
        setError(err.message || (isLoginMode ? 'Login failed' : 'Registration failed'));
      }
  };

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    navigate(`/auth?mode=${isLoginMode ? 'register' : 'login'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          {isLoginMode ? 'Welcome Back!' : 'Join Us Today!'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="mb-5">
              <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-base transition-colors duration-200"
                placeholder="Your Name"
                required={!isLoginMode}
              />
            </div>
          )}
          <div className="mb-5">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-base transition-colors duration-200"
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-base transition-colors duration-200"
              placeholder="********"
              required
            />
          </div>
          {!isLoginMode && (
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-base transition-colors duration-200"
                placeholder="********"
                required={!isLoginMode}
              />
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-xs italic mt-2">Passwords do not match.</p>
              )}
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <button
              type="submit"
              className="w-full sm:w-auto flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg"
            >
              {isLoginMode ? 'Login' : 'Register'}
            </button>
            <button
              type="button"
              onClick={toggleMode}
              className="w-full sm:w-auto inline-block align-baseline font-bold text-base text-blue-600 hover:text-blue-800 transition-colors duration-200 underline"
            >
              {isLoginMode ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </div>
        </form>
        {error && (
          <div className="text-red-600 text-sm mt-4 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
