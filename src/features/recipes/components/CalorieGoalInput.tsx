'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface CalorieGoalInputProps {
  value?: number
  onChange: (calories: number | undefined) => void
  className?: string
}

interface CalorieGoalState {
  inputValue: string
  selectedPreset?: number
  isValid: boolean
  validationMessage?: string
}

// Validation rules from technical specifications
const CALORIE_CONSTRAINTS = {
  min: 100,
  max: 3000,
  presets: [300, 500, 800, 1200, 1500, 2000]
}

export function CalorieGoalInput({
  value,
  onChange,
  className
}: CalorieGoalInputProps) {
  const [state, setState] = useState<CalorieGoalState>({
    inputValue: value?.toString() || '',
    selectedPreset: value,
    isValid: true,
    validationMessage: undefined
  })

  const handlePresetClick = (preset: number) => {
    setState(prev => ({
      ...prev,
      inputValue: preset.toString(),
      selectedPreset: preset,
      isValid: true,
      validationMessage: undefined
    }))
    onChange(preset)
  }

  const handleInputChange = (inputValue: string) => {
    setState(prev => ({ ...prev, inputValue }))
    
    if (!inputValue) {
      onChange(undefined)
      return
    }

    const calories = parseInt(inputValue)
    if (isNaN(calories) || calories < CALORIE_CONSTRAINTS.min || calories > CALORIE_CONSTRAINTS.max) {
      setState(prev => ({
        ...prev,
        isValid: false,
        validationMessage: `Please enter a value between ${CALORIE_CONSTRAINTS.min} and ${CALORIE_CONSTRAINTS.max} calories`
      }))
      return
    }

    setState(prev => ({
      ...prev,
      isValid: true,
      validationMessage: undefined,
      selectedPreset: CALORIE_CONSTRAINTS.presets.includes(calories) ? calories : undefined
    }))
    onChange(calories)
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Calorie Input Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Calorie Goal
        </label>
        <input
          type="number"
          value={state.inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter calorie goal"
          className={cn(
            "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
            !state.isValid && "border-red-500 focus:ring-red-500"
          )}
          min={CALORIE_CONSTRAINTS.min}
          max={CALORIE_CONSTRAINTS.max}
          aria-label="Calorie goal input"
        />
        {!state.isValid && state.validationMessage && (
          <p className="text-sm text-red-600" role="alert">
            {state.validationMessage}
          </p>
        )}
      </div>

      {/* Quick Preset Buttons */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Quick presets:</p>
        <div className="flex flex-wrap gap-2">
          {CALORIE_CONSTRAINTS.presets.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className={cn(
                "px-3 py-1 text-sm rounded-full border transition-colors",
                state.selectedPreset === preset
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
              )}
              aria-label={`Set calorie goal to ${preset}`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 