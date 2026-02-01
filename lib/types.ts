export interface SensorData {
  timestamp: string
  soilMoisture: number
  temperature: number
  humidity: number
  waterLevel: number
}

export interface Device {
  id: string
  name: string
  type: 'pump' | 'motor' | 'valve' | 'sprinkler'
  status: boolean
  lastUpdated: string
  fieldId: string
}

export interface Field {
  id: string
  name: string
  location: string
  cropType: string
  area: number
  devices: Device[]
}

export interface Alert {
  id: string
  type: 'warning' | 'critical' | 'info'
  message: string
  sensorType: string
  value: number
  threshold: number
  timestamp: string
  fieldId: string
  acknowledged: boolean
}

export interface AutomationRule {
  id: string
  name: string
  enabled: boolean
  condition: {
    sensor: 'soilMoisture' | 'temperature' | 'humidity' | 'waterLevel'
    operator: 'less_than' | 'greater_than' | 'equals'
    value: number
  }
  action: {
    deviceId: string
    deviceName: string
    state: boolean
  }
  fieldId: string
  lastTriggered?: string
}

export interface HistoricalRecord {
  id: string
  timestamp: string
  fieldName: string
  soilMoisture: number
  temperature: number
  humidity: number
  waterLevel: number
  pumpStatus: string
}
