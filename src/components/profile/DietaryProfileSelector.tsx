"use client";
import { useState } from 'react';

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function DietaryProfileSelector({ value, onChange }: Props) {
  const [input, setInput] = useState('');

  const addTag = () => {
    if (!input.trim()) return;
    onChange([...value, input.trim()]);
    setInput('');
  };

  const remove = (t: string) => {
    onChange(value.filter((v) => v !== t));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {value.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-1">
            {tag}
            <button onClick={() => remove(tag)} className="text-xs font-bold">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add diet tag (e.g., vegan)"
        />
        <button onClick={addTag} className="px-3 py-1 bg-indigo-600 text-white rounded">Add</button>
      </div>
    </div>
  );
} 