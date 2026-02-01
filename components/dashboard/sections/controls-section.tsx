'use client'

import { Header } from '@/components/dashboard/header'
import { DeviceControls } from '@/components/dashboard/device-controls'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboard } from '@/lib/dashboard-context'
import { Settings, Power, Clock, Activity } from 'lucide-react'

export function ControlsSection() {
  const { fields, selectedFieldId, selectedField } = useDashboard()
  const devices = fields.find(f => f.id === selectedFieldId)?.devices || []

  const activeDevices = devices.filter(d => d.status).length
  const totalDevices = devices.length

  return (
    <div className="space-y-6">
      <Header title="Device Controls" subtitle="Manage and control all connected devices" />

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Settings className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalDevices}</p>
              <p className="text-sm text-muted-foreground">Total Devices</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Power className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeDevices}</p>
              <p className="text-sm text-muted-foreground">Active Devices</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
              <Clock className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">24/7</p>
              <p className="text-sm text-muted-foreground">Monitoring</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-chart-5/10 text-chart-5">
              <Activity className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{selectedField?.area || 0}</p>
              <p className="text-sm text-muted-foreground">Acres Covered</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Controls */}
      <DeviceControls />
    </div>
  )
}
