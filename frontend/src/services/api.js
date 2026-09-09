// Base API Configuration
// Phase 7: Foundation only. Real endpoints will be wired in Phase 8.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const endpoints = {
  createUrl: `${API_BASE_URL}/api/v1/urls`,
  getStats: (shortCode) => `${API_BASE_URL}/api/v1/urls/${shortCode}/stats`,
};
