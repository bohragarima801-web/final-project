'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Download, Trash2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Column<T> = { 
  key: keyof T | string
  label: string
  render?: (row: T) => React.ReactNode
  className?: string
  sortable?: boolean
}

interface DataTableShellProps<T> {
  columns: Column<T>[]
  rows: T[]
  searchPlaceholder?: string
  actions?: React.ReactNode
  emptyMessage?: string
  onBulkDelete?: (ids: string[]) => Promise<void>
  onBulkStatusChange?: (ids: string[], newStatus: string) => Promise<void>
  statusOptions?: string[]
}

export function DataTableShell<T extends Record<string, any>>({
  columns, 
  rows, 
  searchPlaceholder, 
  actions, 
  emptyMessage,
  onBulkDelete,
  onBulkStatusChange,
  statusOptions = ['PUBLISHED', 'DRAFT', 'ACTIVE', 'INACTIVE', 'SUCCESS', 'PENDING', 'CANCELLED']
}: DataTableShellProps<T>) {
  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Toggle sort direction or column
  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(key)
      setSortDirection('asc')
    }
  }

  // Multi-row selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = rows.map(r => r.id).filter(Boolean) as string[]
      setSelectedIds(ids)
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id))
    }
  }

  // Filter & Search & Sort logic
  const processedRows = useMemo(() => {
    let result = [...rows]

    // 1. Search filter (case-insensitive across all fields)
    if (search.trim()) {
      const term = search.toLowerCase().trim()
      result = result.filter(row => {
        return Object.entries(row).some(([_, val]) => {
          if (val === null || val === undefined) return false
          if (typeof val === 'object') {
            return JSON.stringify(val).toLowerCase().includes(term)
          }
          return String(val).toLowerCase().includes(term)
        })
      })
    }

    // 2. Sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const valA = a[sortColumn]
        const valB = b[sortColumn]
        
        if (valA === undefined || valA === null) return 1
        if (valB === undefined || valB === null) return -1

        const strA = typeof valA === 'object' ? JSON.stringify(valA) : String(valA).toLowerCase()
        const strB = typeof valB === 'object' ? JSON.stringify(valB) : String(valB).toLowerCase()

        if (strA < strB) return sortDirection === 'asc' ? -1 : 1
        if (strA > strB) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [rows, search, sortColumn, sortDirection])

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(processedRows.length / pageSize))
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return processedRows.slice(startIndex, startIndex + pageSize)
  }, [processedRows, currentPage, pageSize])

  // CSV Exporter
  const handleExportCSV = () => {
    try {
      if (processedRows.length === 0) return
      
      const headers = columns.map(c => c.label).join(',')
      const csvRows = processedRows.map(row => {
        return columns.map(c => {
          const val = row[c.key as string]
          if (val === null || val === undefined) return '""'
          const cleanVal = typeof val === 'object' ? JSON.stringify(val) : String(val)
          return `"${cleanVal.replace(/"/g, '""')}"`
        }).join(',')
      })

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...csvRows].join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `export_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      console.error('Failed to export CSV:', e)
    }
  }

  // Bulk deletion handler
  const triggerBulkDelete = async () => {
    if (!onBulkDelete || selectedIds.length === 0) return
    if (confirm(`Are you sure you want to delete ${selectedIds.length} records?`)) {
      await onBulkDelete(selectedIds)
      setSelectedIds([])
    }
  }

  // Bulk status update handler
  const triggerBulkStatus = async (status: string) => {
    if (!onBulkStatusChange || selectedIds.length === 0) return
    await onBulkStatusChange(selectedIds, status)
    setSelectedIds([])
  }

  const allSelected = rows.length > 0 && selectedIds.length === rows.map(r => r.id).filter(Boolean).length

  return (
    <Card className="overflow-hidden border border-border/60">
      {/* Search and Utility Bar */}
      <div className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-border/50 bg-background/50">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={searchPlaceholder || 'Search anything…'} 
            className="pl-9 h-9 bg-muted/20 hover:bg-muted/40 transition-colors"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9">
            <Download className="h-4 w-4 mr-1.5 text-muted-foreground" /> Export CSV
          </Button>
          {actions}
        </div>
      </div>

      {/* Bulk Actions Indicator Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-amber-800 font-medium dark:text-amber-400">
            <span>{selectedIds.length} row(s) selected</span>
          </div>
          <div className="flex items-center gap-2">
            {onBulkStatusChange && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Change Status:</span>
                <select 
                  className="bg-background border border-border rounded px-2 py-1 text-xs outline-none"
                  onChange={(e) => triggerBulkStatus(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Select...</option>
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            )}
            {onBulkDelete && (
              <Button size="sm" variant="destructive" className="h-7 text-xs px-2.5" onClick={triggerBulkDelete}>
                <Trash2 className="h-3 w-3 mr-1" /> Bulk Delete
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr className="border-b border-border/40">
              {(onBulkDelete || onBulkStatusChange) && (
                <th className="w-12 px-4 py-3 text-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 accent-amber-500"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((c) => (
                <th 
                  key={String(c.key)} 
                  className={cn(
                    'text-left font-semibold text-muted-foreground px-4 py-3 text-xs tracking-wider uppercase', 
                    c.className
                  )}
                >
                  <div 
                    className={cn(
                      "flex items-center gap-1",
                      c.sortable !== false && "cursor-pointer select-none hover:text-foreground"
                    )}
                    onClick={() => c.sortable !== false && handleSort(c.key as string)}
                  >
                    {c.label}
                    {c.sortable !== false && (
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-foreground" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-20 text-center text-muted-foreground">
                  {emptyMessage || 'No records found.'}
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, i) => {
                const rowId = row.id || String(i)
                const isRowSelected = selectedIds.includes(rowId)
                return (
                  <tr 
                    key={rowId} 
                    className={cn(
                      "transition-colors hover:bg-muted/15 border-b border-border/10",
                      isRowSelected && "bg-amber-500/[0.02]"
                    )}
                  >
                    {(onBulkDelete || onBulkStatusChange) && (
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-gray-300 accent-amber-500"
                          checked={isRowSelected}
                          onChange={(e) => handleSelectRow(rowId, e.target.checked)}
                        />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td key={String(c.key)} className={cn('px-4 py-3 text-foreground/90 font-medium', c.className)}>
                        {c.render ? c.render(row) : String(row[c.key as keyof T] ?? '')}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/40 bg-background/40">
        <span className="text-xs text-muted-foreground">
          Showing {processedRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, processedRows.length)} of {processedRows.length} entries
        </span>
        <div className="flex items-center gap-1.5">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground px-2">
            Page <span className="font-semibold text-foreground">{currentPage}</span> of {totalPages}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="h-8 px-2"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
