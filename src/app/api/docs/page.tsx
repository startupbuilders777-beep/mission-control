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
                  Response: {"{ agents: Agent[], count: number }"}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-purple-600">/api/agents</code>
                </div>
                <p className="text-gray-600 text-sm">Create a new agent.</p>
                <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
                  Body: {"{ name: string, role: string }"}<br/>
                  Response: {"{ Agent }"}
                </div>
              </div>
            </div>
          </section>

          {/* Board API */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Board API</h2>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                <code className="text-purple-600">/api/board</code>
              </div>
              <p className="text-gray-600 text-sm">Returns aggregated dashboard data including agent stats, activities, and KPIs.</p>
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
                  Response: {"{ status, lastCheck, agents: HealthStatus[], summary }"}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-purple-600">/api/cron/health</code>
                </div>
                <p className="text-gray-600 text-sm">Trigger a health check (requires CRON_SECRET).</p>
                <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
                  Query: ?secret=your-secret<br/>
                  Response: {"{ success: true, agentsChecked: number }"}
                </div>
              </div>
            </div>
          </section>

          {/* Authentication */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication</h2>
            <p className="text-gray-600">
              Currently, the API does not require authentication for development. 
              In production, add authentication via NextAuth.js or API keys.
            </p>
          </section>

          {/* Environment Variables */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono">
              DATABASE_URL=postgresql://...<br/>
              HEALTH_CHECK_INTERVAL=5<br/>
              CRON_SECRET=your-secret-here
            </div>
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
