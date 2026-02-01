'use client'

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDashboard } from '@/lib/dashboard-context'
import { cn } from '@/lib/utils'
import { AlertTriangle, AlertCircle, Info, Check, Bell, X } from 'lucide-react'
import type { Alert } from '@/lib/types'

const alertIcons: Record<Alert['type'], React.ReactNode> = {
  critical: <AlertTriangle className="size-5" />,
  warning: <AlertCircle className="size-5" />,
  info: <Info className="size-5" />,
}

const alertStyles: Record<Alert['type'], string> = {
  critical: 'border-destructive/30 bg-destructive/5',
  warning: 'border-warning/30 bg-warning/5',
  info: 'border-primary/30 bg-primary/5',
}

const iconStyles: Record<Alert['type'], string> = {
  critical: 'bg-destructive text-destructive-foreground',
  warning: 'bg-warning text-warning-foreground',
  info: 'bg-primary text-primary-foreground',
}

export function AlertsPanel() {
  const { alerts, acknowledgeAlert, fields } = useDashboard()

  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.acknowledged !== b.acknowledged) return a.acknowledged ? 1 : -1
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  const getFieldName = (fieldId: string) => {
    return fields.find(f => f.id === fieldId)?.name || 'Unknown Field'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Bell className="size-5" />
          Alerts & Notifications
        </CardTitle>
        <Badge variant="secondary">
          {alerts.filter(a => !a.acknowledged).length} Active
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              fieldName={getFieldName(alert.fieldId)}
              onAcknowledge={() => acknowledgeAlert(alert.id)}
            />
          ))}
          {alerts.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
              <Check className="size-8" />
              <p>All systems operating normally</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface AlertCardProps {
  alert: Alert
  fieldName: string
  onAcknowledge: () => void
}

function AlertCard({ alert, fieldName, onAcknowledge }: AlertCardProps) {
  const timestamp = new Date(alert.timestamp).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4 transition-opacity',
        alertStyles[alert.type],
        alert.acknowledged && 'opacity-50'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('flex size-10 items-center justify-center rounded-lg', iconStyles[alert.type])}>
          {alertIcons[alert.type]}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium text-foreground">{alert.message}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {alert.sensorType}: <span className="font-medium text-foreground">{alert.value}</span>
                {' '}(threshold: {alert.threshold})
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {alert.type}
            </Badge>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {fieldName} • {timestamp}
            </p>
            {!alert.acknowledged && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onAcknowledge}
                className="h-7 text-xs"
              >
                <Check className="mr-1 size-3" />
                Acknowledge
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AlertsCompact() {
  const { alerts, acknowledgeAlert, fields } = useDashboard()
  const activeAlerts = alerts.filter(a => !a.acknowledged).slice(0, 3)

  const getFieldName = (fieldId: string) => {
    return fields.find(f => f.id === fieldId)?.name || 'Unknown'
  }

  if (activeAlerts.length === 0) {
    return null
  }

  return (
    <Card className="border-warning/30 bg-warning/5">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-warning">
            <AlertCircle className="size-4" />
            <span className="text-sm font-medium">Active Alerts</span>
          </div>
          <Badge variant="outline" className="border-warning text-warning">
            {activeAlerts.length} Active
          </Badge>
        </div>
        <div className="space-y-2">
          {activeAlerts.map(alert => (
            <div
              key={alert.id}
              className="flex items-center justify-between rounded-md bg-background/50 p-2"
            >
              <div className="flex items-center gap-2">
                <span className={cn('size-2 rounded-full', alert.type === 'critical' ? 'bg-destructive' : 'bg-warning')} />
                <span className="text-sm text-foreground">{alert.message}</span>
                <span className="text-xs text-muted-foreground">({getFieldName(alert.fieldId)})</span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="size-6"
                onClick={() => acknowledgeAlert(alert.id)}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
