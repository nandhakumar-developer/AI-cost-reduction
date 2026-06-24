import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('ai-context-auth');
  if (raw) {
    try {
      const state = JSON.parse(raw);
      const token = state?.state?.session?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore
    }
  }
  return config;
});
