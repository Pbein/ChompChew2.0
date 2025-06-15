import { FC } from 'react';
import { FiSearch } from 'react-icons/fi';

export const HeroSearchBar: FC = () => {
  return (
    <div className="w-full max-w-2xl mt-lg">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for recipes, ingredients, or dietary needs..."
          className="w-full pl-12 pr-4 py-4 text-base bg-white rounded-full shadow-lg border-2 border-transparent focus:border-primary focus:ring-primary focus:outline-none transition-all"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <FiSearch className="h-6 w-6 text-gray-400" />
        </div>
      </div>
    </div>
  );
}; 