'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamic import to avoid SSR issues with swagger-ui-react
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading API documentation...</span>
    </div>
  )
});

export default function APIDocsPage() {
  const [spec, setSpec] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(data => setSpec(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Error loading API spec: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Mission Control API Documentation</h1>
        <p className="mb-6 text-gray-600">
          Interactive documentation for the Mission Control API. All endpoints support JSON requests and responses.
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-4">
          {spec ? (
            <SwaggerUI 
              spec={spec} 
              docExpansion="list"
              persistAuthorization={true}
            />
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Authentication</h2>
          <p className="text-sm text-gray-700">
            Protected endpoints require a JWT token in the Authorization header:
          </p>
          <code className="block mt-2 bg-gray-800 text-green-400 p-3 rounded text-sm">
            Authorization: Bearer your-jwt-token
          </code>
        </div>
      </div>
    </div>
  );
}
