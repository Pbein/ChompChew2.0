import { FC, ReactNode } from 'react';
import { FiZap, FiSmile, FiSunrise } from 'react-icons/fi';

interface Category {
  name: string;
  icon: ReactNode;
}

const categories: Category[] = [
  { name: 'Quick Meals', icon: <FiZap className="h-8 w-8" /> },
  { name: 'Gut-Friendly', icon: <FiSmile className="h-8 w-8" /> },
  { name: 'Vegan', icon: <FiSunrise className="h-8 w-8" /> },
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