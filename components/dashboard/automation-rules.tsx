'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboard } from '@/lib/dashboard-context'
import { cn } from '@/lib/utils'
import { Zap, Plus, Trash2, Clock, ArrowRight } from 'lucide-react'
import type { AutomationRule } from '@/lib/types'

const sensorLabels: Record<AutomationRule['condition']['sensor'], string> = {
  soilMoisture: 'Soil Moisture',
  temperature: 'Temperature',
  humidity: 'Humidity',
  waterLevel: 'Water Level',
}

const operatorLabels: Record<AutomationRule['condition']['operator'], string> = {
  less_than: 'is less than',
  greater_than: 'is greater than',
  equals: 'equals',
}

export function AutomationRules() {
  const { automationRules, toggleRule, deleteRule, selectedFieldId, fields, addRule, getDevicesByField } = useDashboard()
  const [isOpen, setIsOpen] = useState(false)

  const fieldRules = automationRules.filter(rule => rule.fieldId === selectedFieldId)
  const devices = getDevicesByField(selectedFieldId)

  const handleAddRule = (rule: Omit<AutomationRule, 'id'>) => {
    addRule(rule)
    setIsOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Zap className="size-5" />
          Automation Rules
        </CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 size-4" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddRuleDialog
              fieldId={selectedFieldId}
              devices={devices}
              onAdd={handleAddRule}
              onClose={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fieldRules.map(rule => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onToggle={() => toggleRule(rule.id)}
              onDelete={() => deleteRule(rule.id)}
            />
          ))}
          {fieldRules.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
              <Zap className="size-8" />
              <p>No automation rules for this field</p>
              <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                Create your first rule
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface RuleCardProps {
  rule: AutomationRule
  onToggle: () => void
  onDelete: () => void
}

function RuleCard({ rule, onToggle, onDelete }: RuleCardProps) {
  const lastTriggered = rule.lastTriggered
    ? new Date(rule.lastTriggered).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Never'

  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-colors',
        rule.enabled ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground">{rule.name}</h4>
            <Badge variant={rule.enabled ? 'default' : 'secondary'} className="text-xs">
              {rule.enabled ? 'Active' : 'Disabled'}
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="rounded-md bg-secondary px-2 py-1 text-secondary-foreground">
              When {sensorLabels[rule.condition.sensor]}
            </span>
            <span>{operatorLabels[rule.condition.operator]}</span>
            <span className="font-mono font-medium text-foreground">{rule.condition.value}</span>
            <ArrowRight className="size-4" />
            <span className="rounded-md bg-secondary px-2 py-1 text-secondary-foreground">
              Turn {rule.action.deviceName} {rule.action.state ? 'ON' : 'OFF'}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-3" />
            <span>Last triggered: {lastTriggered}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={rule.enabled} onCheckedChange={onToggle} />
          <Button
            size="icon"
            variant="ghost"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface AddRuleDialogProps {
  fieldId: string
  devices: { id: string; name: string }[]
  onAdd: (rule: Omit<AutomationRule, 'id'>) => void
  onClose: () => void
}

function AddRuleDialog({ fieldId, devices, onAdd, onClose }: AddRuleDialogProps) {
  const [name, setName] = useState('')
  const [sensor, setSensor] = useState<AutomationRule['condition']['sensor']>('soilMoisture')
  const [operator, setOperator] = useState<AutomationRule['condition']['operator']>('less_than')
  const [value, setValue] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [state, setState] = useState(true)

  const handleSubmit = () => {
    if (!name || !value || !deviceId) return

    const selectedDevice = devices.find(d => d.id === deviceId)
    if (!selectedDevice) return

    onAdd({
      name,
      enabled: true,
      condition: { sensor, operator, value: Number(value) },
      action: { deviceId, deviceName: selectedDevice.name, state },
      fieldId,
    })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create Automation Rule</DialogTitle>
        <DialogDescription>
          Set up automatic device control based on sensor values
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Rule Name</Label>
          <Input
            id="name"
            placeholder="e.g., Auto Irrigation"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="grid gap-2">
            <Label>When Sensor</Label>
            <Select value={sensor} onValueChange={v => setSensor(v as typeof sensor)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soilMoisture">Soil Moisture</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="humidity">Humidity</SelectItem>
                <SelectItem value="waterLevel">Water Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Condition</Label>
            <Select value={operator} onValueChange={v => setOperator(v as typeof operator)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less_than">Less than</SelectItem>
                <SelectItem value="greater_than">Greater than</SelectItem>
                <SelectItem value="equals">Equals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              placeholder="30"
              value={value}
              onChange={e => setValue(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-2">
            <Label>Then Device</Label>
            <Select value={deviceId} onValueChange={setDeviceId}>
              <SelectTrigger>
                <SelectValue placeholder="Select device" />
              </SelectTrigger>
              <SelectContent>
                {devices.map(device => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Action</Label>
            <Select value={state ? 'on' : 'off'} onValueChange={v => setState(v === 'on')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on">Turn ON</SelectItem>
                <SelectItem value="off">Turn OFF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!name || !value || !deviceId}>
          Create Rule
        </Button>
      </DialogFooter>
    </>
  )
}
