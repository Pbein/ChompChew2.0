import { describe, it, expect } from 'vitest';
import {
  validateRecipeSafety,
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

    it.todo('should distinguish between severity levels (warning vs. blocker)');
  });

  describe('validateSearchConstraints', () => {
    it.todo('should detect conflicting embrace/avoid foods');
  });

  describe('getSafeAlternatives', () => {
    it.todo('should suggest appropriate substitutions for common allergens');
  });
});
