'use client'

import React from "react"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboard } from '@/lib/dashboard-context'
import { FileText, Download, Calendar, BarChart3, FileSpreadsheet, FileType } from 'lucide-react'
import { cn } from '@/lib/utils'

type ReportType = 'summary' | 'detailed' | 'alerts' | 'automation'
type ExportFormat = 'pdf' | 'csv' | 'excel'
type DateRange = '7days' | '30days' | '90days' | 'custom'

export function ReportsPanel() {
  const { fields, selectedFieldId } = useDashboard()
  const [reportType, setReportType] = useState<ReportType>('summary')
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf')
  const [dateRange, setDateRange] = useState<DateRange>('7days')
  const [selectedField, setSelectedField] = useState<string>(selectedFieldId)
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTypes: { value: ReportType; label: string; description: string }[] = [
    { value: 'summary', label: 'Summary Report', description: 'Overview of all sensor data and device status' },
    { value: 'detailed', label: 'Detailed Analysis', description: 'In-depth sensor trends and statistics' },
    { value: 'alerts', label: 'Alerts Report', description: 'Historical alerts and acknowledgements' },
    { value: 'automation', label: 'Automation Log', description: 'Rule triggers and automated actions' },
  ]

  const formatIcons: Record<ExportFormat, React.ReactNode> = {
    pdf: <FileType className="size-5" />,
    csv: <FileText className="size-5" />,
    excel: <FileSpreadsheet className="size-5" />,
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)

    // Create a sample download
    const reportContent = generateReportContent(reportType, dateRange)
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.txt`)
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <FileText className="size-5" />
            Generate Report
          </CardTitle>
          <CardDescription>
            Create customized reports for your agricultural data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-3">
            <Label>Report Type</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {reportTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setReportType(type.value)}
                  className={cn(
                    'flex flex-col items-start rounded-lg border p-4 text-left transition-colors',
                    reportType === type.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className="font-medium text-foreground">{type.label}</span>
                  <span className="mt-1 text-xs text-muted-foreground">{type.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Field</Label>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  {fields.map(field => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={v => setDateRange(v as DateRange)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={v => setExportFormat(v as ExportFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                  <SelectItem value="excel">Excel Workbook</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full sm:w-auto">
            {isGenerating ? (
              <>
                <div className="mr-2 size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 size-4" />
                Generate & Download Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Quick Reports</CardTitle>
          <CardDescription>One-click access to common reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Calendar className="size-5" />, label: 'Daily Summary', color: 'bg-primary/10 text-primary' },
              { icon: <BarChart3 className="size-5" />, label: 'Weekly Analysis', color: 'bg-chart-2/10 text-chart-2' },
              { icon: <FileText className="size-5" />, label: 'Monthly Overview', color: 'bg-chart-3/10 text-chart-3' },
              { icon: <FileSpreadsheet className="size-5" />, label: 'Full Export', color: 'bg-chart-5/10 text-chart-5' },
            ].map((item, index) => (
              <button
                key={index}
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-card"
              >
                <div className={cn('flex size-10 items-center justify-center rounded-lg', item.color)}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function generateReportContent(type: ReportType, range: DateRange): string {
  const now = new Date()
  const title = {
    summary: 'Summary Report',
    detailed: 'Detailed Analysis Report',
    alerts: 'Alerts Report',
    automation: 'Automation Log Report',
  }[type]

  return `
AgriSmart IoT Dashboard
${title}
Generated: ${now.toLocaleString()}
Date Range: ${range}

=====================================

This is a sample report document.
In a production environment, this would contain:

- Sensor data summaries and averages
- Device usage statistics
- Alert history and response times
- Automation rule effectiveness
- Recommendations for optimization

=====================================

Thank you for using AgriSmart IoT Dashboard.
  `.trim()
}
