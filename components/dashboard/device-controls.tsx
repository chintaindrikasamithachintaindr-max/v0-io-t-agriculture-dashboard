'use client'

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useDashboard } from '@/lib/dashboard-context'
import { cn } from '@/lib/utils'
import { Droplets, Cog, CircleDot, Sprout } from 'lucide-react'
import type { Device } from '@/lib/types'

const deviceIcons: Record<Device['type'], React.ReactNode> = {
  pump: <Droplets className="size-5" />,
  motor: <Cog className="size-5" />,
  valve: <CircleDot className="size-5" />,
  sprinkler: <Sprout className="size-5" />,
}

export function DeviceControls() {
  const { selectedFieldId, getDevicesByField, toggleDevice, selectedField } = useDashboard()
  const devices = getDevicesByField(selectedFieldId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Device Controls - {selectedField?.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.map(device => (
            <DeviceCard key={device.id} device={device} onToggle={() => toggleDevice(device.id)} />
          ))}
          {devices.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">No devices found for this field</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface DeviceCardProps {
  device: Device
  onToggle: () => void
}

function DeviceCard({ device, onToggle }: DeviceCardProps) {
  const lastUpdated = new Date(device.lastUpdated).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border p-4 transition-colors',
        device.status
          ? 'border-primary/30 bg-primary/5'
          : 'border-border bg-card'
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-lg',
            device.status
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {deviceIcons[device.type]}
        </div>
        <div>
          <h4 className="font-medium text-foreground">{device.name}</h4>
          <p className="text-xs text-muted-foreground">
            {device.status ? 'Running' : 'Stopped'} • Last updated: {lastUpdated}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'text-sm font-medium',
            device.status ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {device.status ? 'ON' : 'OFF'}
        </span>
        <Switch checked={device.status} onCheckedChange={onToggle} />
      </div>
    </div>
  )
}

export function DeviceControlsCompact() {
  const { selectedFieldId, getDevicesByField, toggleDevice } = useDashboard()
  const devices = getDevicesByField(selectedFieldId)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Quick Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {devices.map(device => (
            <button
              key={device.id}
              onClick={() => toggleDevice(device.id)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:shadow-md',
                device.status
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/50'
              )}
            >
              <div
                className={cn(
                  'flex size-12 items-center justify-center rounded-full',
                  device.status ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                {deviceIcons[device.type]}
              </div>
              <span className="text-xs font-medium">{device.name}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-semibold',
                  device.status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {device.status ? 'ON' : 'OFF'}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
