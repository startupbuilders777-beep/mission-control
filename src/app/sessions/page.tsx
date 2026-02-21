'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BarChart3, 
  Clock, 
  Play, 
  RotateCcw, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Folder,
  Search,
  Filter
} from 'lucide-react'

interface Session {
  id: string
  agent_id: string
  agent_name: string
  task_name: string | null
  input: string
  output: string | null
  status: string
  duration_ms: number | null
  started_at: string
  completed_at: string | null
  metadata: string | null
}

const agentColors: Record<string, string> = {
  sage: 'from-purple-500 to-indigo-600',
  forge: 'from-orange-500 to-red-600',
  check: 'from-green-500 to-emerald-600',
  deploy: 'from-blue-500 to-cyan-600'
}

const statusConfig: Record<string, { icon: JSX.Element; bg: string; text: string }> = {
  running: { icon: <Loader2 className="w-4 h-4 animate-spin" />, bg: 'bg-blue-500/20', text: 'text-blue-400' },
  completed: { icon: <CheckCircle2 className="w-4 h-4" />, bg: 'bg-green-500/20', text: 'text-green-400' },
  failed: { icon: <XCircle className="w-4 h-4" />, bg: 'bg-red-500/20', text: 'text-red-400' }
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSessions()
  }, [filter])

  const fetchSessions = async () => {
    try {
      const url = filter === 'all' 
        ? '/api/sessions?limit=100' 
        : `/api/sessions?status=${filter}&limit=100`
      const res = await fetch(url)
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRerun = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/rerun`, { method: 'POST' })
      if (res.ok) {
        fetchSessions()
      }
    } catch (error) {
      console.error('Error re-running session:', error)
    }
  }

  const handleExport = async (sessionId: string, format: 'json' | 'text' = 'json') => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format })
      })
      
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `session-${sessionId}.${format === 'text' ? 'txt' : 'json'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
      }
    } catch (error) {
      console.error('Error exporting session:', error)
    }
  }

  const filteredSessions = sessions.filter(session => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      session.agent_name?.toLowerCase().includes(search) ||
      session.task_name?.toLowerCase().includes(search) ||
      session.input?.toLowerCase().includes(search)
    )
  })

  const formatDuration = (ms: number | null) => {
    if (!ms) return 'N/A'
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString()
  }

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
              <Link href="/agents" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <Clock className="w-4 h-4" />
                Agents
              </Link>
              <Link href="/projects" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <Folder className="w-4 h-4" />
                Projects
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/agents" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold">Session Replay</h1>
            </div>
            <p className="text-gray-400 text-sm md:text-base">View past agent runs, re-run sessions, and export logs</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Sessions</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No sessions found</p>
            <p className="text-gray-500 text-sm mt-1">Sessions will appear here when agents run tasks</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Session List */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold mb-3">Sessions ({filteredSessions.length})</h2>
              {filteredSessions.map((session) => {
                const status = statusConfig[session.status] || statusConfig.running
                const colorClass = agentColors[session.agent_id] || 'from-gray-500 to-gray-600'
                
                return (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`bg-gray-800 border rounded-xl p-4 cursor-pointer transition ${
                      selectedSession?.id === session.id 
                        ? 'border-blue-500 ring-1 ring-blue-500' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center text-lg font-bold`}>
                          {session.agent_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{session.agent_name}</p>
                          <p className="text-sm text-gray-400">{session.task_name || 'General Task'}</p>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.bg} ${status.text}`}>
                        {status.icon}
                        {session.status}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                      <span>{formatDate(session.started_at)}</span>
                      <span>{formatDuration(session.duration_ms)}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Session Details */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              {selectedSession ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Session Details</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRerun(selectedSession.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Re-run
                      </button>
                      <button
                        onClick={() => handleExport(selectedSession.id, 'json')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition"
                      >
                        <Download className="w-4 h-4" />
                        JSON
                      </button>
                      <button
                        onClick={() => handleExport(selectedSession.id, 'text')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition"
                      >
                        <Download className="w-4 h-4" />
                        Text
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Session ID</p>
                      <p className="font-mono text-xs bg-gray-900 p-2 rounded">{selectedSession.id}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Agent</p>
                        <p className="font-medium">{selectedSession.agent_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Status</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig[selectedSession.status]?.bg || ''} ${statusConfig[selectedSession.status]?.text || ''}`}>
                          {statusConfig[selectedSession.status]?.icon}
                          {selectedSession.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Started</p>
                        <p className="text-sm">{formatDate(selectedSession.started_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Duration</p>
                        <p className="text-sm">{formatDuration(selectedSession.duration_ms)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Input</p>
                      <div className="bg-gray-900 p-3 rounded-lg text-sm max-h-40 overflow-y-auto">
                        {selectedSession.input || 'No input'}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Output</p>
                      <div className="bg-gray-900 p-3 rounded-lg text-sm max-h-60 overflow-y-auto">
                        {selectedSession.output || 'No output'}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a session to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
