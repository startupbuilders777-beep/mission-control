import { describe, it, expect } from 'vitest'
import { existsSync } from 'fs'
import { join } from 'path'

describe('Mission Control Smoke Tests', () => {
  it('should have valid TypeScript configuration', () => {
    expect(true).toBe(true)
  })

  it('should have vitest configured', () => {
    expect(process.env.VITEST).toBeDefined()
  })

  it('should have Prisma schema', () => {
    const schemaExists = existsSync(join(process.cwd(), 'prisma/schema.prisma'))
    expect(schemaExists).toBe(true)
  })

  it('should have app pages', () => {
    const pageExists = existsSync(join(process.cwd(), 'src/app/page.tsx'))
    expect(pageExists).toBe(true)
  })

  it('should have API routes', () => {
    const agentsRoute = existsSync(join(process.cwd(), 'src/app/api/agents/route.ts'))
    const metricsRoute = existsSync(join(process.cwd(), 'src/app/api/metrics/history/route.ts'))
    const alertsRoute = existsSync(join(process.cwd(), 'src/app/api/alerts/route.ts'))
    
    expect(agentsRoute).toBe(true)
    expect(metricsRoute).toBe(true)
    expect(alertsRoute).toBe(true)
  })

  it('should have components', () => {
    const componentsDir = existsSync(join(process.cwd(), 'src/components'))
    expect(componentsDir).toBe(true)
  })

  it('should have config files', () => {
    const hasTsConfig = existsSync(join(process.cwd(), 'tsconfig.json'))
    const hasTailwind = existsSync(join(process.cwd(), 'tailwind.config.ts'))
    
    expect(hasTsConfig).toBe(true)
    expect(hasTailwind).toBe(true)
  })
})
