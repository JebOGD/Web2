import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    
    if (!userId) {
      return null;
    }
    const users = await query(
      'SELECT id, email, username, phone, location, role, created_at FROM users WHERE id = ?',
      [userId]
    ) as any[];
    
    return users[0] || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}
