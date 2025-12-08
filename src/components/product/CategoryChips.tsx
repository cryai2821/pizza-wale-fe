'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Category } from '@/types';

interface CategoryChipsProps {
  categories: Category[];
  activeCategory?: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryChips({ categories, activeCategory, onSelect }: CategoryChipsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-16 z-40 w-full bg-white border-b shadow-sm">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto py-3 px-4 gap-3 no-scrollbar scroll-smooth"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              "flex-none rounded-full px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
              activeCategory === category.id
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
