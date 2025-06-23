"use client";
import { MacroTargets } from '@/types/profile';

interface Props {
  value: MacroTargets;
  onChange: (mt: MacroTargets) => void;
}

export default function MacroSliders({ value, onChange }: Props) {
  const handle = (key: keyof MacroTargets, num: number) => {
    onChange({ ...value, [key]: num });
  };

  const macroFields = [
    { key: 'calories', label: 'Calories', unit: 'kcal', min: 0, max: 5000, step: 50 },
    { key: 'protein', label: 'Protein', unit: 'g', min: 0, max: 300, step: 5 },
    { key: 'carbs', label: 'Carbs', unit: 'g', min: 0, max: 500, step: 5 },
    { key: 'fat', label: 'Fat', unit: 'g', min: 0, max: 200, step: 5 },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {macroFields.map(({ key, label, unit, min, max, step }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground capitalize">
                {label}
              </label>
              <span className="text-sm text-muted-foreground">
                {value[key] || 0} {unit}
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[key] || 0}
                onChange={(e) => handle(key, Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="number"
                value={value[key] || 0}
                onChange={(e) => handle(key, Number(e.target.value))}
                className="w-full border border-border bg-background text-foreground px-3 py-2 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                min={min}
                max={max}
                step={step}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick presets */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm font-medium text-foreground mb-2">Quick Presets:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange({ calories: 2000, protein: 150, carbs: 200, fat: 65 })}
            className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
          >
            Balanced (2000 cal)
          </button>
          <button
            onClick={() => onChange({ calories: 1800, protein: 140, carbs: 160, fat: 60 })}
            className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
          >
            Weight Loss (1800 cal)
          </button>
          <button
            onClick={() => onChange({ calories: 2500, protein: 180, carbs: 250, fat: 85 })}
            className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
          >
            Muscle Gain (2500 cal)
          </button>
        </div>
      </div>
    </div>
  );
} 