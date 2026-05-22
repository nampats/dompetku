import { useCallback } from 'react';

export const useApiClient = () => {
  const baseUrl = import.meta.env.VITE_API_URL || '';

  const apiFetch = useCallback(async (endpoint, options = {}) => {
    const url = `${baseUrl}${endpoint}`;
    
    // Default headers
    const headers = {
      ...options.headers,
    };

    // If body is an object and Content-Type isn't set, default to JSON
    if (options.body && typeof options.body === 'object' && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }

    const fetchOptions = {
      ...options,
      headers,
      credentials: 'include', // <--- THE FIX: Send cookies with every request
    };

    const response = await fetch(url, fetchOptions);
    
    // Attempt to parse JSON, if it fails, throw an error or return raw text
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.error?.message || data?.message || response.statusText || 'Terjadi kesalahan pada server';
      throw new Error(errorMessage);
    }

    return data;
  }, [baseUrl]);

  return { apiFetch };
};
