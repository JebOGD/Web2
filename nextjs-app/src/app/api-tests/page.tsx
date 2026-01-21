"use client";

import { useState } from "react";

export default function ApiDemoPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState("");

  async function testApi(endpoint: string, options?: RequestInit) {
    setLoading(endpoint);
    try {
      const response = await fetch(`/api${endpoint}`, options);
      const data = await response.json();
      
      setResults(prev => [{
        endpoint,
        method: options?.method || 'GET',
        status: response.status,
        statusText: response.statusText,
        timestamp: new Date().toLocaleTimeString(),
        data
      }, ...prev].slice(0, 5)); // Keep last 5 results
    } catch (error) {
      setResults(prev => [{
        endpoint,
        method: options?.method || 'GET',
        status: 'ERROR',
        statusText: 'Network Error',
        timestamp: new Date().toLocaleTimeString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }, ...prev].slice(0, 5));
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">API Routes Demo</h1>
      <p className="text-muted-foreground">
        Test the various API endpoints I've created for your project
      </p>

      {/* API Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Users API */}
        <div className="space-y-2">
          <h3 className="font-semibold">Users API</h3>
          <div className="space-y-1">
            <button
              onClick={() => testApi('/users')}
              disabled={loading === '/users'}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
            >
              {loading === '/users' ? 'Testing...' : 'GET /users'}
            </button>
            <button
              onClick={() => testApi('/users?role=admin')}
              disabled={loading === '/users?role=admin'}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
            >
              {loading === '/users?role=admin' ? 'Testing...' : 'GET /users?role=admin'}
            </button>
            <button
              onClick={() => testApi('/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: 'Test User',
                  email: 'test@example.com',
                  role: 'user'
                })
              })}
              disabled={loading === '/users'}
              className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm disabled:opacity-50"
            >
              {loading === '/users' ? 'Testing...' : 'POST /users'}
            </button>
            <button
              onClick={() => testApi('/users/1')}
              disabled={loading === '/users/1'}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
            >
              {loading === '/users/1' ? 'Testing...' : 'GET /users/1'}
            </button>
          </div>
        </div>

        {/* Payments API */}
        <div className="space-y-2">
          <h3 className="font-semibold">Payments API</h3>
          <div className="space-y-1">
            <button
              onClick={() => testApi('/payments')}
              disabled={loading === '/payments'}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
            >
              {loading === '/payments' ? 'Testing...' : 'GET /payments'}
            </button>
            <button
              onClick={() => testApi('/payments?status=completed')}
              disabled={loading === '/payments?status=completed'}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
            >
              {loading === '/payments?status=completed' ? 'Testing...' : 'GET /payments?status=completed'}
            </button>
            <button
              onClick={() => testApi('/payments?sortBy=amount&sortOrder=desc')}
              disabled={loading === '/payments?sortBy=amount&sortOrder=desc'}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
            >
              {loading === '/payments?sortBy=amount&sortOrder=desc' ? 'Testing...' : 'GET /payments (sorted)'}
            </button>
            <button
              onClick={() => testApi('/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  amount: 100,
                  customer: 'Test Customer',
                  method: 'credit_card'
                })
              })}
              disabled={loading === '/payments'}
              className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm disabled:opacity-50"
            >
              {loading === '/payments' ? 'Testing...' : 'POST /payments'}
            </button>
          </div>
        </div>

        {/* Utility API */}
        <div className="space-y-2">
          <h3 className="font-semibold">Utility API</h3>
          <div className="space-y-1">
            <button
              onClick={() => testApi('/health')}
              disabled={loading === '/health'}
              className="w-full px-3 py-2 bg-purple-500 text-white rounded text-sm disabled:opacity-50"
            >
              {loading === '/health' ? 'Testing...' : 'GET /health'}
            </button>
            <button
              onClick={() => testApi('/search?q=john')}
              disabled={loading === '/search?q=john'}
              className="w-full px-3 py-2 bg-purple-500 text-white rounded text-sm disabled:opacity-50"
            >
              {loading === '/search?q=john' ? 'Testing...' : 'GET /search?q=john'}
            </button>
            <button
              onClick={() => testApi('/search?q=laptop&type=products')}
              disabled={loading === '/search?q=laptop&type=products'}
              className="w-full px-3 py-2 bg-purple-500 text-white rounded text-sm disabled:opacity-50"
            >
              {loading === '/search?q=laptop&type=products' ? 'Testing...' : 'GET /search?q=laptop&type=products'}
            </button>
            <button
              onClick={() => testApi('/upload')}
              disabled={loading === '/upload'}
              className="w-full px-3 py-2 bg-purple-500 text-white rounded text-sm disabled:opacity-50"
            >
              {loading === '/upload' ? 'Testing...' : 'GET /upload (info)'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Display */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Results</h2>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {result.method} {result.endpoint}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      result.status === 'ERROR' 
                        ? 'bg-red-100 text-red-800'
                        : result.status >= 400
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {result.status} {result.statusText}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {result.timestamp}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded overflow-x-auto">
                  <pre className="text-xs">
                    {JSON.stringify(result.data || result.error, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Documentation */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Endpoints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Users API</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code>GET /api/users</code> - List users with filtering</li>
              <li><code>POST /api/users</code> - Create new user</li>
              <li><code>GET /api/users/[id]</code> - Get specific user</li>
              <li><code>PUT /api/users/[id]</code> - Update user</li>
              <li><code>DELETE /api/users/[id]</code> - Delete user</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Payments API</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code>GET /api/payments</code> - List payments with filtering/sorting</li>
              <li><code>POST /api/payments</code> - Create payment</li>
              <li><code>GET /api/payments/[id]</code> - Get specific payment</li>
              <li><code>PATCH /api/payments/[id]</code> - Update payment status</li>
              <li><code>DELETE /api/payments/[id]</code> - Delete payment</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Utility API</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code>GET /api/health</code> - Health check</li>
              <li><code>GET /api/search</code> - Universal search</li>
              <li><code>GET /api/upload</code> - Upload info</li>
              <li><code>POST /api/upload</code> - File upload</li>
              <li><code>GET /api/webhook</code> - Webhook info</li>
              <li><code>POST /api/webhook</code> - Webhook handler</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
