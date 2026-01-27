import { NextRequest, NextResponse } from "next/server";

// Mock data for search
const mockData = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "user" },
  ],
  payments: [
    { id: 1, amount: 150.00, customer: "John Doe", status: "completed" },
    { id: 2, amount: 75.50, customer: "Jane Smith", status: "pending" },
    { id: 3, amount: 200.00, customer: "Bob Johnson", status: "completed" },
  ],
  products: [
    { id: 1, name: "Laptop Pro", category: "Electronics", price: 999.99 },
    { id: 2, name: "Wireless Mouse", category: "Electronics", price: 29.99 },
    { id: 3, name: "Office Chair", category: "Furniture", price: 199.99 },
  ]
};

// GET /api/search - Universal search endpoint
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type"); // users, payments, products, or all
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!query.trim()) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  const results: any = {
    query,
    total: 0,
    results: []
  };

  const searchInArray = (array: any[], fields: string[]) => {
    return array.filter(item => 
      fields.some(field => {
        const value = item[field];
        return typeof value === 'string' && 
               value.toLowerCase().includes(query.toLowerCase());
      })
    );
  };

  // Search in specified type or all types
  if (!type || type === 'users') {
    const userResults = searchInArray(mockData.users, ['name', 'email', 'role']);
    userResults.forEach(user => {
      results.results.push({
        type: 'user',
        ...user,
        relevance: calculateRelevance(query, user.name + ' ' + user.email)
      });
    });
  }

  if (!type || type === 'payments') {
    const paymentResults = searchInArray(mockData.payments, ['customer', 'status']);
    paymentResults.forEach(payment => {
      results.results.push({
        type: 'payment',
        ...payment,
        relevance: calculateRelevance(query, payment.customer + ' ' + payment.status)
      });
    });
  }

  if (!type || type === 'products') {
    const productResults = searchInArray(mockData.products, ['name', 'category']);
    productResults.forEach(product => {
      results.results.push({
        type: 'product',
        ...product,
        relevance: calculateRelevance(query, product.name + ' ' + product.category)
      });
    });
  }

  results.results.sort((a: any, b: any) => b.relevance - a.relevance);
  results.results = results.results.slice(0, limit);
  results.total = results.results.length;

  return NextResponse.json(results);
}
function calculateRelevance(query: string, text: string): number {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  let score = 0;
  
  if (textLower === queryLower) {
    score += 100;
  }
  else if (textLower.startsWith(queryLower)) {
    score += 80;
  }
  else if (textLower.includes(queryLower)) {
    score += 60;
  }
  const queryWords = queryLower.split(' ');
  const textWords = textLower.split(' ');
  
  queryWords.forEach((queryWord: string) => {
    textWords.forEach((textWord: string) => {
      if (textWord === queryWord) {
        score += 20;
      } else if (textWord.includes(queryWord)) {
        score += 10;
      }
    });
  });
  
  return score;
}
