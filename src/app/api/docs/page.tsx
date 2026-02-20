import Link from 'next/link'

export const metadata = {
  title: 'API Documentation - MissionControl',
  description: 'API documentation for MissionControl agent management system',
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
        <p className="text-gray-600 mb-8">MissionControl Agent Management API</p>

        <div className="space-y-6">
          {/* Agents API */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Agents API</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-purple-600">/api/agents</code>
                </div>
                <p className="text-gray-600 text-sm">Returns a list of all agents in the system.</p>
                <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
                  <p className="font-semibold mb-1">Response:</p>
                  <pre>{JSON.stringify({ agents: [], count: 0 }, null, 2)}</pre>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-purple-600">/api/agents</code>
                </div>
                <p className="text-gray-600 text-sm">Create a new agent.</p>
                <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
                  <p className="font-semibold mb-1">Request Body:</p>
                  <pre>{JSON.stringify({ name: "agent-name", role: "builder" }, null, 2)}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* Board API */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Board API</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-purple-600">/api/board</code>
                </div>
                <p className="text-gray-600 text-sm">Returns aggregated dashboard data including agent stats, activities, and KPIs.</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-purple-600">/api/board</code>
                </div>
                <p className="text-gray-600 text-sm">Update board data (ticket updates, activity logging).</p>
                <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
                  <p className="font-semibold mb-1">Request Body:</p>
                  <pre>{JSON.stringify({ 
                    action: "updateTicket", 
                    ticketId: "TASK-123", 
                    data: { status: "done" }
                  }, null, 2)}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* Alerts API */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Alerts API</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-purple-600">/api/alerts</code>
                </div>
                <p className="text-gray-600 text-sm">Get all alert rules.</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-purple-600">/api/alerts</code>
                </div>
                <p className="text-gray-600 text-sm">Create a new alert rule.</p>
                <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
                  <p className="font-semibold mb-1">Request Body:</p>
                  <pre>{JSON.stringify({
                    name: "High Error Rate",
                    metric: "error_rate",
                    threshold: 10,
                    condition: ">",
                    notify_type: "discord",
                    destination: "https://discord.com/webhook/..."
                  }, null, 2)}</pre>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-mono">PUT</span>
                  <code className="text-purple-600">/api/alerts</code>
                </div>
                <p className="text-gray-600 text-sm">Update an alert rule.</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">DELETE</span>
                  <code className="text-purple-600">/api/alerts?id=rule-id</code>
                </div>
                <p className="text-gray-600 text-sm">Delete an alert rule by ID.</p>
              </div>
            </div>
          </section>

          {/* Alerts History API */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Alerts History API</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-purple-600">/api/alerts/history</code>
                </div>
                <p className="text-gray-600 text-sm">Get alert history/logs.</p>
              </div>
            </div>
          </section>

          {/* Alerts Test API */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Alerts Test API</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-purple-600">/api/alerts/test</code>
                </div>
                <p className="text-gray-600 text-sm">Test an alert notification (sends test message to destination).</p>
                <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
                  <p className="font-semibold mb-1">Request Body:</p>
                  <pre>{JSON.stringify({
                    notify_type: "discord",
                    destination: "https://discord.com/webhook/..."
                  }, null, 2)}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* Health API */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Health API</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-purple-600">/api/cron/health</code>
                </div>
                <p className="text-gray-600 text-sm">Get health status of all agents.</p>
                <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
                  <p className="font-semibold mb-1">Response:</p>
                  <pre>{JSON.stringify({
                    status: "healthy",
                    lastCheck: "2026-02-20T12:00:00Z",
                    agents: [],
                    summary: { total: 0, healthy: 0, degraded: 0, down: 0 }
                  }, null, 2)}</pre>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-purple-600">/api/cron/health</code>
                </div>
                <p className="text-gray-600 text-sm">Trigger a health check (requires CRON_SECRET).</p>
                <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
                  <p className="font-semibold mb-1">Query Parameters:</p>
                  <p>?secret=your-cron-secret</p>
                </div>
              </div>
            </div>
          </section>

          {/* Metrics History API */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Metrics History API</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-purple-600">/api/metrics/history</code>
                </div>
                <p className="text-gray-600 text-sm">Get historical metrics for agents.</p>
                <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
                  <p className="font-semibold mb-1">Query Parameters:</p>
                  <ul className="list-disc pl-4">
                    <li><code>agentId</code> - Filter by agent ID (optional)</li>
                    <li><code>metricType</code> - Filter by metric type (optional)</li>
                    <li><code>days</code> - Number of days to look back (default: 7)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Metrics Stream API */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Metrics Stream API</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-purple-600">/api/metrics/stream</code>
                </div>
                <p className="text-gray-600 text-sm">Get real-time metrics streaming (Server-Sent Events).</p>
              </div>
            </div>
          </section>

          {/* External Agents API */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">External Agents API</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-purple-600">/api/external-agents</code>
                </div>
                <p className="text-gray-600 text-sm">Get all external agents.</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-purple-600">/api/external-agents</code>
                </div>
                <p className="text-gray-600 text-sm">Register a new external agent.</p>
                <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
                  <p className="font-semibold mb-1">Request Body:</p>
                  <pre>{JSON.stringify({
                    name: "My External Agent",
                    url: "https://agent.example.com",
                    apiKey: "optional-api-key"
                  }, null, 2)}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* Cron Metrics API */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Cron Metrics API</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-purple-600">/api/cron/metrics</code>
                </div>
                <p className="text-gray-600 text-sm">Collect metrics from all agents (cron job endpoint).</p>
                <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
                  <p className="font-semibold mb-1">Query Parameters:</p>
                  <p>?secret=your-cron-secret</p>
                </div>
              </div>
            </div>
          </section>

          {/* Authentication */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication</h2>
            <p className="text-gray-600 mb-4">
              The API uses different authentication methods depending on the endpoint:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Dashboard UI:</strong> Session-based auth via NextAuth.js</li>
              <li><strong>Health Check Cron:</strong> Query parameter <code>?secret=CRON_SECRET</code></li>
              <li><strong>Alerts Webhooks:</strong> API key in header <code>x-api-key: your-key</code></li>
            </ul>
            <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> For production deployment, ensure all sensitive endpoints require authentication.
              </p>
            </div>
          </section>

          {/* Environment Variables */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <p className="text-gray-600 mb-4">Required environment variables for the API:</p>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
              <pre>{`# Database
DATABASE_URL=postgresql://user:password@host:5432/db

# Authentication
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://mission-control.vercel.app

# Health Check
HEALTH_CHECK_INTERVAL=5  # minutes
CRON_SECRET=your-cron-secret

# Alerts
ALERT_API_KEY=your-api-key`}</pre>
            </div>
          </section>

          {/* Rate Limiting */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Rate Limiting</h2>
            <p className="text-gray-600">
              API requests are rate-limited to prevent abuse. Exceeding limits returns HTTP 429.
            </p>
          </section>
        </div>

        <div className="mt-8">
          <Link href="/agents" className="text-blue-600 hover:underline">
            ← Back to Agents
          </Link>
        </div>
      </div>
    </div>
  )
}
