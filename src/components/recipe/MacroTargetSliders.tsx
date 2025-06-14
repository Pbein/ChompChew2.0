'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface MacroTargets {
  protein: number    // percentage (20-40%)
  carbs: number     // percentage (20-60%)
  fat: number       // percentage (15-40%)
}

interface MacroTargetSlidersProps {
  value?: MacroTargets
  onChange: (macros: MacroTargets | undefined) => void
  className?: string
}

// Validation rules from technical specifications
const MACRO_CONSTRAINTS = {
  protein: { min: 20, max: 40, default: 25 },
  carbs: { min: 20, max: 60, default: 45 },
  fat: { min: 15, max: 40, default: 30 }
}

// Popular presets from technical specifications
const MACRO_PRESETS = {
  balanced: { protein: 25, carbs: 45, fat: 30 },
  highProtein: { protein: 35, carbs: 35, fat: 30 },
  lowCarb: { protein: 30, carbs: 20, fat: 50 },
  keto: { protein: 25, carbs: 5, fat: 70 }
}

export function MacroTargetSliders({
  value,
  onChange,
  className
}: MacroTargetSlidersProps) {
  const [macros, setMacros] = useState<MacroTargets>(
    value || MACRO_PRESETS.balanced
  )
  const [isValid, setIsValid] = useState(true)

  // Validate that percentages total 100%
  useEffect(() => {
    const total = macros.protein + macros.carbs + macros.fat
    const isValidTotal = Math.abs(total - 100) < 1 // Allow 1% tolerance
    setIsValid(isValidTotal)
    
    if (isValidTotal) {
      onChange(macros)
    }
  }, [macros, onChange])

  const handleSliderChange = (macro: keyof MacroTargets, newValue: number) => {
    setMacros(prev => ({
      ...prev,
      [macro]: newValue
    }))
  }

  const handlePresetClick = (preset: MacroTargets) => {
    setMacros(preset)
  }

  const total = macros.protein + macros.carbs + macros.fat

  return (
    <div className={cn("space-y-4", className)}>
      {/* Macro Sliders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Macro Targets</h3>
          <span className={cn(
            "text-sm font-medium",
            isValid ? "text-green-600" : "text-red-600"
          )}>
            Total: {total.toFixed(0)}%
          </span>
        </div>

        {/* Protein Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm text-gray-600">Protein</label>
            <span className="text-sm font-medium text-gray-900">
              {macros.protein}%
            </span>
          </div>
          <input
            type="range"
            min={MACRO_CONSTRAINTS.protein.min}
            max={MACRO_CONSTRAINTS.protein.max}
            value={macros.protein}
            onChange={(e) => handleSliderChange('protein', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-protein"
            aria-label="Protein percentage"
          />
        </div>

        {/* Carbs Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm text-gray-600">Carbohydrates</label>
            <span className="text-sm font-medium text-gray-900">
              {macros.carbs}%
            </span>
          </div>
          <input
            type="range"
            min={MACRO_CONSTRAINTS.carbs.min}
            max={MACRO_CONSTRAINTS.carbs.max}
            value={macros.carbs}
            onChange={(e) => handleSliderChange('carbs', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-carbs"
            aria-label="Carbohydrates percentage"
          />
        </div>

        {/* Fat Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm text-gray-600">Fat</label>
            <span className="text-sm font-medium text-gray-900">
              {macros.fat}%
            </span>
          </div>
          <input
            type="range"
            min={MACRO_CONSTRAINTS.fat.min}
            max={MACRO_CONSTRAINTS.fat.max}
            value={macros.fat}
            onChange={(e) => handleSliderChange('fat', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-fat"
            aria-label="Fat percentage"
          />
        </div>
      </div>

      {/* Validation Message */}
      {!isValid && (
        <p className="text-sm text-red-600" role="alert">
          Macro percentages must total 100%
        </p>
      )}

      {/* Visual Pie Chart Preview - Placeholder */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Macro Distribution:</p>
        <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
          <div 
            className="bg-red-400 transition-all duration-300"
            style={{ width: `${macros.protein}%` }}
            title={`Protein: ${macros.protein}%`}
          />
          <div 
            className="bg-blue-400 transition-all duration-300"
            style={{ width: `${macros.carbs}%` }}
            title={`Carbs: ${macros.carbs}%`}
          />
          <div 
            className="bg-yellow-400 transition-all duration-300"
            style={{ width: `${macros.fat}%` }}
            title={`Fat: ${macros.fat}%`}
          />
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Popular presets:</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(MACRO_PRESETS).map(([name, preset]) => (
            <button
              key={name}
              onClick={() => handlePresetClick(preset)}
              className={cn(
                "px-3 py-2 text-sm rounded-lg border transition-colors text-left",
                JSON.stringify(macros) === JSON.stringify(preset)
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
              )}
              aria-label={`Set macro targets to ${name} preset`}
            >
              <div className="font-medium capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</div>
              <div className="text-xs opacity-75">
                P:{preset.protein}% C:{preset.carbs}% F:{preset.fat}%
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 