"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Heart, Shield, Utensils, ChefHat, AlertTriangle } from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';
import { createClientComponentClient } from '@/lib/supabase';
import DietaryProfileSelector from '@/components/profile/DietaryProfileSelector';

const COMMON_DIETS = [
  { name: 'Vegetarian', description: 'No meat, but includes dairy and eggs' },
  { name: 'Vegan', description: 'No animal products whatsoever' },
  { name: 'Gluten-Free', description: 'No wheat, barley, rye, or other gluten sources' },
  { name: 'Keto', description: 'Very low carb, high fat diet' },
  { name: 'Paleo', description: 'Based on presumed paleolithic diet' },
  { name: 'Mediterranean', description: 'High in vegetables, olive oil, and fish' },
  { name: 'Low-Sodium', description: 'Reduced salt intake' },
  { name: 'Dairy-Free', description: 'No milk, cheese, or dairy products' },
];

const COMMON_ALLERGENS = [
  'Nuts', 'Peanuts', 'Shellfish', 'Fish', 'Eggs', 
  'Soy', 'Wheat', 'Dairy', 'Sesame', 'Sulfites'
];

const MEDICAL_CONDITIONS = [
  { name: 'UC (Ulcerative Colitis)', description: 'Low-fiber, anti-inflammatory foods' },
  { name: 'Crohn\'s Disease', description: 'Avoid trigger foods, easy to digest' },
  { name: 'IBS', description: 'Low FODMAP friendly options' },
  { name: 'Diabetes', description: 'Blood sugar management focused' },
  { name: 'High Blood Pressure', description: 'Low sodium, heart healthy' },
];

export default function DietaryNeedsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const { profile, updateProfile } = useProfileStore();
  
  const [localPreferences, setLocalPreferences] = useState({
    dietary_preferences: profile?.dietary_preferences || [],
    allergens: profile?.allergens || [],
    medical_conditions: profile?.medical_conditions || [],
  });
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Get user session
  useEffect(() => {
    const supabase = createClientComponentClient()
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleDietaryChange = useCallback((newPreferences: string[]) => {
    setLocalPreferences(prev => ({
      ...prev,
      dietary_preferences: newPreferences
    }));
  }, []);

  const handleAllergenChange = useCallback((newAllergens: string[]) => {
    setLocalPreferences(prev => ({
      ...prev,
      allergens: newAllergens
    }));
  }, []);

  const handleMedicalChange = useCallback((newConditions: string[]) => {
    setLocalPreferences(prev => ({
      ...prev,
      medical_conditions: newConditions
    }));
  }, []);

  const toggleDiet = (dietName: string) => {
    const current = localPreferences.dietary_preferences;
    if (current.includes(dietName)) {
      handleDietaryChange(current.filter((d: string) => d !== dietName));
    } else {
      handleDietaryChange([...current, dietName]);
    }
  };

  const toggleAllergen = (allergen: string) => {
    const current = localPreferences.allergens;
    if (current.includes(allergen)) {
      handleAllergenChange(current.filter((a: string) => a !== allergen));
    } else {
      handleAllergenChange([...current, allergen]);
    }
  };

  const toggleMedicalCondition = (condition: string) => {
    const current = localPreferences.medical_conditions;
    if (current.includes(condition)) {
      handleMedicalChange(current.filter(c => c !== condition));
    } else {
      handleMedicalChange([...current, condition]);
    }
  };

  const savePreferences = async () => {
    if (!user) {
      // For guests, store in localStorage
      localStorage.setItem('guestDietaryPreferences', JSON.stringify(localPreferences));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return;
    }

    try {
      setSaveStatus('saving');
      await updateProfile(localPreferences);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">My Dietary Needs</h1>
          </div>
          <p className="text-lg text-gray-800 dark:text-gray-200 max-w-2xl mx-auto">
            Tell us about your dietary preferences, allergies, and health conditions so we can recommend safe, personalized recipes just for you.
          </p>
          
          {!user && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <User className="h-5 w-5" />
                <span className="font-medium">Guest Mode</span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                Your preferences will be saved locally. Sign up to sync across devices!
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Dietary Preferences */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Utensils className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dietary Preferences</h2>
            </div>
            
            <div className="space-y-3">
              {COMMON_DIETS.map((diet) => (
                <button
                  key={diet.name}
                  onClick={() => toggleDiet(diet.name)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    localPreferences.dietary_preferences.includes(diet.name)
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-green-300'
                  }`}
                >
                  <div className="font-medium">{diet.name}</div>
                  <div className="text-sm opacity-75">{diet.description}</div>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Custom Dietary Tags</h3>
              <DietaryProfileSelector 
                value={localPreferences.dietary_preferences.filter((pref: string) => 
                  !COMMON_DIETS.some(diet => diet.name === pref)
                )}
                onChange={(customTags: string[]) => {
                  const commonDiets = localPreferences.dietary_preferences.filter((pref: string) =>
                    COMMON_DIETS.some(diet => diet.name === pref)
                  );
                  handleDietaryChange([...commonDiets, ...customTags]);
                }}
              />
            </div>
          </div>

          {/* Allergies & Restrictions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Allergies & Restrictions</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {COMMON_ALLERGENS.map((allergen) => (
                <button
                  key={allergen}
                  onClick={() => toggleAllergen(allergen)}
                  className={`p-3 text-sm rounded-lg border-2 transition-all ${
                    localPreferences.allergens.includes(allergen)
                      ? 'border-red-500 bg-red-50 text-red-900'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-red-300'
                  }`}
                >
                  {allergen}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Custom Allergies</h3>
              <DietaryProfileSelector 
                value={localPreferences.allergens.filter((allergen: string) => 
                  !COMMON_ALLERGENS.includes(allergen)
                )}
                onChange={(customAllergens: string[]) => {
                  const commonAllergens = localPreferences.allergens.filter((allergen: string) =>
                    COMMON_ALLERGENS.includes(allergen)
                  );
                  handleAllergenChange([...commonAllergens, ...customAllergens]);
                }}
              />
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Medical Conditions</h2>
            </div>
                            <p className="text-gray-800 dark:text-gray-200 mb-4">
              Help us recommend recipes that support your health conditions and dietary management needs.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {MEDICAL_CONDITIONS.map((condition) => (
                <button
                  key={condition.name}
                  onClick={() => toggleMedicalCondition(condition.name)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    localPreferences.medical_conditions.includes(condition.name)
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium">{condition.name}</div>
                  <div className="text-sm opacity-75 mt-1">{condition.description}</div>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Other Medical Conditions</h3>
              <DietaryProfileSelector 
                value={localPreferences.medical_conditions.filter((condition: string) => 
                  !MEDICAL_CONDITIONS.some(med => med.name === condition)
                )}
                onChange={(customConditions: string[]) => {
                  const commonConditions = localPreferences.medical_conditions.filter((condition: string) =>
                    MEDICAL_CONDITIONS.some(med => med.name === condition)
                  );
                  handleMedicalChange([...commonConditions, ...customConditions]);
                }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <button
            onClick={savePreferences}
            disabled={saveStatus === 'saving'}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              saveStatus === 'saved'
                ? 'bg-green-600 text-white'
                : saveStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } ${saveStatus === 'saving' ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {saveStatus === 'saving' && '⏳ Saving...'}
            {saveStatus === 'saved' && '✅ Saved!'}
            {saveStatus === 'error' && '❌ Error - Try Again'}
            {saveStatus === 'idle' && '💾 Save My Preferences'}
          </button>

                      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-700 dark:text-gray-300">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChefHat className="h-4 w-4" />
              Back to Recipes
            </button>
            
            {!user && (
              <button
                onClick={() => router.push('/auth/signup')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              >
                <User className="h-4 w-4" />
                Sign Up to Sync
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        {(localPreferences.dietary_preferences.length > 0 || 
          localPreferences.allergens.length > 0 || 
          localPreferences.medical_conditions.length > 0) && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Dietary Profile Summary</h3>
            
            {localPreferences.dietary_preferences.length > 0 && (
              <div className="mb-3">
                <span className="font-medium text-green-700">Dietary Preferences: </span>
                <span className="text-gray-700">{localPreferences.dietary_preferences.join(', ')}</span>
              </div>
            )}
            
            {localPreferences.allergens.length > 0 && (
              <div className="mb-3">
                <span className="font-medium text-red-700">Allergies & Restrictions: </span>
                <span className="text-gray-700">{localPreferences.allergens.join(', ')}</span>
              </div>
            )}
            
            {localPreferences.medical_conditions.length > 0 && (
              <div className="mb-3">
                <span className="font-medium text-blue-700">Medical Conditions: </span>
                <span className="text-gray-700">{localPreferences.medical_conditions.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 