import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  username: string;
  phone: string | null;
  location: string | null;
  role: string;
  created_at: string;
}

export const useUser = (username: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) return;
      
      try {
        const response = await fetch(`/api/users/${username}`);
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/login');
            return;
          }
          if (response.status === 404) {
            setError('User not found');
            return;
          }
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, router]);

  return { user, loading, error };
};
