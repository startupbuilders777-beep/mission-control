import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      // Send initial connection event
      sendEvent({ type: 'connected', timestamp: new Date().toISOString() })

      // Poll for metrics every 2 seconds
      const interval = setInterval(async () => {
        try {
          // Get all active agents with recent activity
          const agents = await prisma.agent.findMany({
            where: {
              status: { not: 'offline' },
            },
            select: {
              id: true,
              name: true,
              status: true,
              last_heartbeat: true,
            },
            take: 50,
          })

          // Get recent activity count per agent
          const fiveSecondsAgo = new Date(Date.now() - 5000)
          
          const metrics = await Promise.all(
            agents.map(async (agent) => {
              const recentActivity = await prisma.activity.count({
                where: {
                  agent_id: agent.id,
                  created_at: { gte: fiveSecondsAgo },
                },
              })

              // Simulate CPU/memory for demo (in production, fetch from actual monitoring)
              return {
                agentId: agent.id,
                agentName: agent.name,
                status: agent.status,
                lastHeartbeat: agent.last_heartbeat,
                requestsPerMin: Math.floor(Math.random() * 100),
                cpu: Math.random() * 100,
                memory: Math.random() * 100,
                recentActivity,
              }
            })
          )

          sendEvent({
            type: 'metrics',
            timestamp: new Date().toISOString(),
            metrics,
          })
        } catch (error) {
          console.error('Metrics stream error:', error)
          sendEvent({ type: 'error', message: 'Failed to fetch metrics' })
        }
      }, 2000) // Update every 2 seconds

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
