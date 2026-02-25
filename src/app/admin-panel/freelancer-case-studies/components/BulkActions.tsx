'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Trash2, Star, Download } from 'lucide-react'

interface BulkActionsProps {
  selectedIds: string[]
  onBulkAction: (action: string, ids: string[]) => Promise<void>
  onClearSelection: () => void
}

export default function BulkActions({ selectedIds, onBulkAction, onClearSelection }: BulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAction = async (action: string) => {
    setLoading(true)
    try {
      await onBulkAction(action, selectedIds)
      setIsOpen(false)
      onClearSelection()
    } catch (error) {
      console.error('Error in bulk action:', error)
    } finally {
      setLoading(false)
    }
  }

  if (selectedIds.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center gap-2">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {selectedIds.length} selected
        </span>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        <button
          onClick={() => handleAction('approve')}
          disabled={loading}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
          title="Approve selected"
        >
          <CheckCircle className="h-5 w-5" />
        </button>

        <button
          onClick={() => handleAction('reject')}
          disabled={loading}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Reject selected"
        >
          <XCircle className="h-5 w-5" />
        </button>

        <button
          onClick={() => handleAction('feature')}
          disabled={loading}
          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
          title="Feature selected"
        >
          <Star className="h-5 w-5" />
        </button>

        <button
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${selectedIds.length} case studies?`)) {
              handleAction('delete')
            }
          }}
          disabled={loading}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Delete selected"
        >
          <Trash2 className="h-5 w-5" />
        </button>

        <button
          onClick={onClearSelection}
          disabled={loading}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          title="Clear selection"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}