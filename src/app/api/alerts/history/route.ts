import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const history = await prisma.alertHistory.findMany({ orderBy: { triggered_at: 'desc' }, take: 100 })
    return NextResponse.json(history)
  } catch (error) {
    console.error('Error fetching alert history:', error)
    return NextResponse.json({ error: 'Failed to fetch alert history' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, acknowledged } = body
    if (!id) return NextResponse.json({ error: 'Missing alert ID' }, { status: 400 })
    const alert = await prisma.alertHistory.update({ where: { id }, data: { acknowledged: acknowledged ?? true } })
    return NextResponse.json(alert)
  } catch (error) {
    console.error('Error acknowledging alert:', error)
    return NextResponse.json({ error: 'Failed to acknowledge alert' }, { status: 500 })
  }
}
