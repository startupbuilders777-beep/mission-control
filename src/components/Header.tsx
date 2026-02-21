'use client'

import Link from 'next/link'
import { BarChart3, Folder, Bell } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mission Control</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Agent Swarm Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/projects" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
              <Folder className="w-4 h-4" />
              <span className="text-sm font-medium">Projects</span>
            </Link>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
              <Bell className="w-5 h-5" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
