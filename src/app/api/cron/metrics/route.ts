import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get retention days from env, default to 30
const RETENTION_DAYS = parseInt(process.env.DATA_RETENTION_DAYS || '30')

export async function POST() {
  try {
    // Get all active agents
    const agents = await prisma.agent.findMany({
      where: {
        status: { not: 'offline' },
      },
    })

    const now = new Date()

    // Record metrics for each agent
    // In a real system, these would come from actual monitoring
    // For now, we simulate some basic metrics
    const metricsToRecord = []

    for (const agent of agents) {
      // Simulate metrics (in production, fetch from actual monitoring)
      metricsToRecord.push(
        prisma.historicalMetric.create({
          data: {
            agent_id: agent.id,
            metric_type: 'cpu',
            value: Math.random() * 100, // 0-100%
            recorded_at: now,
          },
        }),
        prisma.historicalMetric.create({
          data: {
            agent_id: agent.id,
            metric_type: 'memory',
            value: Math.random() * 100, // 0-100%
            recorded_at: now,
          },
        }),
        prisma.historicalMetric.create({
          data: {
            agent_id: agent.id,
            metric_type: 'requests',
            value: Math.floor(Math.random() * 100), // 0-100/min
            recorded_at: now,
          },
        })
      )
    }

    await Promise.all(metricsToRecord)

    // Clean up old data
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS)

    const deleteResult = await prisma.historicalMetric.deleteMany({
      where: {
        recorded_at: {
          lt: cutoffDate,
        },
      },
    })

    return NextResponse.json({
      success: true,
      recorded: agents.length * 3,
      deleted: deleteResult.count,
      retentionDays: RETENTION_DAYS,
    })
  } catch (error) {
    console.error('Metrics cron error:', error)
    return NextResponse.json(
      { error: 'Failed to record metrics' },
      { status: 500 }
    )
  }
}
