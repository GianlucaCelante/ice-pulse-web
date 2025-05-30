import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = () => {
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');

  const checkApiHealth = useCallback(async () => {
    setApiStatus('loading');
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (response.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('disconnected');
      }
    } catch (error) {
      console.error('API health check failed:', error);
      setApiStatus('disconnected');
    }
  }, []);

  const fetchData = useCallback(async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    const result: ApiResponse<T> = {
      data: null,
      loading: true,
      error: null
    };

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      result.data = data;
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('API fetch error:', error);
    } finally {
      result.loading = false;
    }

    return result;
  }, []);

  return {
    apiStatus,
    checkApiHealth,
    fetchData
  };
};