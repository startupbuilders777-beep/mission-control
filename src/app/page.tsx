import Link from 'next/link'
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Bot,
  Folder,
  Plus
} from 'lucide-react'

// This would be fetched from /api/board in real app
const projects = [
  {
    id: 1,
    name: 'RedditAutoMarket',
    folder: 'projects/reddit-marketing-tool',
    status: 'active',
    tickets: { total: 4, done: 0, inProgress: 1, todo: 3 }
  },
  {
    id: 2,
    name: 'B2B Ebook',
    folder: 'projects/b2b-ebook',
    status: 'completed',
    tickets: { total: 1, done: 1, inProgress: 0, todo: 0 }
  },
  {
    id: 3,
    name: 'Whop Course',
    folder: 'projects/whop-course-ai-automation',
    status: 'active',
    tickets: { total: 4, done: 1, inProgress: 1, todo: 2 }
  },
  {
    id: 4,
    name: 'CartRecall',
    folder: 'AI Customer Re-engagement',
    status: 'active',
    tickets: { total: 1, done: 0, inProgress: 1, todo: 0 },
    link: '/cartrecall'
  }
]

const agents = [
  { id: 'sage', name: 'Sage', role: 'Coordinator', status: 'active', emoji: '🧠', currentTask: 'Monitoring' },
  { id: 'agent-reddit-market', name: 'RedditMarket Agent', role: 'Builder', status: 'running', emoji: '🔨', currentTask: 'TICKET-025: Deploy to EC2' },
  { id: 'agent-whop-course', name: 'WhopCourse Agent', role: 'Content', status: 'running', emoji: '📝', currentTask: 'COURSE-002: Module 2 scripts' },
]

const recentActivity = [
  { id: 1, action: 'Ticket completed', user: 'agent-whop-course', notes: 'COURSE-001 done', time: '5 min ago' },
  { id: 2, action: 'Agent spawned', user: 'sage', notes: 'Started RedditMarket agent', time: '10 min ago' },
  { id: 3, action: 'Agent spawned', user: 'sage', notes: 'Started WhopCourse agent', time: '10 min ago' },
  { id: 4, action: 'Ticket completed', user: 'sage', notes: 'B2B Ebook v3 done', time: '1 hour ago' },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Mission Control</h1>
                <p className="text-xs text-gray-400">Agent Swarm Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/projects" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <Folder className="w-4 h-4" />
                Projects
              </Link>
              <Link href="/agents" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <Bot className="w-4 h-4" />
                Agents
              </Link>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Projects" 
            value="4" 
            icon={<Folder className="w-6 h-6 text-blue-500" />}
          />
          <StatCard 
            title="Active Agents" 
            value="3" 
            icon={<Bot className="w-6 h-6 text-green-500" />}
            subtext="2 running"
          />
          <StatCard 
            title="Open Tickets" 
            value="8" 
            icon={<Clock className="w-6 h-6 text-yellow-500" />}
          />
          <StatCard 
            title="Completed" 
            value="2" 
            icon={<CheckCircle2 className="w-6 h-6 text-purple-500" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Projects</h2>
              <Link href="/projects" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid gap-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={project.link || '#'}
                  className={project.link ? "block" : "pointer-events-none"}
                >
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-sm text-gray-400">{project.folder}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        project.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-gray-400">{project.tickets.done} done</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-gray-400">{project.tickets.inProgress} in progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                        <span className="text-gray-400">{project.tickets.todo} todo</span>
                      </div>
                    </div>

                    <div className="mt-4 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${(project.tickets.done / project.tickets.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agents */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Agents</h2>
                <Link href="/agents" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {agents.map((agent) => (
                  <div key={agent.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{agent.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{agent.name}</span>
                          <span className={`w-2 h-2 rounded-full ${
                            agent.status === 'active' ? 'bg-green-500' : 
                            agent.status === 'running' ? 'bg-blue-500 animate-pulse' :
                            'bg-gray-500'
                          }`}></span>
                        </div>
                        <p className="text-xs text-gray-400">{agent.currentTask}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-gray-300">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.notes} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, icon, subtext }: { title: string; value: string | number; icon: React.ReactNode; subtext?: string }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className="text-gray-500">{icon}</div>
      </div>
    </div>
  )
}
