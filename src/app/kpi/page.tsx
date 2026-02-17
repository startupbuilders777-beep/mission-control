import Link from 'next/link'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Folder,
  CheckCircle2,
  Clock,
  Users,
  Bot,
  Activity
} from 'lucide-react'

// This would be fetched from /api/metrics in real app
const metrics = {
  tasksCompletedToday: 12,
  tasksCompletedChange: 8,
  revenue: 4520,
  revenueChange: 12,
  activeProjects: 4,
  projectsChange: 0,
  activeAgents: 3,
  agentsChange: 1
}

const recentTasks = [
  { id: 1, name: 'Build agent monitoring dashboard', project: 'AgentWatch', status: 'complete', time: '2h ago' },
  { id: 2, name: 'Set up Next.js project', project: 'Mission Control', status: 'complete', time: '3h ago' },
  { id: 3, name: 'Design RAG pipeline', project: 'NexusAI', status: 'in_progress', time: '1h ago' },
  { id: 4, name: 'Fix build error', project: 'AgentWatch', status: 'todo', time: '5h ago' },
  { id: 5, name: 'Deploy to EC2', project: 'RedditAutoMarket', status: 'in_progress', time: '30m ago' },
]

const agentStatus = [
  { id: 'sage', name: 'Sage', role: 'Coordinator', status: 'idle', emoji: '🧠', tasks: 0 },
  { id: 'forge', name: 'Forge', role: 'Builder', status: 'running', emoji: '🔨', tasks: 2 },
  { id: 'check', name: 'Check', role: 'QA', status: 'idle', emoji: '🧪', tasks: 0 },
  { id: 'deploy', name: 'Deploy', role: 'DevOps', status: 'idle', emoji: '🚀', tasks: 0 },
]

export default function KPIDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Mission Control</h1>
                <p className="text-xs text-gray-400">Agent Swarm Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/projects" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <Folder className="w-4 h-4" />
                Projects
              </Link>
              <Link href="/agents" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <Bot className="w-4 h-4" />
                Agents
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">KPI Dashboard</h1>
          <p className="text-gray-400 mt-2">Key performance indicators and metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard 
            title="Tasks Completed Today"
            value={metrics.tasksCompletedToday}
            change={metrics.tasksCompletedChange}
            icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
          />
          <KPICard 
            title="Revenue (MTD)"
            value={`$${metrics.revenue.toLocaleString()}`}
            change={metrics.revenueChange}
            icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
          />
          <KPICard 
            title="Active Projects"
            value={metrics.activeProjects}
            change={metrics.projectsChange}
            icon={<Folder className="w-6 h-6 text-blue-500" />}
          />
          <KPICard 
            title="Active Agents"
            value={metrics.activeAgents}
            change={metrics.agentsChange}
            icon={<Bot className="w-6 h-6 text-purple-500" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tasks */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Recent Tasks
            </h2>
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium">{task.name}</p>
                    <p className="text-sm text-gray-400">{task.project} • {task.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                    task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Status */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400" />
              Agent Status
            </h2>
            <div className="space-y-3">
              {agentStatus.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{agent.emoji}</span>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-gray-400">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {agent.tasks > 0 && (
                      <span className="text-sm text-gray-400">{agent.tasks} tasks</span>
                    )}
                    <span className={`w-2 h-2 rounded-full ${
                      agent.status === 'running' ? 'bg-green-500 animate-pulse' :
                      agent.status === 'idle' ? 'bg-gray-500' :
                      'bg-red-500'
                    }`}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function KPICard({ title, value, change, icon }: { title: string; value: string | number; change: number; icon: React.ReactNode }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {change >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
            <span className="text-gray-500 text-sm">vs last week</span>
          </div>
        </div>
        <div className="text-gray-500">{icon}</div>
      </div>
    </div>
  )
}
