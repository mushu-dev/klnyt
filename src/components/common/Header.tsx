import { Package, Search, Shield, Home, FileText } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'order' | 'track' | 'admin' | 'info';
  onViewChange: (view: 'home' | 'order' | 'track' | 'admin' | 'info') => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-caribbean-blue" />
            <span className="ml-2 text-xl font-bold text-gray-900">Klynt Shipment</span>
          </div>
          
          <nav className="flex space-x-8">
            <button
              onClick={() => onViewChange('home')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                currentView === 'home'
                  ? 'text-caribbean-blue bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </button>

            <button
              onClick={() => onViewChange('order')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                currentView === 'order'
                  ? 'text-caribbean-blue bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Package className="h-4 w-4 mr-2" />
              New Order
            </button>
            
            <button
              onClick={() => onViewChange('track')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                currentView === 'track'
                  ? 'text-caribbean-blue bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Search className="h-4 w-4 mr-2" />
              Track Order
            </button>

            <button
              onClick={() => onViewChange('info')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                currentView === 'info'
                  ? 'text-caribbean-blue bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Information
            </button>
            
            <button
              onClick={() => onViewChange('admin')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                currentView === 'admin'
                  ? 'text-caribbean-blue bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}