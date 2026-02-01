'use client'

import { Header } from '@/components/dashboard/header'
import { ReportsPanel } from '@/components/dashboard/reports-panel'

export function ReportsSection() {
  return (
    <div className="space-y-6">
      <Header title="Reports" subtitle="Generate and export customized reports" />
      <ReportsPanel />
    </div>
  )
}
