import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const boardPath = path.join(process.cwd(), '../../tasks/board.json')

export async function GET() {
  try {
    const data = fs.readFileSync(boardPath, 'utf-8')
    const board = JSON.parse(data)
    return NextResponse.json(board)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load board' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, ticketId, data } = body
    
    const boardData = JSON.parse(fs.readFileSync(boardPath, 'utf-8'))
    
    if (action === 'updateTicket') {
      const ticket = boardData.tickets.find((t: any) => t.ticket_id === ticketId)
      if (ticket) {
        Object.assign(ticket, data)
      }
    } else if (action === 'addActivity') {
      boardData.activity.push({
        id: boardData.activity.length + 1,
        ticket_id: ticketId,
        ...data,
        created_at: new Date().toISOString()
      })
    }
    
    fs.writeFileSync(boardPath, JSON.stringify(boardData, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update board' }, { status: 500 })
  }
}
