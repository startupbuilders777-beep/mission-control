import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/sessions/[id]/export - Export session logs as JSON or text
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { format } = await request.json().catch(() => ({}))
    
    const session = await prisma.session.findUnique({
      where: { id: params.id }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const exportData = {
      id: session.id,
      agent_id: session.agent_id,
      agent_name: session.agent_name,
      task_name: session.task_name,
      input: session.input,
      output: session.output,
      status: session.status,
      duration_ms: session.duration_ms,
      started_at: session.started_at,
      completed_at: session.completed_at,
      metadata: session.metadata ? JSON.parse(session.metadata) : null
    }

    if (format === 'text') {
      const text = `
Agent Session Export
=====================
Session ID: ${session.id}
Agent: ${session.agent_name} (${session.agent_id})
Task: ${session.task_name || 'N/A'}
Status: ${session.status}
Started: ${session.started_at.toISOString()}
${session.completed_at ? `Completed: ${session.completed_at.toISOString()}` : ''}
${session.duration_ms ? `Duration: ${session.duration_ms}ms` : ''}

--- INPUT ---
${session.input}

--- OUTPUT ---
${session.output || 'No output'}

--- METADATA ---
${session.metadata || 'No metadata'}
      `.trim()

      return new NextResponse(text, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="session-${session.id}.txt"`
        }
      })
    }

    // Default to JSON
    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="session-${session.id}.json"`
      }
    })
  } catch (error) {
    console.error('Error exporting session:', error)
    return NextResponse.json(
      { error: 'Failed to export session' },
      { status: 500 }
    )
  }
}
