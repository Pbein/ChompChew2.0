'use client'

import React, { useState } from 'react'
import { SearchChip as SearchChipType, CATEGORY_CONFIG } from '@/stores/searchStore'
import { cn } from '@/lib/utils'

interface SearchChipProps {
  chip: SearchChipType
  onRemove: (chipId: string) => void
  onEdit?: (chipId: string, newText: string) => void
}

export const SearchChip: React.FC<SearchChipProps> = ({
  chip,
  onRemove,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(chip.text)
  
  const config = CATEGORY_CONFIG[chip.category]

  const handleEdit = () => {
    if (onEdit && editValue.trim() && editValue !== chip.text) {
      onEdit(chip.id, editValue.trim())
    }
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit()
    } else if (e.key === 'Escape') {
      setEditValue(chip.text)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border",
        chip.color
      )}>
        <span className="mr-1">{config.emoji}</span>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleEdit}
          className="bg-transparent border-none outline-none min-w-0 w-20"
          autoFocus
        />
      </div>
    )
  }

  return (
    <div className={cn(
      "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
      "hover:shadow-sm group",
      chip.color
    )}>
      <span className="mr-1.5">{config.emoji}</span>
      
      <span 
        className="cursor-pointer hover:underline"
        onClick={() => onEdit && setIsEditing(true)}
        title={onEdit ? "Click to edit" : undefined}
      >
        {chip.text}
      </span>
      
      <span className="mx-1.5 text-xs opacity-60">
        {config.label.toLowerCase()}
      </span>
      
      <button
        onClick={() => onRemove(chip.id)}
        className="ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors opacity-60 hover:opacity-100"
        title="Remove filter"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
} 