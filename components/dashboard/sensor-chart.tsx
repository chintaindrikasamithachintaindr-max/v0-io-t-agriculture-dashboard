'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { useDashboard } from '@/lib/dashboard-context'

const chartConfig: ChartConfig = {
  soilMoisture: {
    label: 'Soil Moisture',
    color: 'var(--chart-1)',
  },
  temperature: {
    label: 'Temperature',
    color: 'var(--chart-3)',
  },
  humidity: {
    label: 'Humidity',
    color: 'var(--chart-2)',
  },
  waterLevel: {
    label: 'Water Level',
    color: 'var(--chart-5)',
  },
}

interface SensorChartProps {
  title: string
  dataKey: 'soilMoisture' | 'temperature' | 'humidity' | 'waterLevel'
  unit: string
  color: string
}

export function SensorChart({ title, dataKey, unit, color }: SensorChartProps) {
  const { sensorData } = useDashboard()

  const formattedData = useMemo(() => {
    return sensorData.map(item => ({
      ...item,
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }))
  }, [sensorData])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base font-medium">
          <span>{title}</span>
          <span className="text-2xl font-bold" style={{ color }}>
            {formattedData[formattedData.length - 1]?.[dataKey] ?? 0}
            <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function MultiSensorChart() {
  const { sensorData } = useDashboard()

  const formattedData = useMemo(() => {
    return sensorData.map(item => ({
      ...item,
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }))
  }, [sensorData])

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-base font-medium">All Sensors Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="soilMoisture"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="waterLevel"
              stroke="var(--chart-5)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          {Object.entries(chartConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-sm text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
