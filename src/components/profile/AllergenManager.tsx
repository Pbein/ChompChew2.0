"use client";
import { useState } from 'react';

interface Props {
  value: string[];
  onChange: (list: string[]) => void;
}

export default function AllergenManager({ value, onChange }: Props) {
  const [input, setInput] = useState('');

  const add = () => {
    if (!input.trim()) return;
    onChange([...value, input.trim()]);
    setInput('');
  };

  const remove = (item: string) => onChange(value.filter((i) => i !== item));

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {value.map((item) => (
          <span key={item} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
            {item}
            <button onClick={() => remove(item)} className="text-xs font-bold">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add avoided ingredient"
        />
        <button onClick={add} className="px-3 py-1 bg-red-600 text-white rounded">Add</button>
      </div>
    </div>
  );
} 