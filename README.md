# Mission Control Dashboard - Next.js App

This is the main dashboard for monitoring all agents, projects, and tasks.

## File Structure

```
mission-control/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Main dashboard
│   │   ├── projects/
│   │   │   └── page.tsx     # Project list
│   │   ├── agents/
│   │   │   └── page.tsx     # Agent status
│   │   └── api/
│   │       └── board/
│   │           └── route.ts # Board API
│   ├── components/
│   │   ├── DashboardStats.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── TaskBoard.tsx
│   │   ├── AgentStatus.tsx
│   │   └── ActivityFeed.tsx
│   └── lib/
│       ├── board.ts          # Board operations
│       └── agents.ts        # Agent management
├── tasks/
│   └── board.json           # Task data (shared)
└── package.json
```

## Features

1. **Project Overview** - See all projects at a glance
2. **Task Board** - Jira-style kanban view
3. **Agent Status** - Live status of all agents
4. **Activity Feed** - Real-time activity log
5. **Quick Actions** - Create, move, complete tasks

## Data Source

All data comes from `tasks/board.json` - simple JSON file that all agents read/write.

## Running

```bash
cd mission-control
npm install
npm run dev
```

## API Endpoints

- `GET /api/board` - Get all projects/tasks
- `POST /api/board/ticket` - Create/update ticket
- `GET /api/agents` - Get agent status
- `POST /api/agents/spawn` - Spawn new agent
