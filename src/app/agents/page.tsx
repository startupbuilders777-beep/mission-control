'use client'

import ExternalAgentsSection from '@/components/ExternalAgents'
import Link from 'next/link'
import { useState } from 'react'
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
  Rocket,
  Menu,
  X
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

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-400"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 border-b border-gray-800 md:hidden">
          <div className="flex flex-col p-4 gap-3">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white py-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/projects" className="flex items-center gap-2 text-gray-400 hover:text-white py-2">
              <Folder className="w-4 h-4" />
              Projects
            </Link>
            <Link href="/kpi" className="flex items-center gap-2 text-gray-400 hover:text-white py-2">
              <BarChart3 className="w-4 h-4" />
              KPI
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
              <div>
                <h1 className="text-lg md:text-xl font-bold">Mission Control</h1>
                <p className="text-xs text-gray-400 hidden sm:block">Agent Swarm Dashboard</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/projects" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <Folder className="w-4 h-4" />
                Projects
              </Link>
              <Link href="/kpi" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <BarChart3 className="w-4 h-4" />
                KPI
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Agents</h1>
            <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-base">Monitor all agents and their current status</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 md:px-4 py-2 rounded-lg transition text-sm md:text-base">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 md:w-10 h-8 md:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Bot className="w-4 md:w-5 h-4 md:h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">{agents.length}</p>
                <p className="text-xs md:text-sm text-gray-400">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 md:w-10 h-8 md:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">{agents.filter(a => a.status === 'running').length}</p>
                <p className="text-xs md:text-sm text-gray-400">Running</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 md:w-10 h-8 md:h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 md:w-5 h-4 md:h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">{agents.filter(a => a.status === 'idle').length}</p>
                <p className="text-xs md:text-sm text-gray-400">Idle</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 md:w-10 h-8 md:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold">{agents.reduce((acc, a) => acc + a.tasksCompleted, 0)}</p>
                <p className="text-xs md:text-sm text-gray-400">Tasks Done</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-6 hover:border-gray-600 transition">
              <div className="flex items-start justify-between mb-3 md:mb-4 gap-3">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 md:w-14 h-10 md:h-14 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center text-2xl md:text-3xl">
                    {agentEmojis[agent.id]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg">{agent.name}</h3>
                    <p className="text-xs md:text-sm text-gray-400">{agent.role}</p>
                  </div>
                </div>
                <StatusBadge status={agent.status} />
              </div>

              {agent.currentTask && (
                <div className="mb-3 md:mb-4 p-2 md:p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-400">Current Task</p>
                  <p className="font-medium text-sm md:text-base">{agent.currentTask}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 md:gap-4 pt-3 md:pt-4 border-t border-gray-700">
                <div>
                  <p className="text-xs text-gray-400">Last Activity</p>
                  <p className="font-medium text-xs md:text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {agent.lastActivity}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Tasks Done</p>
                  <p className="font-medium text-sm md:text-base">{agent.tasksCompleted}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Uptime</p>
                  <p className="font-medium text-sm md:text-base text-green-400">{agent.uptime}</p>
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
    <span className={`flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${config.bg} ${config.text}`}>
      {config.icon}
      <span className="hidden sm:inline">{config.label}</span>
    </span>
  )
}
