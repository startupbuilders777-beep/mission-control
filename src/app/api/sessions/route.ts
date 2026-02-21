import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/sessions - List all sessions with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agent_id')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: Record<string, unknown> = {}
    
    if (agentId) {
      where.agent_id = agentId
    }
    
    if (status) {
      where.status = status
    }

    const sessions = await prisma.session.findMany({
      where,
      orderBy: {
        started_at: 'desc'
      },
      take: limit,
      skip: offset
    })

    const total = await prisma.session.count({ where })

    return NextResponse.json({
      sessions,
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

// POST /api/sessions - Create a new session
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { agent_id, agent_name, task_name, input, metadata } = body

    if (!agent_id || !agent_name || !input) {
      return NextResponse.json(
        { error: 'Missing required fields: agent_id, agent_name, input' },
        { status: 400 }
      )
    }

    const session = await prisma.session.create({
      data: {
        agent_id,
        agent_name,
        task_name,
        input,
        metadata: metadata ? JSON.stringify(metadata) : null,
        status: 'running'
      }
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
