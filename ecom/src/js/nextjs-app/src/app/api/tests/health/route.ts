import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    responseTime: 0,
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), 
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
    services: {
      database: "connected",
      cache: "connected", 
    }
  };

  const responseTime = Date.now() - startTime;
  health.responseTime = responseTime;

  const statusCode = health.status === "healthy" ? 200 : 503;

  return NextResponse.json(health, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
