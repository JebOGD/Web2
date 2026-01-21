import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const description = formData.get("description") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // LIMIT TO 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }
    //types
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf", "text/plain"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Read file content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      description: description || "No description provided",
      uploadedAt: new Date().toISOString(),
      url: `/uploads/${file.name}`,
      buffer: buffer.toString("base64").substring(0, 100) + "..." 
    };

    return NextResponse.json({
      message: "File uploaded successfully",
      file: fileInfo
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/upload",
    method: "POST",
    limits: {
      maxFileSize: "5MB",
      allowedTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf", "text/plain"],
      maxFiles: 1
    },
    usage: {
      description: "Upload a file with optional description",
      parameters: {
        file: "File (required)",
        description: "String (optional)"
      }
    }
  });
}
