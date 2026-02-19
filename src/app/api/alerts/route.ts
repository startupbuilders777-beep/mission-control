import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const rules = await prisma.alertRule.findMany({ orderBy: { created_at: 'desc' } })
    return NextResponse.json(rules)
  } catch (error) {
    console.error('Error fetching alert rules:', error)
    return NextResponse.json({ error: 'Failed to fetch alert rules' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, metric, threshold, condition, notify_type, destination } = body
    if (!name || !metric || threshold === undefined || !condition || !notify_type || !destination) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const rule = await prisma.alertRule.create({
      data: { name, metric, threshold: parseFloat(threshold), condition, notify_type, destination, enabled: true, updated_at: new Date() }
    })
    return NextResponse.json(rule)
  } catch (error) {
    console.error('Error creating alert rule:', error)
    return NextResponse.json({ error: 'Failed to create alert rule' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing rule ID' }, { status: 400 })
    await prisma.alertRule.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting alert rule:', error)
    return NextResponse.json({ error: 'Failed to delete alert rule' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, metric, threshold, condition, notify_type, destination, enabled } = body
    if (!id) return NextResponse.json({ error: 'Missing rule ID' }, { status: 400 })
    const rule = await prisma.alertRule.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(metric && { metric }),
        ...(threshold !== undefined && { threshold: parseFloat(threshold) }),
        ...(condition && { condition }),
        ...(notify_type && { notify_type }),
        ...(destination && { destination }),
        ...(enabled !== undefined && { enabled })
      }
    })
    return NextResponse.json(rule)
  } catch (error) {
    console.error('Error updating alert rule:', error)
    return NextResponse.json({ error: 'Failed to update alert rule' }, { status: 500 })
  }
}
