import { useState } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

export const useApi = <T = any>() => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: '',
  });

  const execute = async (url: string, options?: RequestInit): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setState(prev => ({ ...prev, data, loading: false }));
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Request failed';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return null;
    }
  };

  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: '',
    });
  };

  return { ...state, execute, reset };
};
