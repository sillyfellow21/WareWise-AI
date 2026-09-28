export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6001';

export const apiUrl = (path) => `${API_URL}${path}`;
