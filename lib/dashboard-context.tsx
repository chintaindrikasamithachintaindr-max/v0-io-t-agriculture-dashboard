'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Field, Alert, AutomationRule, SensorData, Device } from './types'
import { fields as initialFields, initialAlerts, initialAutomationRules, generateSensorData, getCurrentSensorValues } from './mock-data'

interface DashboardContextType {
  // Fields
  fields: Field[]
  selectedFieldId: string
  setSelectedFieldId: (id: string) => void
  selectedField: Field | undefined

  // Sensor Data
  sensorData: SensorData[]
  currentSensorValues: {
    soilMoisture: number
    temperature: number
    humidity: number
    waterLevel: number
  }

  // Devices
  toggleDevice: (deviceId: string) => void
  getDevicesByField: (fieldId: string) => Device[]

  // Alerts
  alerts: Alert[]
  acknowledgeAlert: (alertId: string) => void
  addAlert: (alert: Omit<Alert, 'id'>) => void

  // Automation Rules
  automationRules: AutomationRule[]
  toggleRule: (ruleId: string) => void
  addRule: (rule: Omit<AutomationRule, 'id'>) => void
  deleteRule: (ruleId: string) => void

  // Theme
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [fields, setFields] = useState<Field[]>(initialFields)
  const [selectedFieldId, setSelectedFieldId] = useState<string>('field-1')
  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(initialAutomationRules)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  const selectedField = fields.find(f => f.id === selectedFieldId)
  const currentSensorValues = getCurrentSensorValues(selectedFieldId)

  // Initialize sensor data
  useEffect(() => {
    setSensorData(generateSensorData(24))
  }, [])

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => {
        if (prev.length === 0) return prev
        const newData = [...prev.slice(1)]
        const lastData = prev[prev.length - 1]
        if (!lastData) return prev
        newData.push({
          timestamp: new Date().toISOString(),
          soilMoisture: Math.max(10, Math.min(90, lastData.soilMoisture + (Math.random() - 0.5) * 5)),
          temperature: Math.max(15, Math.min(45, lastData.temperature + (Math.random() - 0.5) * 2)),
          humidity: Math.max(20, Math.min(90, lastData.humidity + (Math.random() - 0.5) * 4)),
          waterLevel: Math.max(10, Math.min(100, lastData.waterLevel + (Math.random() - 0.5) * 3)),
        })
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleDevice = useCallback((deviceId: string) => {
    setFields(prev =>
      prev.map(field => ({
        ...field,
        devices: field.devices.map(device =>
          device.id === deviceId
            ? { ...device, status: !device.status, lastUpdated: new Date().toISOString() }
            : device
        ),
      }))
    )
  }, [])

  const getDevicesByField = useCallback(
    (fieldId: string) => {
      const field = fields.find(f => f.id === fieldId)
      return field?.devices || []
    },
    [fields]
  )

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    )
  }, [])

  const addAlert = useCallback((alert: Omit<Alert, 'id'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}`,
    }
    setAlerts(prev => [newAlert, ...prev])
  }, [])

  const toggleRule = useCallback((ruleId: string) => {
    setAutomationRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    )
  }, [])

  const addRule = useCallback((rule: Omit<AutomationRule, 'id'>) => {
    const newRule: AutomationRule = {
      ...rule,
      id: `rule-${Date.now()}`,
    }
    setAutomationRules(prev => [...prev, newRule])
  }, [])

  const deleteRule = useCallback((ruleId: string) => {
    setAutomationRules(prev => prev.filter(rule => rule.id !== ruleId))
  }, [])

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev)
  }, [])

  return (
    <DashboardContext.Provider
      value={{
        fields,
        selectedFieldId,
        setSelectedFieldId,
        selectedField,
        sensorData,
        currentSensorValues,
        toggleDevice,
        getDevicesByField,
        alerts,
        acknowledgeAlert,
        addAlert,
        automationRules,
        toggleRule,
        addRule,
        deleteRule,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
