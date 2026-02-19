'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  Plus, 
  Trash2, 
  TestTube, 
  Mail, 
  Webhook, 
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Cpu,
  Activity
} from 'lucide-react'

interface AlertRule {
  id: string
  name: string
  metric: string
  threshold: number
  condition: string
  notify_type: string
  destination: string
  enabled: boolean
  created_at: string
}

interface AlertHistoryItem {
  id: string
  alert_rule_id: string
  message: string
  triggered_at: string
  acknowledged: boolean
}

const metricOptions = [
  { value: 'cpu', label: 'CPU Usage', icon: Cpu, unit: '%' },
  { value: 'memory', label: 'Memory Usage', icon: Activity, unit: '%' },
  { value: 'errors', label: 'Error Rate', icon: AlertTriangle, unit: '/min' },
  { value: 'response_time', label: 'Response Time', icon: TrendingUp, unit: 'ms' },
]

const conditionOptions = [
  { value: 'gt', label: 'Greater than', symbol: '>' },
  { value: 'lt', label: 'Less than', symbol: '<' },
  { value: 'eq', label: 'Equals', symbol: '=' },
]

const notifyTypeOptions = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'webhook', label: 'Webhook', icon: Webhook },
  { value: 'discord', label: 'Discord', icon: MessageSquare },
]

export default function AlertsPage() {
  const [rules, setRules] = useState<AlertRule[]>([])
  const [history, setHistory] = useState<AlertHistoryItem[]>([])
  const [activeTab, setActiveTab] = useState<'rules' | 'history'>('rules')
  const [showForm, setShowForm] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    metric: 'cpu',
    threshold: '',
    condition: 'gt',
    notify_type: 'webhook',
    destination: ''
  })

  useEffect(() => {
    fetchRules()
    fetchHistory()
  }, [])

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/alerts')
      if (res.ok) {
        const data = await res.json()
        setRules(data)
      }
    } catch (error) {
      console.error('Error fetching rules:', error)
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/alerts/history')
      if (res.ok) {
        const data = await res.json()
        setHistory(data)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setFormData({ name: '', metric: 'cpu', threshold: '', condition: 'gt', notify_type: 'webhook', destination: '' })
        setShowForm(false)
        fetchRules()
      }
    } catch (error) {
      console.error('Error creating rule:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this alert rule?')) return
    try {
      const res = await fetch('/api/alerts?id=' + id, { method: 'DELETE' })
      if (res.ok) fetchRules()
    } catch (error) {
      console.error('Error deleting rule:', error)
    }
  }

  const handleToggle = async (rule: AlertRule) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rule.id, enabled: !rule.enabled })
      })
      if (res.ok) fetchRules()
    } catch (error) {
      console.error('Error toggling rule:', error)
    }
  }

  const handleTest = async (rule: AlertRule) => {
    setTesting(rule.id)
    try {
      const res = await fetch('/api/alerts/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notify_type: rule.notify_type, destination: rule.destination })
      })
      const data = await res.json()
      alert(res.ok ? 'Test successful!' : 'Test failed: ' + data.error)
    } catch (error) {
      alert('Test failed')
    } finally {
      setTesting(null)
    }
  }

  const getMetricIcon = (metric: string) => {
    const option = metricOptions.find(m => m.value === metric)
    if (option) return <option.icon className="w-4 h-4" />
    return <Activity className="w-4 h-4" />
  }

  const getNotifyIcon = (type: string) => {
    const option = notifyTypeOptions.find(n => n.value === type)
    if (option) return <option.icon className="w-4 h-4" />
    return <Bell className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Alert Configuration</h1>
                <p className="text-xs text-gray-400">Configure agent monitoring alerts</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              New Alert
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('rules')}
            className={'pb-3 px-2 transition relative ' + (activeTab === 'rules' ? 'text-orange-400' : 'text-gray-400 hover:text-white')}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Alert Rules
              <span className="bg-gray-700 px-2 py-0.5 rounded-full text-xs">{rules.length}</span>
            </div>
            {activeTab === 'rules' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={'pb-3 px-2 transition relative ' + (activeTab === 'history' ? 'text-orange-400' : 'text-gray-400 hover:text-white')}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Alert History
              <span className="bg-gray-700 px-2 py-0.5 rounded-full text-xs">{history.length}</span>
            </div>
            {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Alert Rule</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rule Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                    placeholder="High CPU Alert"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Metric</label>
                  <select
                    value={formData.metric}
                    onChange={e => setFormData({ ...formData, metric: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                  >
                    {metricOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={e => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                  >
                    {conditionOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Threshold</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.threshold}
                    onChange={e => setFormData({ ...formData, threshold: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                    placeholder="80"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Notify Type</label>
                  <select
                    value={formData.notify_type}
                    onChange={e => setFormData({ ...formData, notify_type: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                  >
                    {notifyTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Destination</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                    placeholder={formData.notify_type === 'email' ? 'admin@example.com' : 'https://...'}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded-lg transition">
                  Create Rule
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-4">
            {rules.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400">No alert rules configured</h3>
                <p className="text-gray-500 mt-2">Create your first alert rule to start monitoring</p>
              </div>
            ) : (
              rules.map(rule => (
                <div key={rule.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={'w-10 h-10 rounded-lg flex items-center justify-center ' + (rule.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400')}>
                        {getMetricIcon(rule.metric)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{rule.name}</h3>
                          <span className={'px-2 py-0.5 rounded text-xs ' + (rule.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-400')}>
                            {rule.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          When {rule.metric} is {rule.condition} {rule.threshold}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          {getNotifyIcon(rule.notify_type)}
                          <span>{rule.notify_type}</span>
                          <span className="text-gray-600">•</span>
                          <span className="truncate max-w-[200px]">{rule.destination}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTest(rule)}
                        disabled={testing === rule.id}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition disabled:opacity-50"
                        title="Test notification"
                      >
                        <TestTube className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggle(rule)}
                        className={'p-2 rounded-lg transition ' + (rule.enabled ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-green-500/20 hover:bg-green-500/30 text-green-400')}
                        title={rule.enabled ? 'Disable' : 'Enable'}
                      >
                        {rule.enabled ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="p-2 bg-gray-700 hover:bg-red-600/50 text-gray-400 hover:text-red-400 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400">No alert history</h3>
                <p className="text-gray-500 mt-2">Triggered alerts will appear here</p>
              </div>
            ) : (
              history.map(alert => (
                <div key={alert.id} className={'bg-gray-800 border rounded-xl p-4 ' + (alert.acknowledged ? 'border-gray-700' : 'border-orange-500/50')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={'w-5 h-5 ' + (alert.acknowledged ? 'text-gray-500' : 'text-orange-500')} />
                      <div>
                        <p className={alert.acknowledged ? 'text-gray-400' : 'text-white'}>{alert.message}</p>
                        <p className="text-xs text-gray-500">{new Date(alert.triggered_at).toLocaleString()}</p>
                      </div>
                    </div>
                    {alert.acknowledged ? (
                      <span className="text-xs text-gray-500">Acknowledged</span>
                    ) : (
                      <button className="text-xs text-orange-400 hover:text-orange-300" onClick={async () => {
                        await fetch('/api/alerts/history', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: alert.id, acknowledged: true }) })
                        fetchHistory()
                      }}>Acknowledge</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
