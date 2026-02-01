'use client'

import { Header } from '@/components/dashboard/header'
import { AlertsPanel } from '@/components/dashboard/alerts-panel'
import { Card, CardContent } from '@/components/ui/card'
import { useDashboard } from '@/lib/dashboard-context'
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react'

export function AlertsSection() {
  const { alerts } = useDashboard()

  const criticalCount = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length
  const warningCount = alerts.filter(a => a.type === 'warning' && !a.acknowledged).length
  const infoCount = alerts.filter(a => a.type === 'info' && !a.acknowledged).length
  const acknowledgedCount = alerts.filter(a => a.acknowledged).length

  return (
    <div className="space-y-6">
      <Header title="Alerts & Notifications" subtitle="Monitor system alerts and notifications" />

      {/* Alert Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-destructive text-destructive-foreground">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{criticalCount}</p>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-warning text-warning-foreground">
              <AlertCircle className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{warningCount}</p>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Info className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{infoCount}</p>
              <p className="text-sm text-muted-foreground">Informational</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <CheckCircle className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{acknowledgedCount}</p>
              <p className="text-sm text-muted-foreground">Acknowledged</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Panel */}
      <AlertsPanel />
    </div>
  )
}
