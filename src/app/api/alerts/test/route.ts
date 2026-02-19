import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { notify_type, destination } = body
    if (!notify_type || !destination) return NextResponse.json({ error: 'Missing notify_type or destination' }, { status: 400 })

    if (notify_type === 'webhook') {
      const testPayload = { content: '🔔 Test Alert from Mission Control\nThis is a test notification to verify your alert configuration is working correctly.' }
      try {
        const response = await fetch(destination, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(testPayload) })
        if (!response.ok) return NextResponse.json({ error: 'Webhook test failed: ' + response.status }, { status: 400 })
        return NextResponse.json({ success: true, message: 'Webhook test successful' })
      } catch (err: any) {
        return NextResponse.json({ error: 'Webhook test failed: ' + err.message }, { status: 400 })
      }
    }

    if (notify_type === 'discord') {
      const discordPayload = { 
        content: '🔔 Test Alert from Mission Control', 
        embeds: [{ 
          title: 'Test Notification', 
          description: 'This is a test to verify your Discord webhook is configured correctly.', 
          color: 0x3B82F6, 
          timestamp: new Date().toISOString() 
        }] 
      } as any
      try {
        const response = await fetch(destination, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(discordPayload) })
        if (!response.ok) return NextResponse.json({ error: 'Discord test failed: ' + response.status }, { status: 400 })
        return NextResponse.json({ success: true, message: 'Discord test successful' })
      } catch (err: any) {
        return NextResponse.json({ error: 'Discord test failed: ' + err.message }, { status: 400 })
      }
    }

    if (notify_type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(destination)) return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
      return NextResponse.json({ success: true, message: 'Email configuration validated (sending not implemented)' })
    }

    return NextResponse.json({ error: 'Unknown notify_type' }, { status: 400 })
  } catch (error) {
    console.error('Error testing alert:', error)
    return NextResponse.json({ error: 'Failed to test alert' }, { status: 500 })
  }
}
