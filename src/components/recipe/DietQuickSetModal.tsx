'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  DietPreferences, 
  MedicalCondition, 
  DIET_TEMPLATES, 
  COMMON_ALLERGENS, 
  CONDITION_TRIGGERS,
  DietTemplateName
} from '@/types/dietary-preferences'

interface DietQuickSetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (preferences: DietPreferences) => void
  initialPreferences?: DietPreferences
}

// Modal sections from technical specifications
enum ModalSection {
  EMBRACE_FOODS = 'embrace',
  AVOID_FOODS = 'avoid',
  MEDICAL_CONDITIONS = 'medical',
  REVIEW = 'review'
}

export function DietQuickSetModal({
  isOpen,
  onClose,
  onSave,
  initialPreferences
}: DietQuickSetModalProps) {
  const [currentSection, setCurrentSection] = useState<ModalSection>(ModalSection.EMBRACE_FOODS)
  const [preferences, setPreferences] = useState<DietPreferences>(
    initialPreferences || {
      embraceFoods: [],
      avoidFoods: [],
      medicalConditions: [],
      triggerFoods: [],
      severityLevels: {}
    }
  )

  if (!isOpen) return null

  const handleSave = () => {
    onSave(preferences)
    onClose()
  }

  // const addEmbraceFood = (food: string) => {
  //   setPreferences(prev => ({
  //     ...prev,
  //     embraceFoods: [...prev.embraceFoods, food]
  //   }))
  // }

  const removeEmbraceFood = (food: string) => {
    setPreferences(prev => ({
      ...prev,
      embraceFoods: prev.embraceFoods.filter(f => f !== food)
    }))
  }

  const addAvoidFood = (food: string, severity: 'preference' | 'medical' = 'preference') => {
    setPreferences(prev => ({
      ...prev,
      avoidFoods: [...prev.avoidFoods, food],
      severityLevels: { ...prev.severityLevels, [food]: severity }
    }))
  }

  const removeAvoidFood = (food: string) => {
    setPreferences(prev => ({
      ...prev,
      avoidFoods: prev.avoidFoods.filter(f => f !== food),
      severityLevels: Object.fromEntries(
        Object.entries(prev.severityLevels).filter(([key]) => key !== food)
      )
    }))
  }

  // const addMedicalCondition = (condition: MedicalCondition) => {
  //   setPreferences(prev => ({
  //     ...prev,
  //     medicalConditions: [...prev.medicalConditions, condition]
  //   }))
  // }

  // const removeMedicalCondition = (conditionId: string) => {
  //   setPreferences(prev => ({
  //     ...prev,
  //     medicalConditions: prev.medicalConditions.filter(c => c.id !== conditionId)
  //   }))
  // }

  const applyDietTemplate = (templateName: DietTemplateName) => {
    const template = DIET_TEMPLATES[templateName]
    setPreferences(prev => ({
      ...prev,
      embraceFoods: [...new Set([...prev.embraceFoods, ...template.foods])]
    }))
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Set Up Your Safe Eating Profile
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Configure your dietary preferences and restrictions for personalized, safe recipe recommendations
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex space-x-4">
              {Object.values(ModalSection).map((section, index) => (
                <button
                  key={section}
                  onClick={() => setCurrentSection(section)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    currentSection === section
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {section === ModalSection.EMBRACE_FOODS && "Embrace Foods"}
                  {section === ModalSection.AVOID_FOODS && "Avoid Foods"}
                  {section === ModalSection.MEDICAL_CONDITIONS && "Medical Conditions"}
                  {section === ModalSection.REVIEW && "Review"}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {/* Embrace Foods Section */}
            {currentSection === ModalSection.EMBRACE_FOODS && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Foods You Want to Include
                  </h3>
                  
                  {/* Diet Templates */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Popular Diet Templates:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(DIET_TEMPLATES).map(([key, template]) => (
                        <button
                          key={key}
                          onClick={() => applyDietTemplate(key as DietTemplateName)}
                          className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <div className="font-medium text-gray-900">{template.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{template.description}</div>
                          <div className="text-xs text-gray-500 mt-2">
                            {template.foods.slice(0, 3).join(', ')}...
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Foods */}
                  {preferences.embraceFoods.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Selected Foods:</h4>
                      <div className="flex flex-wrap gap-2">
                        {preferences.embraceFoods.map((food) => (
                          <span
                            key={food}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                          >
                            {food}
                            <button
                              onClick={() => removeEmbraceFood(food)}
                              className="ml-2 hover:text-green-600"
                              aria-label={`Remove ${food}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Avoid Foods Section */}
            {currentSection === ModalSection.AVOID_FOODS && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Foods to Avoid
                  </h3>
                  
                  {/* Common Allergens */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Common Allergens:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {COMMON_ALLERGENS.map((allergen) => (
                        <button
                          key={allergen}
                          onClick={() => addAvoidFood(allergen, 'medical')}
                          disabled={preferences.avoidFoods.includes(allergen)}
                          className={cn(
                            "p-3 text-sm border rounded-lg transition-colors",
                            preferences.avoidFoods.includes(allergen)
                              ? "bg-red-100 border-red-300 text-red-800"
                              : "border-gray-200 hover:border-red-300 hover:bg-red-50"
                          )}
                        >
                          {allergen}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Avoid Foods */}
                  {preferences.avoidFoods.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Foods to Avoid:</h4>
                      <div className="flex flex-wrap gap-2">
                        {preferences.avoidFoods.map((food) => (
                          <span
                            key={food}
                            className={cn(
                              "inline-flex items-center px-3 py-1 rounded-full text-sm",
                              preferences.severityLevels[food] === 'medical'
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            )}
                          >
                            {food}
                            <span className="ml-1 text-xs">
                              {preferences.severityLevels[food] === 'medical' ? '🚨' : '⚠️'}
                            </span>
                            <button
                              onClick={() => removeAvoidFood(food)}
                              className="ml-2 hover:opacity-70"
                              aria-label={`Remove ${food}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Medical Conditions Section */}
            {currentSection === ModalSection.MEDICAL_CONDITIONS && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Medical Conditions
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Select any medical conditions that affect your diet. We'll automatically avoid trigger foods.
                  </p>
                  
                  {/* Medical Conditions Grid - Placeholder */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(CONDITION_TRIGGERS).map(([condition, triggers]) => (
                      <div
                        key={condition}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="font-medium text-gray-900 mb-2">
                          {condition === 'UC' ? 'Ulcerative Colitis' : 
                           condition === 'Crohns' ? "Crohn's Disease" : 
                           condition}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          Common triggers: {triggers.slice(0, 3).join(', ')}...
                        </div>
                        <button className="text-sm text-primary hover:text-primary/80">
                          Add Condition
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Review Section */}
            {currentSection === ModalSection.REVIEW && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Review Your Profile
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Embrace Foods ({preferences.embraceFoods.length})</h4>
                      <p className="text-sm text-gray-600">
                        {preferences.embraceFoods.length > 0 
                          ? preferences.embraceFoods.join(', ')
                          : 'No foods selected'
                        }
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Avoid Foods ({preferences.avoidFoods.length})</h4>
                      <p className="text-sm text-gray-600">
                        {preferences.avoidFoods.length > 0 
                          ? preferences.avoidFoods.join(', ')
                          : 'No restrictions set'
                        }
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Medical Conditions ({preferences.medicalConditions.length})</h4>
                      <p className="text-sm text-gray-600">
                        {preferences.medicalConditions.length > 0 
                          ? preferences.medicalConditions.map(c => c.name).join(', ')
                          : 'No medical conditions specified'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <div className="flex space-x-3">
              {currentSection !== ModalSection.REVIEW && (
                <button
                  onClick={() => {
                    const sections = Object.values(ModalSection)
                    const currentIndex = sections.indexOf(currentSection)
                    if (currentIndex < sections.length - 1) {
                      setCurrentSection(sections[currentIndex + 1])
                    }
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Next
                </button>
              )}
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Apply Safety Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 