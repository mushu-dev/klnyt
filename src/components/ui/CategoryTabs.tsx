
interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 px-4 md:px-6">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${activeCategory === category.id
              ? 'bg-white text-gray-900 shadow-md border-2 border-florest-green-400'
              : 'bg-white/60 text-florest-sage hover:bg-white/80 border-2 border-transparent'
            }
          `}
        >
          <span className="flex items-center space-x-1">
            <span>{category.name}</span>
            <span className="text-xs opacity-70">({category.count})</span>
            {activeCategory === category.id && (
              <div className="w-1.5 h-1.5 bg-florest-green-500 rounded-full ml-2"></div>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}