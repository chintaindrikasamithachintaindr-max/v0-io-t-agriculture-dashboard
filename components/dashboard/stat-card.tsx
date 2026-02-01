'use client'

import React from "react"

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  unit: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  status?: 'normal' | 'warning' | 'critical'
  optimalRange?: string
}

export function StatCard({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  status = 'normal',
  optimalRange,
}: StatCardProps) {
  const statusColors = {
    normal: 'bg-primary/10 text-primary',
    warning: 'bg-warning/10 text-warning',
    critical: 'bg-destructive/10 text-destructive',
  }

  const trendIcons = {
    up: <TrendingUp className="size-4" />,
    down: <TrendingDown className="size-4" />,
    stable: <Minus className="size-4" />,
  }

  const trendColors = {
    up: 'text-primary',
    down: 'text-destructive',
    stable: 'text-muted-foreground',
  }

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
            {optimalRange && (
              <p className="text-xs text-muted-foreground">Optimal: {optimalRange}</p>
            )}
          </div>
          <div className={cn('rounded-lg p-3', statusColors[status])}>
            {icon}
          </div>
        </div>

        {trend && trendValue && (
          <div className={cn('mt-4 flex items-center gap-1 text-sm', trendColors[trend])}>
            {trendIcons[trend]}
            <span>{trendValue}</span>
            <span className="text-muted-foreground">from last hour</span>
          </div>
        )}

        {/* Status indicator line */}
        <div
          className={cn(
            'absolute bottom-0 left-0 h-1 w-full',
            status === 'normal' && 'bg-primary',
            status === 'warning' && 'bg-warning',
            status === 'critical' && 'bg-destructive'
          )}
        />
      </CardContent>
    </Card>
  )
}
