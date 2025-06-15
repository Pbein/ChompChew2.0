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

  return (
    <div className="space-y-4">
      {(['calories', 'protein', 'fat', 'carbs'] as (keyof MacroTargets)[]).map((k) => (
        <div key={k} className="flex items-center gap-4">
          <label className="w-24 capitalize">{k}</label>
          <input
            type="number"
            value={value[k] || 0}
            onChange={(e) => handle(k, Number(e.target.value))}
            className="border px-2 py-1 w-28 rounded"
            min={0}
          />
          <span className="text-sm text-gray-500">{k === 'calories' ? 'kcal' : 'g'}</span>
        </div>
      ))}
    </div>
  );
} 