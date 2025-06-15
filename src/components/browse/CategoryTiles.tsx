import { FC, ReactNode } from 'react';

interface Category {
  name: string;
  icon: ReactNode;
}

const categories: Category[] = [
  { 
    name: 'Quick Meals', 
    icon: <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  },
  { 
    name: 'Gut-Friendly', 
    icon: <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 010 5H9m4.5-5a2.5 2.5 0 010 5M15 8.5V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v1.5" />
    </svg>
  },
  { 
    name: 'Vegan', 
    icon: <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v10a4 4 0 004 4h6a2 2 0 002-2V7a2 2 0 00-2-2z" />
    </svg>
  },
];

export const CategoryTiles: FC = () => {
  return (
    <div className="w-full max-w-4xl mt-lg">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex flex-col items-center justify-center p-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/30 cursor-pointer transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1"
          >
            <div className="text-primary mb-sm">{category.icon}</div>
            <h3 className="text-base font-semibold text-gray-800">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}; 