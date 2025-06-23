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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {value.map((item) => (
          <span key={item} className="px-2 py-1 bg-destructive/10 text-destructive rounded-full text-sm flex items-center gap-1 border border-destructive/20">
            {item}
            <button 
              onClick={() => remove(item)} 
              className="text-xs font-bold hover:text-destructive/70 transition-colors"
              aria-label={`Remove ${item}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-border bg-background text-foreground px-2 py-1 rounded focus:ring-2 focus:ring-destructive focus:border-destructive outline-none transition-colors"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add avoided ingredient"
        />
        <button 
          onClick={add} 
          className="px-3 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
          disabled={!input.trim()}
        >
          Add
        </button>
      </div>
    </div>
  );
} 