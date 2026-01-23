import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Test basic connection
    const result = await query('SELECT 1 as test');
    
    // Check if users table exists and its structure
    const tableStructure = await query('DESCRIBE users') as any[];
    
    // Check if database has the new columns
    const columns = tableStructure.map(col => col.Field);
    
    return NextResponse.json({
      connection: 'OK',
      usersTable: {
        exists: tableStructure.length > 0,
        columns: columns,
        hasUsername: columns.includes('username'),
        hasPhone: columns.includes('phone'),
        hasLocation: columns.includes('location'),
        hasRole: columns.includes('role')
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      connection: 'ERROR',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
