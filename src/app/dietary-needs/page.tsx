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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-error" />
            <h1 className="text-4xl font-bold text-foreground">My Dietary Needs</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us about your dietary preferences, allergies, and health conditions so we can recommend safe, personalized recipes just for you.
          </p>
          
          {!user && (
            <div className="mt-4 p-4 bg-info/10 border border-info/20 rounded-lg">
              <div className="flex items-center gap-2 text-info">
                <User className="h-5 w-5" />
                <span className="font-medium">Guest Mode</span>
              </div>
              <p className="text-info/80 text-sm mt-1">
                Your preferences will be saved locally. Sign up to sync across devices!
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Dietary Preferences */}
          <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Utensils className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold text-foreground">Dietary Preferences</h2>
            </div>
            
            <div className="space-y-3">
              {COMMON_DIETS.map((diet) => (
                <button
                  key={diet.name}
                  onClick={() => toggleDiet(diet.name)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    localPreferences.dietary_preferences.includes(diet.name)
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-muted text-muted-foreground hover:border-accent/50'
                  }`}
                >
                  <div className="font-medium">{diet.name}</div>
                  <div className="text-sm opacity-75">{diet.description}</div>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-foreground mb-3">Custom Dietary Tags</h3>
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
          <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-error" />
              <h2 className="text-2xl font-semibold text-foreground">Allergies & Restrictions</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {COMMON_ALLERGENS.map((allergen) => (
                <button
                  key={allergen}
                  onClick={() => toggleAllergen(allergen)}
                  className={`p-3 text-sm rounded-lg border-2 transition-all ${
                    localPreferences.allergens.includes(allergen)
                      ? 'border-error bg-error/10 text-error'
                      : 'border-border bg-muted text-muted-foreground hover:border-error/50'
                  }`}
                >
                  {allergen}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-foreground mb-3">Custom Allergies</h3>
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
          <div className="bg-card rounded-xl shadow-lg p-6 md:col-span-2 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-info" />
              <h2 className="text-2xl font-semibold text-foreground">Medical Conditions</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Help us recommend recipes that support your health conditions and dietary management needs.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {MEDICAL_CONDITIONS.map((condition) => (
                <button
                  key={condition.name}
                  onClick={() => toggleMedicalCondition(condition.name)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    localPreferences.medical_conditions.includes(condition.name)
                      ? 'border-info bg-info/10 text-info'
                      : 'border-border bg-muted text-muted-foreground hover:border-info/50'
                  }`}
                >
                  <div className="font-medium">{condition.name}</div>
                  <div className="text-sm opacity-75 mt-1">{condition.description}</div>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-foreground mb-3">Other Medical Conditions</h3>
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
                ? 'bg-success text-white'
                : saveStatus === 'error'
                ? 'bg-error text-white'
                : 'bg-accent hover:bg-accent/90 text-accent-foreground'
            } ${saveStatus === 'saving' ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {saveStatus === 'saving' && '⏳ Saving...'}
            {saveStatus === 'saved' && '✅ Saved!'}
            {saveStatus === 'error' && '❌ Error - Try Again'}
            {saveStatus === 'idle' && '💾 Save My Preferences'}
          </button>

          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <ChefHat className="h-4 w-4" />
              Back to Recipes
            </button>
            
            {!user && (
              <button
                onClick={() => router.push('/auth/signup')}
                className="flex items-center gap-2 px-4 py-2 bg-info/10 hover:bg-info/20 text-info rounded-lg transition-colors"
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
          <div className="mt-8 bg-muted/50 rounded-xl p-6 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-4">Your Dietary Profile Summary</h3>
            
            {localPreferences.dietary_preferences.length > 0 && (
              <div className="mb-3">
                <span className="font-medium text-accent">Dietary Preferences: </span>
                <span className="text-foreground">{localPreferences.dietary_preferences.join(', ')}</span>
              </div>
            )}
            
            {localPreferences.allergens.length > 0 && (
              <div className="mb-3">
                <span className="font-medium text-error">Allergies & Restrictions: </span>
                <span className="text-foreground">{localPreferences.allergens.join(', ')}</span>
              </div>
            )}
            
            {localPreferences.medical_conditions.length > 0 && (
              <div className="mb-3">
                <span className="font-medium text-info">Medical Conditions: </span>
                <span className="text-foreground">{localPreferences.medical_conditions.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 