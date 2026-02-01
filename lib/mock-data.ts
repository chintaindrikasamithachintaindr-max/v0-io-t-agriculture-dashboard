import type { Field, Alert, AutomationRule, SensorData, HistoricalRecord } from './types'

export const fields: Field[] = [
  {
    id: 'field-1',
    name: 'North Field',
    location: 'Section A',
    cropType: 'Wheat',
    area: 50,
    devices: [
      { id: 'pump-1', name: 'Main Pump', type: 'pump', status: true, lastUpdated: '2026-01-31T10:30:00', fieldId: 'field-1' },
      { id: 'motor-1', name: 'Irrigation Motor', type: 'motor', status: false, lastUpdated: '2026-01-31T09:15:00', fieldId: 'field-1' },
      { id: 'valve-1', name: 'Water Valve', type: 'valve', status: true, lastUpdated: '2026-01-31T10:00:00', fieldId: 'field-1' },
    ],
  },
  {
    id: 'field-2',
    name: 'South Field',
    location: 'Section B',
    cropType: 'Corn',
    area: 75,
    devices: [
      { id: 'pump-2', name: 'Secondary Pump', type: 'pump', status: false, lastUpdated: '2026-01-31T08:45:00', fieldId: 'field-2' },
      { id: 'sprinkler-1', name: 'Sprinkler System', type: 'sprinkler', status: true, lastUpdated: '2026-01-31T10:20:00', fieldId: 'field-2' },
    ],
  },
  {
    id: 'field-3',
    name: 'East Field',
    location: 'Section C',
    cropType: 'Soybeans',
    area: 40,
    devices: [
      { id: 'pump-3', name: 'Drip Pump', type: 'pump', status: true, lastUpdated: '2026-01-31T10:10:00', fieldId: 'field-3' },
      { id: 'motor-2', name: 'Distribution Motor', type: 'motor', status: true, lastUpdated: '2026-01-31T09:50:00', fieldId: 'field-3' },
    ],
  },
]

export const initialAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'critical',
    message: 'Soil moisture critically low',
    sensorType: 'Soil Moisture',
    value: 15,
    threshold: 25,
    timestamp: '2026-01-31T10:25:00',
    fieldId: 'field-1',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    type: 'warning',
    message: 'Temperature above optimal range',
    sensorType: 'Temperature',
    value: 38,
    threshold: 35,
    timestamp: '2026-01-31T10:15:00',
    fieldId: 'field-2',
    acknowledged: false,
  },
  {
    id: 'alert-3',
    type: 'info',
    message: 'Water tank level restored',
    sensorType: 'Water Level',
    value: 85,
    threshold: 80,
    timestamp: '2026-01-31T09:45:00',
    fieldId: 'field-3',
    acknowledged: true,
  },
]

export const initialAutomationRules: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'Auto Irrigation',
    enabled: true,
    condition: {
      sensor: 'soilMoisture',
      operator: 'less_than',
      value: 30,
    },
    action: {
      deviceId: 'pump-1',
      deviceName: 'Main Pump',
      state: true,
    },
    fieldId: 'field-1',
    lastTriggered: '2026-01-31T10:25:00',
  },
  {
    id: 'rule-2',
    name: 'Heat Protection',
    enabled: true,
    condition: {
      sensor: 'temperature',
      operator: 'greater_than',
      value: 35,
    },
    action: {
      deviceId: 'sprinkler-1',
      deviceName: 'Sprinkler System',
      state: true,
    },
    fieldId: 'field-2',
    lastTriggered: '2026-01-31T10:15:00',
  },
  {
    id: 'rule-3',
    name: 'Water Conservation',
    enabled: false,
    condition: {
      sensor: 'waterLevel',
      operator: 'less_than',
      value: 20,
    },
    action: {
      deviceId: 'pump-2',
      deviceName: 'Secondary Pump',
      state: false,
    },
    fieldId: 'field-2',
  },
]

export function generateSensorData(hours: number = 24): SensorData[] {
  const data: SensorData[] = []
  const now = new Date()

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      timestamp: timestamp.toISOString(),
      soilMoisture: Math.round(25 + Math.random() * 35 + Math.sin(i / 4) * 10),
      temperature: Math.round(20 + Math.random() * 15 + Math.cos(i / 6) * 5),
      humidity: Math.round(40 + Math.random() * 30 + Math.sin(i / 5) * 10),
      waterLevel: Math.round(60 + Math.random() * 30 - i * 0.5),
    })
  }

  return data
}

export function generateHistoricalData(): HistoricalRecord[] {
  const records: HistoricalRecord[] = []
  const fieldNames = ['North Field', 'South Field', 'East Field']

  for (let day = 6; day >= 0; day--) {
    for (let hour = 0; hour < 24; hour += 4) {
      const timestamp = new Date()
      timestamp.setDate(timestamp.getDate() - day)
      timestamp.setHours(hour, 0, 0, 0)

      const fieldIndex = Math.floor(Math.random() * 3)
      records.push({
        id: `record-${day}-${hour}-${fieldIndex}`,
        timestamp: timestamp.toISOString(),
        fieldName: fieldNames[fieldIndex],
        soilMoisture: Math.round(20 + Math.random() * 50),
        temperature: Math.round(18 + Math.random() * 20),
        humidity: Math.round(35 + Math.random() * 40),
        waterLevel: Math.round(50 + Math.random() * 45),
        pumpStatus: Math.random() > 0.5 ? 'Active' : 'Inactive',
      })
    }
  }

  return records.slice(-20)
}

export function getCurrentSensorValues(fieldId: string): {
  soilMoisture: number
  temperature: number
  humidity: number
  waterLevel: number
} {
  const baseValues: Record<string, { soilMoisture: number; temperature: number; humidity: number; waterLevel: number }> = {
    'field-1': { soilMoisture: 28, temperature: 32, humidity: 55, waterLevel: 72 },
    'field-2': { soilMoisture: 45, temperature: 38, humidity: 48, waterLevel: 65 },
    'field-3': { soilMoisture: 52, temperature: 29, humidity: 62, waterLevel: 88 },
  }

  return baseValues[fieldId] || baseValues['field-1']
}
