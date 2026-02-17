# Mission Control - Internal Agent Observability

## The Product

**Mission Control** = Real-time dashboard to monitor all agents (Sage, Forge, Check, Deploy) in our system.

## The Problem

- No visibility into what agents are doing
- Don't know if tasks are stuck/failed
- Can't see live agent activity
- No cost tracking across agents

## The Solution

A dashboard showing:
- **Live agent status** (running, idle, error)
- **Current task** (what each agent is working on)
- **Activity feed** (spawn, complete, fail events)
- **Cost tracking** (tokens, duration, errors)
- **Session logs** (raw transcript access)

---

## Tech Stack

- **Frontend:** Next.js 14 + Tailwind + shadcn/ui
- **Backend:** Next.js API routes
- **Database:** PostgreSQL + Prisma (for activity logs)
- **Real-time:** Polling (5s interval) or WebSocket

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Mission Control                      │
│  (Next.js Dashboard)                            │
├─────────────────────────────────────────────────┤
│  /api/agents     - List all agents + status     │
│  /api/activity   - Recent activity feed         │
│  /api/metrics    - Cost/token aggregation       │
│  /api/sessions   - Session logs                 │
└─────────────────────────────────────────────────┘
                          │
                    ┌──────┴──────┐
                    │  Database   │
                    │  (activity, │
                    │   metrics)  │
                    └─────────────┘
```

---

## Data Model

### Activity Log
```
- id: UUID
- agent_id: string
- event: spawn | complete | fail | error | heartbeat
- task_id: string (optional)
- message: string
- metadata: JSON (tokens, cost, duration)
- created_at: timestamp
```

### Agent
```
- id: string (sage, forge, check, deploy)
- name: string
- role: string
- status: running | idle | error
- current_task: string
- last_heartbeat: timestamp
- created_at: timestamp
```

---

## UI Pages

### 1. Dashboard (/)
- Stats cards: Total agents, active, tasks today, cost
- Agent grid: Each agent with status + current task
- Activity feed: Recent events
- Quick actions: Trigger agent, view logs

### 2. Agents (/agents)
- List all agents
- Filter by status
- Click to see detail + session logs

### 3. Projects (/projects)
- Asana integration
- Task status per project

### 4. Activity (/activity)
- Full activity feed
- Filter by agent, event type, date

### 5. Metrics (/metrics)
- Token usage over time
- Cost breakdown by agent
- Error rates

---

## Integration Points

### 1. Cron Jobs → Activity Log
Each cron run logs to database:
- Event: spawn, complete, fail, error

### 2. Sessions → Session Logs
Store session transcripts linked to agents

### 3. Asana → Projects
Pull task data for project view

---

## Acceptance Criteria

### Phase 1: Core
- [ ] Database schema for activities + agents
- [ ] API endpoints (agents, activity, metrics)
- [ ] Dashboard shows real agent status
- [ ] Activity feed updates

### Phase 2: Full Features
- [ ] Agent detail with session logs
- [ ] Cost tracking
- [ ] Project integration with Asana
- [ ] Metrics page

### Phase 3: Polish
- [ ] Real-time updates
- [ ] Error alerting
- [ ] Dark/light mode

---

## Priority

P0: Get agents logging → Dashboard showing live status
P1: Session logs + cost tracking  
P2: Metrics + Asana integration

---

## Success Metrics

- Can see all 4 agents (Sage, Forge, Check, Deploy)
- Activity feed shows real events
- Cost tracking shows token usage
- Session logs accessible
