import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET single external agent
// POST to fetch latest metrics from external agent
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const agent = await prisma.externalAgent.findUnique({
    where: { id },
  })

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  return NextResponse.json({ agent })
}

// POST - fetch metrics from external agent
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const agent = await prisma.externalAgent.findUnique({
    where: { id },
  })

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  try {
    // Try to fetch metrics from the external agent
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add API key if configured
    if (agent.apiKey) {
      headers['Authorization'] = `Bearer ${agent.apiKey}`
    }

    // Try common metric endpoints
    const endpoints = ['/metrics', '/api/metrics', '/health', '/api/status']
    let metrics = null
    let status = 'error'

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${agent.url}${endpoint}`, {
          headers,
          signal: AbortSignal.timeout(5000),
        })

        if (response.ok) {
          metrics = await response.json()
          status = 'online'
          break
        }
      } catch {
        // Try next endpoint
      }
    }

    // Update agent with latest status and metrics
    const updated = await prisma.externalAgent.update({
      where: { id },
      data: {
        status,
        lastCheck: new Date(),
        lastMetrics: metrics ? JSON.stringify(metrics) : null,
      },
    })

    return NextResponse.json({
      agent: updated,
      metrics,
    })
  } catch (error) {
    // Mark as offline on error
    await prisma.externalAgent.update({
      where: { id },
      data: {
        status: 'offline',
        lastCheck: new Date(),
      },
    })

    return NextResponse.json(
      { error: 'Failed to fetch metrics from external agent' },
      { status: 500 }
    )
  }
}

// DELETE external agent
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    await prisma.externalAgent.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete external agent' },
      { status: 500 }
    )
  }
}
