'use client'

import { useState } from "react"

import React from "react"

import type { ReactNode } from 'react'
import {
  LayoutDashboard,
  Thermometer,
  Settings,
  Bell,
  Zap,
  History,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sprout,
  Moon,
  Sun,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/lib/dashboard-context'
import { useSidebarState } from '@/lib/sidebar-context'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface NavItem {
  id: string
  label: string
  icon: ReactNode
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="size-5" /> },
  { id: 'sensors', label: 'Sensor Trends', icon: <Thermometer className="size-5" /> },
  { id: 'controls', label: 'Device Controls', icon: <Settings className="size-5" /> },
  { id: 'alerts', label: 'Alerts', icon: <Bell className="size-5" /> },
  { id: 'automation', label: 'Automation', icon: <Zap className="size-5" /> },
  { id: 'history', label: 'History', icon: <History className="size-5" /> },
  { id: 'reports', label: 'Reports', icon: <FileText className="size-5" /> },
]

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

function SidebarContent({
  activeSection,
  onSectionChange,
  collapsed,
  onCollapse,
}: SidebarProps & { collapsed: boolean; onCollapse?: () => void }) {
  const { isDarkMode, toggleDarkMode, alerts } = useDashboard()
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary">
          <Sprout className="size-6 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sm">AgriSmart</span>
            <span className="text-xs text-sidebar-foreground/60">IoT Dashboard</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              onSectionChange(item.id)
              onCollapse?.()
            }}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              activeSection === item.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            )}
          >
            <span className="relative">
              {item.icon}
              {item.id === 'alerts' && unacknowledgedAlerts > 0 && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unacknowledgedAlerts}
                </span>
              )}
            </span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={toggleDarkMode}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
          {!collapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>
    </div>
  )
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { collapsed, setCollapsed } = useSidebarState()

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50 lg:hidden">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            collapsed={false}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 hidden h-screen transition-all duration-300 lg:block',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          collapsed={collapsed}
        />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex size-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm transition-colors hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </aside>
    </>
  )
}
