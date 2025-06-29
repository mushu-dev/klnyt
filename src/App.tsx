import { useState } from 'react';
import { Header } from './components/common/Header';
import { OrderForm } from './components/forms/OrderForm';
import { OrderTracker } from './components/tracking/OrderTracker';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { KlyntHomepage } from './components/homepage/KlyntHomepage';
import { InformationPage } from './components/information/InformationPage';
import { TrustedServicesPage } from './components/trusted/TrustedServicesPage';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { RefundPage } from './components/refund/RefundPage';
import { LoadingSpinner } from './components/common/LoadingSpinner';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'order' | 'track' | 'admin' | 'admin-login' | 'info' | 'trusted' | 'refund'>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleViewChange = (newView: 'home' | 'order' | 'track' | 'admin' | 'admin-login' | 'info' | 'trusted' | 'refund') => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(newView);
      setIsTransitioning(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isTransitioning && (
        <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      )}
      
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {currentView === 'home' ? (
          <KlyntHomepage 
            onStartOrder={() => handleViewChange('order')}
            onTrackOrder={() => handleViewChange('track')}
            onAdminAccess={() => {
              if (isAdminAuthenticated) {
                handleViewChange('admin');
              } else {
                handleViewChange('admin-login');
              }
            }}
            onInfoAccess={() => handleViewChange('info')}
            onTrustedServices={() => handleViewChange('trusted')}
            onRefundRequest={() => handleViewChange('refund')}
          />
        ) : currentView === 'trusted' ? (
          <TrustedServicesPage onBack={() => handleViewChange('home')} />
        ) : currentView === 'admin-login' ? (
          <AdminLoginPage 
            onLoginSuccess={() => {
              setIsAdminAuthenticated(true);
              handleViewChange('admin');
            }}
            onBack={() => handleViewChange('home')}
          />
        ) : currentView === 'refund' ? (
          <RefundPage onBack={() => handleViewChange('home')} />
        ) : (
          <>
            <Header currentView={currentView} onViewChange={handleViewChange} />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentView === 'order' && (
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Ship International Products to Trinidad & Tobago
                  </h1>
                  <button
                    onClick={() => handleViewChange('home')}
                    className="text-caribbean-blue hover:text-cyan-700 font-medium"
                  >
                    ← Back to Home
                  </button>
                </div>
                <OrderForm />
              </div>
            )}
            
            {currentView === 'track' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 text-center flex-1">
                    Track Your Order
                  </h1>
                  <button
                    onClick={() => handleViewChange('home')}
                    className="text-caribbean-blue hover:text-cyan-700 font-medium"
                  >
                    ← Back to Home
                  </button>
                </div>
                <OrderTracker />
              </div>
            )}
            
            {currentView === 'admin' && isAdminAuthenticated && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        setIsAdminAuthenticated(false);
                        handleViewChange('home');
                      }}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => handleViewChange('home')}
                      className="text-caribbean-blue hover:text-cyan-700 font-medium"
                    >
                      ← Back to Home
                    </button>
                  </div>
                </div>
                <AdminDashboard />
              </div>
            )}

            {currentView === 'info' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Information Center
                  </h1>
                  <button
                    onClick={() => handleViewChange('home')}
                    className="text-caribbean-blue hover:text-cyan-700 font-medium"
                  >
                    ← Back to Home
                  </button>
                </div>
                <InformationPage />
              </div>
            )}
          </main>
        </>
      )}
      </div>
    </div>
  );
}

export default App;
