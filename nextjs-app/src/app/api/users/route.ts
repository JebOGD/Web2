import { NextRequest, NextResponse } from "next/server";

// Mock data - in real app this would come from a database
let users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user", status: "active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "user", status: "inactive" },
];

// GET /api/users - Get all users or filter by query params
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get("role");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  let filteredUsers = users;

  // Apply filters
  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }
  if (status) {
    filteredUsers = filteredUsers.filter(user => user.status === status);
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return NextResponse.json({
    users: paginatedUsers,
    pagination: {
      page,
      limit,
      total: filteredUsers.length,
      pages: Math.ceil(filteredUsers.length / limit)
    }
  });
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role = "user" } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (users.some(user => user.email === email)) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name,
      email,
      role,
      status: "active"
    };

    users.push(newUser);

    return NextResponse.json({
      message: "User created successfully",
      user: newUser
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON data" },
      { status: 400 }
    );
  }
}
