'use client'

import { useState, useEffect } from 'react'
import { 
  Bot, 
  Plus, 
  RefreshCw, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface ExternalAgent {
  id: string
  name: string
  url: string
  apiKey: string
  status: string
  lastCheck: string | null
  lastMetrics: string | null
  created_at: string
}

export default function ExternalAgentsSection() {
  const [agents, setAgents] = useState<ExternalAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', url: '', apiKey: '' })
  const [error, setError] = useState('')

  const fetchAgents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/external-agents')
      const data = await res.json()
      setAgents(data.agents || [])
    } catch (err) {
      console.error('Failed to fetch external agents:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/external-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add agent')
      }

      setFormData({ name: '', url: '', apiKey: '' })
      setShowForm(false)
      fetchAgents()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRefresh = async (agentId: string) => {
    try {
      const res = await fetch(`/api/external-agents/${agentId}`, { method: 'POST' })
      if (res.ok) {
        fetchAgents()
      }
    } catch (err) {
      console.error('Failed to refresh agent:', err)
    }
  }

  const handleDelete = async (agentId: string) => {
    if (!confirm('Are you sure you want to remove this external agent?')) return
    
    try {
      const res = await fetch(`/api/external-agents/${agentId}`, { method: 'DELETE' })
      if (res.ok) {
        fetchAgents()
      }
    } catch (err) {
      console.error('Failed to delete agent:', err)
    }
  }

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: JSX.Element; bg: string; text: string; label: string }> = {
      online: { icon: <CheckCircle2 className="w-4 h-4" />, bg: 'bg-green-500/20', text: 'text-green-400', label: 'Online' },
      offline: { icon: <XCircle className="w-4 h-4" />, bg: 'bg-red-500/20', text: 'text-red-400', label: 'Offline' },
      unknown: { icon: <Clock className="w-4 h-4" />, bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Unknown' },
      error: { icon: <AlertCircle className="w-4 h-4" />, bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Error' }
    }
    return configs[status] || configs.unknown
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">External Agents</h2>
          <p className="text-gray-400 mt-1">Monitor agents running outside MissionControl</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchAgents}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Add Agent
          </button>
        </div>
      </div>

      {/* Add Agent Form */}
      {showForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add External Agent</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Agent Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My External Agent"
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Agent URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://agent.example.com"
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">API Key (optional)</label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder="Bearer token for auth"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {submitting ? 'Adding...' : 'Add Agent'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* External Agents List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : agents.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <Bot className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300">No External Agents</h3>
          <p className="text-gray-400 mt-1">Add agents running outside MissionControl to monitor them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => {
            const statusConfig = getStatusConfig(agent.status)
            return (
              <div key={agent.id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <a 
                        href={agent.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        {agent.url.replace(/^https?:\/\//, '').slice(0, 30)}...
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig.bg} ${statusConfig.text}`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>
                </div>

                {agent.lastCheck && (
                  <p className="text-xs text-gray-400 mb-3">
                    Last checked: {new Date(agent.lastCheck).toLocaleString()}
                  </p>
                )}

                {agent.lastMetrics && (
                  <div className="mb-3 p-2 bg-gray-700/50 rounded-lg text-xs font-mono text-gray-300 overflow-hidden">
                    <pre className="truncate">{JSON.stringify(JSON.parse(agent.lastMetrics), null, 2).slice(0, 100)}</pre>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-gray-700">
                  <button
                    onClick={() => handleRefresh(agent.id)}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                  </button>
                  <button
                    onClick={() => handleDelete(agent.id)}
                    className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition ml-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
