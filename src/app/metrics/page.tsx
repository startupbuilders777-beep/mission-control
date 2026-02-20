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
  Clock
} from 'lucide-react'

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

export default function MetricsPage() {
  const [connected, setConnected] = useState(false)
  const [metrics, setMetrics] = useState<AgentMetric[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Real-Time Agent Metrics</h1>
          <p className="text-gray-500">Live monitoring of all active agents</p>
        </div>
        
        <div className="flex items-center gap-4">
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
          {lastUpdate && (
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>

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
    </div>
  )
}
