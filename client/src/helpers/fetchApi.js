const LIVE_API = false;
const LIVE_API_URL = 'https://habithubnode';
const LOCAL_API_URL = 'http://192.168.217.210:8000/';

const BASE_URL = LIVE_API ? LIVE_API_URL : LOCAL_API_URL;

/**
 * Helper function to make API calls
 * @param {string} endpoint - API endpoint (e.g., '/login')
 * @param {object} options - fetch options (method, headers, body, etc.)
 * @returns {Promise<object>} - parsed JSON response
 */
async function apiFetch(endpoint, options = {}) {
  const url = BASE_URL + endpoint;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Merge headers
  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} - response data including token
 */
export async function loginUser(email, password) {
  return apiFetch('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Register user
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} - response data
 */
export async function registerUser(name, email, password) {
  return apiFetch('auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}
