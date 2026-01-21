import { NextRequest, NextResponse } from 'next/server';
import * as argon2 from 'argon2';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
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
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as any[];
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
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

    const result = await query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    ) as any;
    const newUsers = await query(
      'SELECT id, email, created_at FROM users WHERE id = ?',
      [result.insertId]
    ) as any[];
    
    const newUser = newUsers[0];

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
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
