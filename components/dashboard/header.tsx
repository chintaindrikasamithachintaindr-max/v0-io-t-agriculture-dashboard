'use client'

import { useDashboard } from '@/lib/dashboard-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MapPin, Wheat } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { fields, selectedFieldId, setSelectedFieldId, selectedField } = useDashboard()

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedFieldId} onValueChange={setSelectedFieldId}>
          <SelectTrigger className="w-[200px] bg-card">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {fields.map(field => (
              <SelectItem key={field.id} value={field.id}>
                <div className="flex items-center gap-2">
                  <Wheat className="size-4 text-primary" />
                  <span>{field.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedField && (
          <div className="hidden items-center gap-2 rounded-lg bg-card px-3 py-2 text-sm text-muted-foreground sm:flex">
            <MapPin className="size-4" />
            <span>{selectedField.location}</span>
            <span className="mx-1 text-border">|</span>
            <span>{selectedField.cropType}</span>
            <span className="mx-1 text-border">|</span>
            <span>{selectedField.area} acres</span>
          </div>
        )}
      </div>
    </header>
  )
}
