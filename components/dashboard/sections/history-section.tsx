'use client'

import { Header } from '@/components/dashboard/header'
import { HistoryTable } from '@/components/dashboard/history-table'

export function HistorySection() {
  return (
    <div className="space-y-6">
      <Header title="Historical Data" subtitle="View and export historical sensor readings" />
      <HistoryTable />
    </div>
  )
}
