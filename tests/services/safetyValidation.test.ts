import { describe, it, expect } from 'vitest';
import {
  validateRecipeSafety,
  validateSearchConstraints,
  getSafeAlternatives,
} from '@/features/core/services/safetyValidationService';
import { DietPreferences } from '@/features/core/types/dietary-preferences';

// Mock Data
const mockRecipe = {
  id: '1',
  title: 'Test Recipe',
  ingredients: ['1 cup flour', '1/2 cup sugar', '1 tbsp peanut butter'],
  nutrition: { calories: 200, protein: 10, carbs: 30, fat: 5 },
};

const mockUserWithMedicalRestriction: DietPreferences = {
  avoidFoods: ['peanut butter'],
  embraceFoods: ['broccoli'],
  medicalConditions: [{ id: '1', name: 'Custom', severity: 'severe', customName: 'Peanut Allergy' }],
  severityLevels: { 'peanut butter': 'medical' },
  triggerFoods: [{ name: 'peanut butter', condition: 'Peanut Allergy', severity: 'severe', userAdded: true }],
};

const mockUserWithWarning: DietPreferences = {
  avoidFoods: [],
  embraceFoods: ['chicken'],
  medicalConditions: [{ id: '2', name: 'IBS', severity: 'moderate' }],
  severityLevels: {},
  triggerFoods: [{ name: 'milk', condition: 'IBS', severity: 'moderate', userAdded: false }],
};

const mockRecipeWithTriggerFood = {
    id: '2',
    title: 'Creamy Pasta',
    ingredients: ['1 box pasta', '1 cup milk', '1/2 cup cheese'],
    nutrition: { calories: 500, protein: 20, carbs: 60, fat: 20 },
}

const mockRecipeWithAvoidFood = {
    id: '3',
    title: 'Sugary Drink',
    ingredients: ['1 cup water', '1/4 cup sugar', 'flavoring'],
    nutrition: { calories: 120, protein: 0, carbs: 30, fat: 0 },
};

const userWithPreference: DietPreferences = {
    avoidFoods: ['sugar'],
    embraceFoods: [],
    medicalConditions: [],
    severityLevels: { sugar: 'preference' },
    triggerFoods: [],
};

const userWithMedicalNeed: DietPreferences = {
    avoidFoods: ['sugar'],
    embraceFoods: [],
    medicalConditions: [],
    severityLevels: { sugar: 'medical' },
    triggerFoods: [],
};

describe('SafetyValidationService', () => {
  describe('validateRecipeSafety', () => {
    it('should correctly identify and block recipes with known medical restrictions', async () => {
      const result = await validateRecipeSafety(mockRecipe, mockUserWithMedicalRestriction);

      expect(result.isSafe).toBe(false);
      expect(result.blockers).toHaveLength(1);
      expect(result.blockers[0].ingredient).toBe('1 tbsp peanut butter');
      expect(result.blockers[0].reason).toContain('medical restriction');
      expect(result.warnings).toHaveLength(0);
    });

    it('should correctly warn for trigger foods based on medical conditions', async () => {
      const result = await validateRecipeSafety(mockRecipeWithTriggerFood, mockUserWithWarning);

      expect(result.isSafe).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].ingredient).toBe('1 cup milk');
      expect(result.warnings[0].reason).toContain('which can trigger IBS');
      expect(result.warnings[0].severity).toBe('moderate');
      expect(result.blockers).toHaveLength(0);
    });

    it('should distinguish between severity levels, issuing a warning for a preference', async () => {
      const result = await validateRecipeSafety(mockRecipeWithAvoidFood, userWithPreference);

      expect(result.isSafe).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].ingredient).toContain('sugar');
      expect(result.warnings[0].reason).toContain('prefer to avoid');
      expect(result.blockers).toHaveLength(0);
    });

    it('should distinguish between severity levels, issuing a blocker for a medical need', async () => {
      const result = await validateRecipeSafety(mockRecipeWithAvoidFood, userWithMedicalNeed);
      
      expect(result.isSafe).toBe(false);
      expect(result.blockers).toHaveLength(1);
      expect(result.blockers[0].ingredient).toContain('sugar');
      expect(result.blockers[0].reason).toContain('medical restriction');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('validateSearchConstraints', () => {
    it('should detect conflicting embrace/avoid foods', async () => {
      const conflictingPrefs: DietPreferences = {
        embraceFoods: ['dairy', 'leafy greens'],
        avoidFoods: ['cheese', 'red meat'],
        medicalConditions: [],
        severityLevels: {},
        triggerFoods: [],
      };
      const result = await validateSearchConstraints(conflictingPrefs);
      expect(result.isValid).toBe(false);
      expect(result.issues).toHaveLength(1);
    });

    it('should return valid for non-conflicting preferences', async () => {
      const nonConflictingPrefs: DietPreferences = {
        embraceFoods: ['chicken', 'leafy greens'],
        avoidFoods: ['cheese', 'red meat'],
        medicalConditions: [],
        severityLevels: {},
        triggerFoods: [],
      };
      const result = await validateSearchConstraints(nonConflictingPrefs);
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe('getSafeAlternatives', () => {
    it('should suggest appropriate substitutions for common allergens', async () => {
      const dairyAlternatives = await getSafeAlternatives('dairy');
      expect(dairyAlternatives).toEqual(['plant-based milk', 'coconut milk', 'almond milk']);

      const glutenAlternatives = await getSafeAlternatives('gluten');
      expect(glutenAlternatives).toEqual(['gluten-free flour', 'almond flour', 'rice flour']);
    });

    it('should return an empty array for ingredients with no known alternatives', async () => {
        const noAlternatives = await getSafeAlternatives('water');
        expect(noAlternatives).toEqual([]);
    });
  });
});
