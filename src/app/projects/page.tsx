import { Folder, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

const projects = [
  {
    id: 1,
    name: 'RedditAutoMarket',
    description: 'AI-powered Reddit marketing automation tool',
    folder: 'projects/reddit-marketing-tool',
    status: 'active',
    progress: 80,
    tickets: {
      todo: { count: 3, label: 'To Do', color: 'bg-gray-500' },
      inProgress: { count: 1, label: 'In Progress', color: 'bg-blue-500' },
      done: { count: 0, label: 'Done', color: 'bg-green-500' }
    }
  },
  {
    id: 2,
    name: 'B2B Ebook',
    description: 'Automate Your Business with OpenClaw - ebook',
    folder: 'projects/b2b-ebook',
    status: 'completed',
    progress: 100,
    tickets: {
      todo: { count: 0, label: 'To Do', color: 'bg-gray-500' },
      inProgress: { count: 0, label: 'In Progress', color: 'bg-blue-500' },
      done: { count: 1, label: 'Done', color: 'bg-green-500' }
    }
  },
  {
    id: 3,
    name: 'Whop Course',
    description: 'AI Automation Empire course for Whop.com',
    folder: 'projects/whop-course-ai-automation',
    status: 'active',
    progress: 25,
    tickets: {
      todo: { count: 2, label: 'To Do', color: 'bg-gray-500' },
      inProgress: { count: 1, label: 'In Progress', color: 'bg-blue-500' },
      done: { count: 1, label: 'Done', color: 'bg-green-500' }
    }
  },
  {
    id: 4,
    name: 'Mission Control',
    description: 'Dashboard to monitor all agents and projects',
    folder: 'projects/mission-control',
    status: 'active',
    progress: 60,
    tickets: {
      todo: { count: 2, label: 'To Do', color: 'bg-gray-500' },
      inProgress: { count: 1, label: 'In Progress', color: 'bg-blue-500' },
      done: { count: 2, label: 'Done', color: 'bg-green-500' }
    }
  }
]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Folder className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Projects</h1>
                <p className="text-xs text-gray-400">All active projects</p>
              </div>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Projects</p>
            <p className="text-3xl font-bold mt-1">4</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Active</p>
            <p className="text-3xl font-bold mt-1 text-green-500">3</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-3xl font-bold mt-1 text-purple-500">1</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Tickets</p>
            <p className="text-3xl font-bold mt-1">12</p>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500" />
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Ticket Counts */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${project.tickets.todo.color}`}></div>
                  <span className="text-sm text-gray-400">{project.tickets.todo.count} {project.tickets.todo.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${project.tickets.inProgress.color}`}></div>
                  <span className="text-sm text-gray-400">{project.tickets.inProgress.count} {project.tickets.inProgress.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${project.tickets.done.color}`}></div>
                  <span className="text-sm text-gray-400">{project.tickets.done.count} {project.tickets.done.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
