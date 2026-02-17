import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/agents - List all agents with their status
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { last_heartbeat: 'desc' }
    })
    return NextResponse.json(agents)
  } catch (error) {
    console.error('Failed to fetch agents:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

// POST /api/agents - Create or update an agent
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, agentId, data } = body

    if (action === 'upsert') {
      const agent = await prisma.agent.upsert({
        where: { id: data.id },
        update: {
          status: data.status,
          current_task: data.current_task,
          last_heartbeat: new Date()
        },
        create: {
          id: data.id,
          name: data.name,
          role: data.role,
          status: data.status || 'idle',
          current_task: data.current_task,
          last_heartbeat: new Date()
        }
      })
      return NextResponse.json(agent)
    }

    if (action === 'heartbeat') {
      const agent = await prisma.agent.update({
        where: { id: agentId },
        data: {
          status: data.status || 'running',
          current_task: data.current_task,
          last_heartbeat: new Date()
        }
      })
      return NextResponse.json(agent)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Failed to update agent:', error)
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 })
  }
}
