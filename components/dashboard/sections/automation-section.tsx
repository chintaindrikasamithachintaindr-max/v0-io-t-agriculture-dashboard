'use client'

import { Header } from '@/components/dashboard/header'
import { AutomationRules } from '@/components/dashboard/automation-rules'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useDashboard } from '@/lib/dashboard-context'
import { Zap, CheckCircle, Clock, TrendingUp } from 'lucide-react'

export function AutomationSection() {
  const { automationRules, selectedFieldId } = useDashboard()

  const fieldRules = automationRules.filter(r => r.fieldId === selectedFieldId)
  const activeRules = fieldRules.filter(r => r.enabled).length
  const triggeredToday = fieldRules.filter(r => {
    if (!r.lastTriggered) return false
    const triggered = new Date(r.lastTriggered)
    const today = new Date()
    return triggered.toDateString() === today.toDateString()
  }).length

  return (
    <div className="space-y-6">
      <Header title="Automation Rules" subtitle="Configure intelligent automation for your farm" />

      {/* Automation Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{fieldRules.length}</p>
              <p className="text-sm text-muted-foreground">Total Rules</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CheckCircle className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeRules}</p>
              <p className="text-sm text-muted-foreground">Active Rules</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
              <Clock className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{triggeredToday}</p>
              <p className="text-sm text-muted-foreground">Triggered Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-chart-5/10 text-chart-5">
              <TrendingUp className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">24%</p>
              <p className="text-sm text-muted-foreground">Water Saved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How Automation Works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">How Automation Works</CardTitle>
          <CardDescription>
            Set up rules to automatically control devices based on sensor readings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                1
              </div>
              <div>
                <h4 className="font-medium text-foreground">Define Condition</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Set a sensor threshold that triggers the rule
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                2
              </div>
              <div>
                <h4 className="font-medium text-foreground">Choose Action</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select a device and the action to perform
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                3
              </div>
              <div>
                <h4 className="font-medium text-foreground">Activate Rule</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enable the rule and let automation handle the rest
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation Rules */}
      <AutomationRules />
    </div>
  )
}
