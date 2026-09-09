export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const endpoints = {
  createUrl: `${API_BASE_URL}/api/v1/urls`,
  getStats: (shortCode) => `${API_BASE_URL}/api/v1/urls/${shortCode}/stats`,
};

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    // Attempt to extract FastAPI 'detail' error message
    const message = (data && data.detail) || response.statusText || 'An unexpected error occurred';
    throw new APIError(message, response.status, data);
  }
  
  return data;
}

export const api = {
  async createShortUrl(payload) {
    // Clean payload: remove empty strings for optional fields
    const cleanPayload = { ...payload };
    if (!cleanPayload.custom_alias) delete cleanPayload.custom_alias;
    if (!cleanPayload.expires_at) delete cleanPayload.expires_at;

    const response = await fetch(endpoints.createUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanPayload),
    });
    return handleResponse(response);
  },

  async getUrlStats(shortCode) {
    const response = await fetch(endpoints.getStats(shortCode), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  }
};
