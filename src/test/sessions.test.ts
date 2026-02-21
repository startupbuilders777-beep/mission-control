import { describe, it, expect } from 'vitest'

describe('Sessions API', () => {
  it('should have sessions route defined', async () => {
    // Verify the sessions page exists and has proper exports
    const pageModule = await import('../app/sessions/page')
    expect(pageModule.default).toBeDefined()
  })

  it('should have sessions API route defined', async () => {
    // Verify API routes exist
    const routeModule = await import('../app/api/sessions/route')
    expect(routeModule.GET).toBeDefined()
    expect(routeModule.POST).toBeDefined()
  })

  it('should have session [id] API route defined', async () => {
    const routeModule = await import('../app/api/sessions/[id]/route')
    expect(routeModule.GET).toBeDefined()
    expect(routeModule.PATCH).toBeDefined()
    expect(routeModule.POST).toBeDefined()
  })

  it('should have session export API route defined', async () => {
    const routeModule = await import('../app/api/sessions/[id]/export/route')
    expect(routeModule.POST).toBeDefined()
  })
})

describe('Session Model', () => {
  it('should have Session in Prisma schema', async () => {
    const fs = await import('fs')
    const schema = fs.readFileSync('./prisma/schema.prisma', 'utf-8')
    expect(schema).toContain('model Session')
    expect(schema).toContain('agent_id')
    expect(schema).toContain('input')
    expect(schema).toContain('output')
    expect(schema).toContain('status')
    expect(schema).toContain('duration_ms')
  })
})
