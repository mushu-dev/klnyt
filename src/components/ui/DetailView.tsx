import { X, ArrowLeft } from 'lucide-react';

interface DetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  image?: string;
  imageAlt?: string;
  description: string;
  onOrderClick: () => void;
}

export function DetailView({ 
  isOpen, 
  onClose, 
  title, 
  image, 
  imageAlt, 
  description, 
  onOrderClick 
}: DetailViewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="h-full bg-gradient-to-br from-florest-green-50 to-florest-green-100 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          {image && (
            <div className="mb-6">
              <img
                src={image}
                alt={imageAlt || title}
                className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>

          {/* Order Button */}
          <button
            onClick={onOrderClick}
            className="w-full bg-florest-green-500 hover:bg-florest-green-600 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Order This Item
          </button>
        </div>
      </div>
    </div>
  );
}