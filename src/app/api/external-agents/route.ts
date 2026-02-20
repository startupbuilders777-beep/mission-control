import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET all external agents
export async function GET() {
  const agents = await prisma.externalAgent.findMany({
    orderBy: { created_at: 'desc' },
  })
  return NextResponse.json({ agents })
}

// POST create new external agent
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, url, apiKey } = body

    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      )
    }

    const agent = await prisma.externalAgent.create({
      data: {
        name,
        url: url.endsWith('/') ? url.slice(0, -1) : url,
        apiKey: apiKey || '',
        status: 'unknown',
      },
    })

    return NextResponse.json({ agent })
  } catch (error) {
    console.error('Error creating external agent:', error)
    return NextResponse.json(
      { error: 'Failed to create external agent' },
      { status: 500 }
    )
  }
}
