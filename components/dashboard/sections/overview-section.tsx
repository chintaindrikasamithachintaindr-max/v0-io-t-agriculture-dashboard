'use client'

import { useDashboard } from '@/lib/dashboard-context'
import { Header } from '@/components/dashboard/header'
import { StatCard } from '@/components/dashboard/stat-card'
import { SensorChart, MultiSensorChart } from '@/components/dashboard/sensor-chart'
import { DeviceControlsCompact } from '@/components/dashboard/device-controls'
import { AlertsCompact } from '@/components/dashboard/alerts-panel'
import { Droplet, Thermometer, Cloud, Waves } from 'lucide-react'

export function OverviewSection() {
  const { currentSensorValues, sensorData } = useDashboard()

  // Calculate trends from sensor data
  const getTrend = (key: keyof typeof currentSensorValues): { trend: 'up' | 'down' | 'stable'; value: string } => {
    if (sensorData.length < 2) return { trend: 'stable', value: '0%' }
    const current = sensorData[sensorData.length - 1]?.[key] ?? 0
    const previous = sensorData[sensorData.length - 2]?.[key] ?? 0
    const diff = current - previous
    const percentage = previous !== 0 ? Math.abs((diff / previous) * 100).toFixed(1) : '0'
    return {
      trend: diff > 0.5 ? 'up' : diff < -0.5 ? 'down' : 'stable',
      value: `${percentage}%`,
    }
  }

  const moistureTrend = getTrend('soilMoisture')
  const temperatureTrend = getTrend('temperature')
  const humidityTrend = getTrend('humidity')
  const waterTrend = getTrend('waterLevel')

  const getMoistureStatus = (value: number) => {
    if (value < 25) return 'critical'
    if (value < 40) return 'warning'
    return 'normal'
  }

  const getTemperatureStatus = (value: number) => {
    if (value > 38 || value < 10) return 'critical'
    if (value > 35 || value < 15) return 'warning'
    return 'normal'
  }

  return (
    <div className="space-y-6">
      <Header title="Dashboard Overview" subtitle="Monitor your agricultural operations in real-time" />

      {/* Active Alerts Banner */}
      <AlertsCompact />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Soil Moisture"
          value={currentSensorValues.soilMoisture}
          unit="%"
          icon={<Droplet className="size-6" />}
          trend={moistureTrend.trend}
          trendValue={moistureTrend.value}
          status={getMoistureStatus(currentSensorValues.soilMoisture)}
          optimalRange="40-70%"
        />
        <StatCard
          title="Temperature"
          value={currentSensorValues.temperature}
          unit="°C"
          icon={<Thermometer className="size-6" />}
          trend={temperatureTrend.trend}
          trendValue={temperatureTrend.value}
          status={getTemperatureStatus(currentSensorValues.temperature)}
          optimalRange="20-35°C"
        />
        <StatCard
          title="Humidity"
          value={currentSensorValues.humidity}
          unit="%"
          icon={<Cloud className="size-6" />}
          trend={humidityTrend.trend}
          trendValue={humidityTrend.value}
          status="normal"
          optimalRange="50-80%"
        />
        <StatCard
          title="Water Level"
          value={currentSensorValues.waterLevel}
          unit="%"
          icon={<Waves className="size-6" />}
          trend={waterTrend.trend}
          trendValue={waterTrend.value}
          status={currentSensorValues.waterLevel < 30 ? 'warning' : 'normal'}
          optimalRange="> 30%"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SensorChart
          title="Soil Moisture Trend"
          dataKey="soilMoisture"
          unit="%"
          color="var(--chart-1)"
        />
        <SensorChart
          title="Temperature Trend"
          dataKey="temperature"
          unit="°C"
          color="var(--chart-3)"
        />
      </div>

      {/* Quick Controls */}
      <DeviceControlsCompact />

      {/* Full Sensor Overview */}
      <MultiSensorChart />
    </div>
  )
}
