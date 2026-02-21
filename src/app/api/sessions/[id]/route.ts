import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/sessions/[id] - Get a single session by ID
// PATCH /api/sessions/[id] - Update session (complete, fail, etc.)
// POST /api/sessions/[id]/rerun - Re-run a session

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.session.findUnique({
      where: { id: params.id }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, output, duration_ms } = body

    const updateData: Record<string, unknown> = {}
    
    if (status) updateData.status = status
    if (output !== undefined) updateData.output = output
    if (duration_ms !== undefined) updateData.duration_ms = duration_ms
    if (status === 'completed' || status === 'failed') {
      updateData.completed_at = new Date()
    }

    const session = await prisma.session.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

// Re-run a session
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if the original session exists
    const originalSession = await prisma.session.findUnique({
      where: { id: params.id }
    })

    if (!originalSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Create a new session with the same input
    const newSession = await prisma.session.create({
      data: {
        agent_id: originalSession.agent_id,
        agent_name: originalSession.agent_name,
        task_name: originalSession.task_name,
        input: originalSession.input,
        metadata: originalSession.metadata,
        status: 'running'
      }
    })

    return NextResponse.json(newSession, { status: 201 })
  } catch (error) {
    console.error('Error re-running session:', error)
    return NextResponse.json(
      { error: 'Failed to re-run session' },
      { status: 500 }
    )
  }
}
