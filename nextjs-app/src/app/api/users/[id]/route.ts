import { NextRequest, NextResponse } from "next/server";

// Mock data - same as in users/route.ts
let users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user", status: "active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "user", status: "inactive" },
];

// Helper function to find user by ID
function findUser(id: number) {
  return users.find(user => user.id === id);
}

// GET /api/users/[id] - Get a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid user ID" },
      { status: 400 }
    );
  }

  const user = findUser(id);
  
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ user });
}

// PUT /api/users/[id] - Update a specific user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid user ID" },
      { status: 400 }
    );
  }

  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, role, status } = body;

    // Update user with provided fields
    const updatedUser = {
      ...users[userIndex],
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      ...(status !== undefined && { status })
    };

    users[userIndex] = updatedUser;

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON data" },
      { status: 400 }
    );
  }
}

// DELETE /api/users/[id] - Delete a specific user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid user ID" },
      { status: 400 }
    );
  }

  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);

  return NextResponse.json({
    message: "User deleted successfully",
    user: deletedUser
  });
}
