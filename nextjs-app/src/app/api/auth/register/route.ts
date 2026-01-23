import { NextRequest, NextResponse } from 'next/server';
import * as argon2 from 'argon2';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, phone, location } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username || null]
    ) as any[];
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User already exists with this email or username' },
        { status: 409 }
      );
    }

    // Argon2
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    // Generate username from email if not provided
    const generatedUsername = username || email.split('@')[0];

    const result = await query(
      'INSERT INTO users (email, password, username, phone, location) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, generatedUsername, phone || null, location || null]
    ) as any;
    const newUsers = await query(
      'SELECT id, email, username, phone, location, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    ) as any[];
    
    const newUser = newUsers[0];

    // Set cookie with user info
    const cookieStore = await cookies();
    cookieStore.set('user_id', newUser.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    cookieStore.set('username', newUser.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          phone: newUser.phone,
          location: newUser.location,
          role: newUser.role,
          createdAt: newUser.created_at,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
