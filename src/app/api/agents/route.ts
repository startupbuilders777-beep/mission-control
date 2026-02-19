import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * @swagger
 * /api/agents:
 *   get:
 *     summary: List all agents
 *     description: Returns a list of all agents
 *     responses:
 *       200:
 *         description: List of agents
 *   post:
 *     summary: Create a new agent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created agent
 */

// Get all agents
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { created_at: 'desc' }
    })
    
    return NextResponse.json({
      agents,
      count: agents.length
    })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

// Create a new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role } = body
    
    if (!name || !role) {
      return NextResponse.json(
        { error: 'Name and role are required' },
        { status: 400 }
      )
    }
    
    const agent = await prisma.agent.create({
      data: {
        name,
        role,
        status: 'idle'
      }
    })
    
    // Log activity
    await prisma.activity.create({
      data: {
        agent_id: agent.id,
        event: 'agent_created',
        message: `Agent ${name} created with role ${role}`
      }
    })
    
    return NextResponse.json(agent, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}
