'use client'

import { useEffect, useState, useRef } from 'react'
import { 
  Activity, 
  Cpu, 
  MemoryStick, 
  Zap, 
  Wifi, 
  WifiOff,
  RefreshCw,
  Server,
  Clock,
  TrendingUp
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts'

interface AgentMetric {
  agentId: string
  agentName: string
  status: string
  lastHeartbeat: string
  requestsPerMin: number
  cpu: number
  memory: number
  recentActivity: number
}

interface HistoricalDataPoint {
  timestamp: string
  value: number
}

interface HistoricalGroup {
  [key: string]: HistoricalDataPoint[]
}

export default function MetricsPage() {
  const [connected, setConnected] = useState(false)
  const [metrics, setMetrics] = useState<AgentMetric[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState<'live' | 'history'>('live')
  const [historicalData, setHistoricalData] = useState<HistoricalGroup>({})
  const [historyDays, setHistoryDays] = useState(7)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Fetch historical data
  const fetchHistoricalData = async (days: number) => {
    setLoadingHistory(true)
    try {
      const res = await fetch(`/api/metrics/history?days=${days}`)
      const data = await res.json()
      setHistoricalData(data.metrics || {})
    } catch (error) {
      console.error('Failed to fetch historical data:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    // Connect to SSE endpoint
    const eventSource = new EventSource('/api/metrics/stream')
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'connected') {
          console.log('SSE connected')
        } else if (data.type === 'metrics') {
          setMetrics(data.metrics)
          setLastUpdate(new Date())
        } else if (data.type === 'error') {
          console.error('SSE error:', data.message)
        }
      } catch (error) {
        console.error('Failed to parse SSE message:', error)
      }
    }

    eventSource.onerror = () => {
      setConnected(false)
      // Try to reconnect after 5 seconds
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          const newSource = new EventSource('/api/metrics/stream')
          eventSourceRef.current = newSource
        }
      }, 5000)
    }

    return () => {
      eventSource.close()
    }
  }, [])

  // Fetch historical data when tab changes
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistoricalData(historyDays)
    }
  }, [activeTab, historyDays])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'offline': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getMetricColor = (value: number) => {
    if (value > 90) return 'text-red-500'
    if (value > 70) return 'text-yellow-500'
    return 'text-green-500'
  }

  // Prepare chart data
  const prepareChartData = () => {
    const timestamps = new Set<string>()
    Object.values(historicalData).forEach(points => {
      points.forEach(p => timestamps.add(p.timestamp))
    })
    
    const sortedTimestamps = Array.from(timestamps).sort()
    
    return sortedTimestamps.map(ts => {
      const point: Record<string, unknown> = { time: new Date(ts).toLocaleTimeString() }
      Object.entries(historicalData).forEach(([type, points]) => {
        const match = points.find(p => p.timestamp === ts)
        point[type] = match ? match.value : null
      })
      return point
    })
  }

  const chartData = prepareChartData()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Agent Metrics</h1>
          <p className="text-gray-500">Monitor agent performance and trends</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'live' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              Live
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              History
            </button>
          </div>

          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {connected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {connected ? 'Live' : 'Disconnected'}
            </span>
          </div>
          
          {/* Last Update */}
          {lastUpdate && activeTab === 'live' && (
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Live Metrics Tab */}
      {activeTab === 'live' && (
        <>
          {/* Metrics Grid */}
          {metrics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map((agent) => (
                <div 
                  key={agent.agentId}
                  className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow"
                >
                  {/* Agent Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                      <div>
                        <h3 className="font-semibold">{agent.agentName}</h3>
                        <p className="text-xs text-gray-500 capitalize">{agent.status}</p>
                      </div>
                    </div>
                    <Activity className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* CPU */}
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <Cpu className={`w-4 h-4 mx-auto mb-1 ${getMetricColor(agent.cpu)}`} />
                      <p className={`text-lg font-bold ${getMetricColor(agent.cpu)}`}>
                        {agent.cpu.toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-500">CPU</p>
                    </div>

                    {/* Memory */}
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <MemoryStick className={`w-4 h-4 mx-auto mb-1 ${getMetricColor(agent.memory)}`} />
                      <p className={`text-lg font-bold ${getMetricColor(agent.memory)}`}>
                        {agent.memory.toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-500">Memory</p>
                    </div>

                    {/* Requests */}
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <Zap className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                      <p className="text-lg font-bold text-blue-600">
                        {agent.requestsPerMin}
                      </p>
                      <p className="text-xs text-gray-500">req/min</p>
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="mt-3 pt-3 border-t text-xs text-gray-500 flex justify-between">
                    <span>Recent: {agent.recentActivity} events</span>
                    <span>Heartbeat: {new Date(agent.lastHeartbeat).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Waiting for agent data...</p>
              {connected && (
                <p className="text-sm text-gray-400 mt-2">
                  Connected to stream, waiting for metrics
                </p>
              )}
            </div>
          )}

          {/* No Agents State */}
          {connected && metrics.length === 0 && (
            <div className="text-center py-8">
              <Server className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No active agents found</p>
              <p className="text-sm text-gray-400 mt-1">
                Start some agents to see real-time metrics
              </p>
            </div>
          )}
        </>
      )}

      {/* Historical Tab */}
      {activeTab === 'history' && (
        <>
          {/* Date Range Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-600">Show data for:</span>
            <div className="flex gap-2">
              {[7, 30, 90].map(days => (
                <button
                  key={days}
                  onClick={() => setHistoryDays(days)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    historyDays === days
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>

          {/* Historical Charts */}
          {loadingHistory ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Loading historical data...</p>
            </div>
          ) : chartData.length > 0 ? (
            <div className="space-y-6">
              {/* CPU Chart */}
              <div className="bg-white rounded-xl border p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-gray-500" />
                  CPU Usage Over Time
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="cpu" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={false}
                        name="CPU %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Memory Chart */}
              <div className="bg-white rounded-xl border p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MemoryStick className="w-5 h-5 text-gray-500" />
                  Memory Usage Over Time
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="memory" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        dot={false}
                        name="Memory %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Requests Chart */}
              <div className="bg-white rounded-xl border p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gray-500" />
                  Requests Per Minute
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="requests" 
                        stroke="#ffc658" 
                        strokeWidth={2}
                        dot={false}
                        name="Req/min"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Server className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No historical data available</p>
              <p className="text-sm text-gray-400 mt-1">
                Historical data will appear after agents have been running for a while
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
