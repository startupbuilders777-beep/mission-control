import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agentId')
  const metricType = searchParams.get('metricType')
  const days = parseInt(searchParams.get('days') || '7')

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const where: any = {
    recorded_at: {
      gte: startDate,
    },
  }

  if (agentId) {
    where.agent_id = agentId
  }

  if (metricType) {
    where.metric_type = metricType
  }

  const metrics = await prisma.historicalMetric.findMany({
    where,
    orderBy: {
      recorded_at: 'asc',
    },
    take: 1000,
  })

  // Group by metric type for charts
  const grouped: Record<string, { timestamp: string; value: number }[]> = {}
  
  for (const metric of metrics) {
    if (!grouped[metric.metric_type]) {
      grouped[metric.metric_type] = []
    }
    grouped[metric.metric_type].push({
      timestamp: metric.recorded_at.toISOString(),
      value: metric.value,
    })
  }

  return NextResponse.json({
    period: { start: startDate.toISOString(), days },
    metrics: grouped,
  })
}
