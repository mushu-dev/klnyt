import { Plus } from 'lucide-react';

interface ProductCardProps {
  id: string;
  title: string;
  image?: string;
  imageAlt?: string;
  category: string;
  description?: string;
  onClick: () => void;
  onAddClick: () => void;
}

export function ProductCard({ 
  title, 
  image, 
  imageAlt, 
  category, 
  description, 
  onClick, 
  onAddClick 
}: ProductCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer border border-gray-100/50"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        {/* Product Info */}
        <div className="flex-1">
          {/* Image */}
          {image && (
            <div className="mb-3">
              <img
                src={image}
                alt={imageAlt || title}
                className="w-full h-32 object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Content */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs bg-florest-green-100 text-florest-green-600 px-2 py-1 rounded-full font-medium">
                {category}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            {description && (
              <p className="text-sm text-florest-sage line-clamp-2">{description}</p>
            )}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddClick();
          }}
          className="ml-4 w-10 h-10 bg-florest-green-500 hover:bg-florest-green-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}