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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {value.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1 border border-primary/20">
            {tag}
            <button 
              onClick={() => remove(tag)} 
              className="text-xs font-bold hover:text-primary/70 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-border bg-background text-foreground px-2 py-1 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add diet tag (e.g., vegan)"
        />
        <button 
          onClick={addTag} 
          className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          disabled={!input.trim()}
        >
          Add
        </button>
      </div>
    </div>
  );
} 