'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { OverviewSection } from './sections/overview-section'
import { SensorsSection } from './sections/sensors-section'
import { ControlsSection } from './sections/controls-section'
import { AlertsSection } from './sections/alerts-section'
import { AutomationSection } from './sections/automation-section'
import { HistorySection } from './sections/history-section'
import { ReportsSection } from './sections/reports-section'
import { cn } from '@/lib/utils'
import { SidebarProvider, useSidebarState } from '@/lib/sidebar-context'

function DashboardContent() {
  const [activeSection, setActiveSection] = useState('overview')
  const { collapsed } = useSidebarState()

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />
      case 'sensors':
        return <SensorsSection />
      case 'controls':
        return <ControlsSection />
      case 'alerts':
        return <AlertsSection />
      case 'automation':
        return <AutomationSection />
      case 'history':
        return <HistorySection />
      case 'reports':
        return <ReportsSection />
      default:
        return <OverviewSection />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main
        className={cn(
          'min-h-screen transition-all duration-300 p-4 pt-16 lg:pt-6 lg:p-6',
          collapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        <div className="mx-auto max-w-7xl">
          {renderSection()}
        </div>
      </main>
    </div>
  )
}

export function Dashboard() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  )
}
