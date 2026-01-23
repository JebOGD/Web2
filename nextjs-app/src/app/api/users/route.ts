import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'Admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let whereClause = "1=1";
    const params: any[] = [];

    if (role) {
      whereClause += " AND role = ?";
      params.push(role);
    }
    if (status) {
      whereClause += " AND status = ?";
      params.push(status);
    }

    const offset = (page - 1) * limit;

    const users = await query(
      `SELECT id, email, username, phone, location, role, created_at FROM users WHERE ${whereClause} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    ) as any[];

    const totalResult = await query(
      `SELECT COUNT(*) as total FROM users WHERE ${whereClause}`,
      params
    ) as any[];

    const total = totalResult[0].total;

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'Admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, username, phone, location, role = 'User' } = body;

    if (!email || !username) {
      return NextResponse.json(
        { error: 'Email and username are required' },
        { status: 400 }
      );
    }

    const existingUser = await query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    ) as any[];

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    const result = await query(
      'INSERT INTO users (email, username, phone, location, role) VALUES (?, ?, ?, ?, ?)',
      [email, username, phone || null, location || null, role]
    ) as any;

    const newUser = await query(
      'SELECT id, email, username, phone, location, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    ) as any[];

    return NextResponse.json({
      message: 'User created successfully',
      user: newUser[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
