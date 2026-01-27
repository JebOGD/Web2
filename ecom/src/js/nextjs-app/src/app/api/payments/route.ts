import { NextRequest, NextResponse } from "next/server";

// Mock payments data
let payments = [
  { id: 1, amount: 150.00, currency: "USD", status: "completed", date: "2024-01-15", customer: "John Doe", method: "credit_card" },
  { id: 2, amount: 75.50, currency: "USD", status: "pending", date: "2024-01-16", customer: "Jane Smith", method: "paypal" },
  { id: 3, amount: 200.00, currency: "EUR", status: "completed", date: "2024-01-17", customer: "Bob Johnson", method: "bank_transfer" },
  { id: 4, amount: 50.25, currency: "USD", status: "failed", date: "2024-01-18", customer: "Alice Brown", method: "credit_card" },
  { id: 5, amount: 300.00, currency: "USD", status: "completed", date: "2024-01-19", customer: "Charlie Wilson", method: "credit_card" },
];

// GET /api/payments - Get payments with filtering, sorting, and pagination
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Filtering
  const status = searchParams.get("status");
  const currency = searchParams.get("currency");
  const method = searchParams.get("method");
  const customer = searchParams.get("customer");
  const minAmount = searchParams.get("minAmount");
  const maxAmount = searchParams.get("maxAmount");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  
  // Sorting
  const sortBy = searchParams.get("sortBy") || "date";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  
  // Pagination
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  let filteredPayments = [...payments];

  // Apply filters
  if (status) {
    filteredPayments = filteredPayments.filter(p => p.status === status);
  }
  if (currency) {
    filteredPayments = filteredPayments.filter(p => p.currency === currency);
  }
  if (method) {
    filteredPayments = filteredPayments.filter(p => p.method === method);
  }
  if (customer) {
    filteredPayments = filteredPayments.filter(p => 
      p.customer.toLowerCase().includes(customer.toLowerCase())
    );
  }
  if (minAmount) {
    filteredPayments = filteredPayments.filter(p => p.amount >= parseFloat(minAmount));
  }
  if (maxAmount) {
    filteredPayments = filteredPayments.filter(p => p.amount <= parseFloat(maxAmount));
  }
  if (dateFrom) {
    filteredPayments = filteredPayments.filter(p => p.date >= dateFrom);
  }
  if (dateTo) {
    filteredPayments = filteredPayments.filter(p => p.date <= dateTo);
  }

  // Apply sorting
  filteredPayments.sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  // Calculate statistics
  const stats = {
    total: filteredPayments.length,
    completed: filteredPayments.filter(p => p.status === 'completed').length,
    pending: filteredPayments.filter(p => p.status === 'pending').length,
    failed: filteredPayments.filter(p => p.status === 'failed').length,
    totalAmount: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
    averageAmount: filteredPayments.length > 0 
      ? filteredPayments.reduce((sum, p) => sum + p.amount, 0) / filteredPayments.length 
      : 0
  };

  return NextResponse.json({
    payments: paginatedPayments,
    pagination: {
      page,
      limit,
      total: filteredPayments.length,
      pages: Math.ceil(filteredPayments.length / limit)
    },
    statistics: stats,
    filters: {
      status,
      currency,
      method,
      customer,
      minAmount,
      maxAmount,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder
    }
  });
}

// POST /api/payments - Create a new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = "USD", customer, method } = body;

    // Validation
    if (!amount || !customer || !method) {
      return NextResponse.json(
        { error: "Amount, customer, and method are required" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Create new payment
    const newPayment = {
      id: Math.max(...payments.map(p => p.id)) + 1,
      amount: parseFloat(amount),
      currency,
      status: "pending",
      date: new Date().toISOString().split('T')[0],
      customer,
      method
    };

    payments.push(newPayment);

    return NextResponse.json({
      message: "Payment created successfully",
      payment: newPayment
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON data" },
      { status: 400 }
    );
  }
}
