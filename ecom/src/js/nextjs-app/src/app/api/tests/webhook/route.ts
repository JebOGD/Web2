import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const signature = headersList.get("x-signature");
    const eventType = headersList.get("x-event-type");
    const webhookSecret = process.env.WEBHOOK_SECRET || "demo-secret";

    const body = await request.text();
    const expectedSignature = `sha256=${Buffer.from(body + webhookSecret).toString('base64')}`;
    
    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    let response;
    switch (eventType) {
      case "user.created":
        response = await handleUserCreated(payload);
        break;
      case "payment.completed":
        response = await handlePaymentCompleted(payload);
        break;
      case "subscription.updated":
        response = await handleSubscriptionUpdated(payload);
        break;
      default:
        response = { message: `Unhandled event type: ${eventType}` };
    }
    console.log(`Webhook processed: ${eventType}`, {
      timestamp: new Date().toISOString(),
      payload: payload,
      response: response
    });

    return NextResponse.json({
      received: true,
      eventType,
      processed: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/webhook", 
    method: "POST",
    headers: {
      required: ["x-signature", "x-event-type"],
      optional: ["x-request-id"]
    },
    supportedEvents: [
      "user.created",
      "payment.completed", 
      "subscription.updated"
    ],
    authentication: "HMAC signature verification"
  });
}

async function handleUserCreated(payload: any) {
  // Simulate user creation processing
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    action: "User processed",
    userId: payload.id,
    email: payload.email
  };
}

async function handlePaymentCompleted(payload: any) {
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    action: "Payment processed",
    paymentId: payload.id,
    amount: payload.amount,
    currency: payload.currency
  };
}

async function handleSubscriptionUpdated(payload: any) {
  await new Promise(resolve => setTimeout(resolve, 150));
  return {
    action: "Subscription updated",
    subscriptionId: payload.id,
    status: payload.status,
    plan: payload.plan
  };
}
