import { FC } from 'react';

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
          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}; 