import { NextRequest, NextResponse } from "next/server";
let payments = [
  { id: 1, amount: 150.00, currency: "USD", status: "completed", date: "2024-01-15", customer: "John Doe", method: "credit_card" },
  { id: 2, amount: 75.50, currency: "USD", status: "pending", date: "2024-01-16", customer: "Jane Smith", method: "paypal" },
  { id: 3, amount: 200.00, currency: "EUR", status: "completed", date: "2024-01-17", customer: "Bob Johnson", method: "bank_transfer" },
  { id: 4, amount: 50.25, currency: "USD", status: "failed", date: "2024-01-18", customer: "Alice Brown", method: "credit_card" },
  { id: 5, amount: 300.00, currency: "USD", status: "completed", date: "2024-01-19", customer: "Charlie Wilson", method: "credit_card" },
];

function findPayment(id: number) {
  return payments.find(payment => payment.id === id);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid payment ID" },
      { status: 400 }
    );
  }

  const payment = findPayment(id);
  
  if (!payment) {
    return NextResponse.json(
      { error: "Payment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ payment });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid payment ID" },
      { status: 400 }
    );
  }

  const paymentIndex = payments.findIndex(payment => payment.id === id);
  
  if (paymentIndex === -1) {
    return NextResponse.json(
      { error: "Payment not found" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Update payment status
    const updatedPayment = {
      ...payments[paymentIndex],
      ...(status && { status })
    };

    payments[paymentIndex] = updatedPayment;

    return NextResponse.json({
      message: "Payment updated successfully",
      payment: updatedPayment
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON data" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid payment ID" },
      { status: 400 }
    );
  }

  const paymentIndex = payments.findIndex(payment => payment.id === id);
  
  if (paymentIndex === -1) {
    return NextResponse.json(
      { error: "Payment not found" },
      { status: 404 }
    );
  }

  const deletedPayment = payments[paymentIndex];
  payments.splice(paymentIndex, 1);

  return NextResponse.json({
    message: "Payment deleted successfully",
    payment: deletedPayment
  });
}
