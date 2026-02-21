import ExternalAgentsSection from '@/components/ExternalAgents'
import Link from 'next/link'
import { 
  BarChart3, 
  Bot,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Folder,
  Plus,
  RefreshCw,
  Zap,
  Brain,
  Check,
  Rocket
} from 'lucide-react'

// This would be fetched from /api/agents in real app
const agents = [
  { 
    id: 'sage', 
    name: 'Sage', 
    role: 'Coordinator',
    emoji: '🧠',
    status: 'idle', 
    currentTask: null,
    lastActivity: '2 min ago',
    tasksCompleted: 156,
    uptime: '99.8%'
  },
  { 
    id: 'forge', 
    name: 'Forge', 
    role: 'Builder',
    emoji: '🔨',
    status: 'running', 
    currentTask: 'KPI Dashboard',
    lastActivity: 'Just now',
    tasksCompleted: 89,
    uptime: '97.2%'
  },
  { 
    id: 'check', 
    name: 'Check', 
    role: 'QA Engineer',
    emoji: '🧪',
    status: 'idle', 
    currentTask: null,
    lastActivity: '15 min ago',
    tasksCompleted: 234,
    uptime: '99.5%'
  },
  { 
    id: 'deploy', 
    name: 'Deploy', 
    role: 'DevOps',
    emoji: '🚀',
    status: 'idle', 
    currentTask: null,
    lastActivity: '1 hour ago',
    tasksCompleted: 67,
    uptime: '98.9%'
  },
]

const agentEmojis: Record<string, string> = {
  sage: '🧠',
  forge: '🔨',
  check: '🧪',
  deploy: '🚀'
}

const agentIcons: Record<string, React.ReactNode> = {
  sage: <Brain className="w-5 h-5 text-purple-400" />,
  forge: <Zap className="w-5 h-5 text-orange-400" />,
  check: <Check className="w-5 h-5 text-green-400" />,
  deploy: <Rocket className="w-5 h-5 text-blue-400" />
}

export default function AgentsPage() {
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
              <Link href="/kpi" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <BarChart3 className="w-4 h-4" />
                KPI
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Agents</h1>
            <p className="text-gray-400 mt-2">Monitor all agents and their current status</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{agents.length}</p>
                <p className="text-sm text-gray-400">Total Agents</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{agents.filter(a => a.status === 'running').length}</p>
                <p className="text-sm text-gray-400">Running</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{agents.filter(a => a.status === 'idle').length}</p>
                <p className="text-sm text-gray-400">Idle</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{agents.reduce((acc, a) => acc + a.tasksCompleted, 0)}</p>
                <p className="text-sm text-gray-400">Tasks Done</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center text-3xl">
                    {agentEmojis[agent.id]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{agent.name}</h3>
                    <p className="text-sm text-gray-400">{agent.role}</p>
                  </div>
                </div>
                <StatusBadge status={agent.status} />
              </div>

              {agent.currentTask && (
                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-gray-400">Current Task</p>
                  <p className="font-medium">{agent.currentTask}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <p className="text-sm text-gray-400">Last Activity</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {agent.lastActivity}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Tasks Done</p>
                  <p className="font-medium">{agent.tasksCompleted}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Uptime</p>
                  <p className="font-medium text-green-400">{agent.uptime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ExternalAgentsSection />
      </main>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const configs = {
    running: { icon: <CheckCircle2 className="w-4 h-4" />, bg: 'bg-green-500/20', text: 'text-green-400', label: 'Running' },
    idle: { icon: <Clock className="w-4 h-4" />, bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Idle' },
    error: { icon: <XCircle className="w-4 h-4" />, bg: 'bg-red-500/20', text: 'text-red-400', label: 'Error' }
  }
  
  const config = configs[status as keyof typeof configs] || configs.idle
  
  return (
    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${config.bg} ${config.text}`}>
      {config.icon}
      {config.label}
    </span>
  )
}
