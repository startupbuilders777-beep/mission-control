import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Health check interval in minutes (default 5)
const HEALTH_CHECK_INTERVAL = parseInt(process.env.HEALTH_CHECK_INTERVAL || '5')

interface HealthStatus {
  agentId: string
  name: string
  status: 'healthy' | 'degraded' | 'down'
  lastHeartbeat: Date
  minutesSinceHeartbeat: number
  errorRate: number
}

export async function GET(request: NextRequest) {
  try {
    // Get all agents
    const agents = await prisma.agent.findMany()
    
    const healthStatuses: HealthStatus[] = []
    
    for (const agent of agents) {
      const lastHeartbeat = agent.last_heartbeat
      const now = new Date()
      const minutesSinceHeartbeat = Math.floor((now.getTime() - lastHeartbeat.getTime()) / 60000)
      
      // Calculate error rate from recent activities
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      const recentActivities = await prisma.activity.findMany({
        where: {
          agent_id: agent.id,
          created_at: { gte: oneHourAgo },
          event: { in: ['error', 'fail'] }
        }
      })
      
      const totalActivities = await prisma.activity.count({
        where: {
          agent_id: agent.id,
          created_at: { gte: oneHourAgo }
        }
      })
      
      const errorRate = totalActivities > 0 ? (recentActivities.length / totalActivities) * 100 : 0
      
      // Determine status
      let status: 'healthy' | 'degraded' | 'down' = 'healthy'
      
      if (minutesSinceHeartbeat > HEALTH_CHECK_INTERVAL * 2) {
        status = 'down'
      } else if (minutesSinceHeartbeat > HEALTH_CHECK_INTERVAL || errorRate > 10) {
        status = 'degraded'
      }
      
      healthStatuses.push({
        agentId: agent.id,
        name: agent.name,
        status,
        lastHeartbeat,
        minutesSinceHeartbeat,
        errorRate: Math.round(errorRate * 100) / 100
      })
    }
    
    // Get last health check timestamp
    const lastCheck = await prisma.activity.findFirst({
      where: { event: 'health_check' },
      orderBy: { created_at: 'desc' },
      select: { created_at: true }
    })
    
    return NextResponse.json({
      status: 'ok',
      lastCheck: lastCheck?.created_at || null,
      healthCheckInterval: HEALTH_CHECK_INTERVAL,
      agents: healthStatuses,
      summary: {
        total: healthStatuses.length,
        healthy: healthStatuses.filter(s => s.status === 'healthy').length,
        degraded: healthStatuses.filter(s => s.status === 'degraded').length,
        down: healthStatuses.filter(s => s.status === 'down').length
      }
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    )
  }
}

// Trigger health check (can be called by cron)
export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret')
    
    // Simple secret check (in production, use proper auth)
    if (secret !== process.env.CRON_SECRET && process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Run health check and log it
    const agents = await prisma.agent.findMany()
    const now = new Date()
    
    for (const agent of agents) {
      const minutesSinceHeartbeat = Math.floor(
        (now.getTime() - agent.last_heartbeat.getTime()) / 60000
      )
      
      let status = 'healthy'
      if (minutesSinceHeartbeat > HEALTH_CHECK_INTERVAL * 2) {
        status = 'down'
      } else if (minutesSinceHeartbeat > HEALTH_CHECK_INTERVAL) {
        status = 'degraded'
      }
      
      // Log health check
      await prisma.activity.create({
        data: {
          agent_id: agent.id,
          event: 'health_check',
          message: `Status: ${status}, Minutes since heartbeat: ${minutesSinceHeartbeat}`,
          metadata: JSON.stringify({ status, minutesSinceHeartbeat })
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      agentsChecked: agents.length,
      timestamp: now.toISOString()
    })
  } catch (error) {
    console.error('Health check trigger error:', error)
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    )
  }
}
