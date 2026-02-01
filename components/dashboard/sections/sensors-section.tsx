'use client'

import { Header } from '@/components/dashboard/header'
import { SensorChart, MultiSensorChart } from '@/components/dashboard/sensor-chart'

export function SensorsSection() {
  return (
    <div className="space-y-6">
      <Header title="Sensor Trends" subtitle="Real-time sensor data visualization" />

      <div className="grid gap-4 lg:grid-cols-2">
        <SensorChart
          title="Soil Moisture"
          dataKey="soilMoisture"
          unit="%"
          color="var(--chart-1)"
        />
        <SensorChart
          title="Temperature"
          dataKey="temperature"
          unit="°C"
          color="var(--chart-3)"
        />
        <SensorChart
          title="Humidity"
          dataKey="humidity"
          unit="%"
          color="var(--chart-2)"
        />
        <SensorChart
          title="Water Level"
          dataKey="waterLevel"
          unit="%"
          color="var(--chart-5)"
        />
      </div>

      <MultiSensorChart />
    </div>
  )
}
