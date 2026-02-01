'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { generateHistoricalData } from '@/lib/mock-data'
import { Download, History, ChevronLeft, ChevronRight } from 'lucide-react'

export function HistoryTable() {
  const [filter, setFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const data = useMemo(() => generateHistoricalData(), [])

  const filteredData = useMemo(() => {
    if (filter === 'all') return data
    return data.filter(record => record.fieldName === filter)
  }, [data, filter])

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, page])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Field', 'Soil Moisture (%)', 'Temperature (°C)', 'Humidity (%)', 'Water Level (%)', 'Pump Status']
    const csvContent = [
      headers.join(','),
      ...filteredData.map(record =>
        [
          new Date(record.timestamp).toISOString(),
          record.fieldName,
          record.soilMoisture,
          record.temperature,
          record.humidity,
          record.waterLevel,
          record.pumpStatus,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `sensor_history_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <History className="size-5" />
          Historical Data
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="North Field">North Field</SelectItem>
              <SelectItem value="South Field">South Field</SelectItem>
              <SelectItem value="East Field">East Field</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="mr-1 size-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Field</TableHead>
                <TableHead className="text-right">Moisture</TableHead>
                <TableHead className="text-right">Temp</TableHead>
                <TableHead className="text-right">Humidity</TableHead>
                <TableHead className="text-right">Water</TableHead>
                <TableHead>Pump</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map(record => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(record.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>{record.fieldName}</TableCell>
                  <TableCell className="text-right font-mono">{record.soilMoisture}%</TableCell>
                  <TableCell className="text-right font-mono">{record.temperature}°C</TableCell>
                  <TableCell className="text-right font-mono">{record.humidity}%</TableCell>
                  <TableCell className="text-right font-mono">{record.waterLevel}%</TableCell>
                  <TableCell>
                    <Badge variant={record.pumpStatus === 'Active' ? 'default' : 'secondary'}>
                      {record.pumpStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredData.length)} of{' '}
            {filteredData.length} records
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
