import { Dashboard } from '@/components/dashboard/dashboard'
import { DashboardProvider } from '@/lib/dashboard-context'

export default function Home() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}
