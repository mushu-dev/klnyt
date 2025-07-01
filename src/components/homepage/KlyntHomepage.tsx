import { useState } from 'react';
import { Menu, X, Phone, MessageCircle, Truck, CreditCard, Clock, Star, Instagram, Mail } from 'lucide-react';
import { SupportContact } from '../common/SupportContact';

// Import brand logos
import robloxLogo from '../../assets/images/brands/roblox-logo.jpeg';
import netflixLogo from '../../assets/images/brands/netflix-logo.jpeg';
import playstationLogo from '../../assets/images/brands/playstation-logo.jpeg';
import sheinLogo from '../../assets/images/brands/shein-logo.jpeg';
import amazonLogo from '../../assets/images/brands/amazon-logo.jpeg';
import samsungLogo from '../../assets/images/brands/samsung-logo-black.jpg';
import nowOpenImg from '../../assets/images/now-open.svg';

interface KlyntHomepageProps {
  onStartOrder: () => void;
  onTrackOrder: () => void;
  onAdminAccess: () => void;
  onInfoAccess: () => void;
  onTrustedServices: () => void;
  onRefundRequest: () => void;
}

export function KlyntHomepage({ onStartOrder, onTrackOrder, onAdminAccess, onInfoAccess, onTrustedServices, onRefundRequest }: KlyntHomepageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const services = [
    { 
      name: 'Fashion', 
      logo: sheinLogo,
      description: 'Latest trends and styles',
      brands: ['Shein', 'Temu', 'Amazon Fashion'],
      gradientFrom: '#FF69B4',
      gradientTo: '#FFB6C1'
    },
    { 
      name: 'Electronics', 
      logo: samsungLogo,
      description: 'Gadgets and tech items',
      brands: ['Samsung', 'Apple', 'Android'],
      gradientFrom: '#f8fafc',
      gradientTo: '#e2e8f0',
      logoBackground: '#000000',
      textColor: '#000000',
      specialStyling: true
    },
    { 
      name: 'Streaming Services', 
      logo: netflixLogo,
      description: 'Entertainment subscriptions',
      brands: ['Netflix', 'Disney+', 'HBO Max'],
      gradientFrom: '#DC2626',
      gradientTo: '#EF4444'
    },
    { 
      name: 'Gaming', 
      logo: playstationLogo,
      description: 'Gaming gifts & accounts',
      brands: ['PlayStation', 'Roblox', 'Xbox'],
      gradientFrom: '#1E40AF',
      gradientTo: '#3B82F6'
    },
    { 
      name: 'General Shopping', 
      logo: amazonLogo,
      description: 'Everything from Amazon & more',
      brands: ['Amazon', 'Gift Cards', 'Custom Orders'],
      gradientFrom: '#000000',
      gradientTo: '#000000',
      logoBackground: 'transparent',
      textColor: '#ffffff'
    },
    { 
      name: 'Local Delivery', 
      icon: '🚚',
      description: 'Fast local shipping',
      brands: ['Express Delivery'],
      gradientFrom: '#059669',
      gradientTo: '#10B981'
    }
  ];

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Hi! I\'d like to know more about Klynt Shipment services.');
    window.open(`https://wa.me/18684750965?text=${message}`, '_blank');
  };



  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative">
                <img
                  src="/klynt-logo-new.jpg"
                  alt="Klynt Shipment Logo"
                  className="h-14 w-auto object-contain rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: '0 0 20px rgba(220, 38, 38, 0.3), 0 4px 15px rgba(0, 0, 0, 0.1)',
                    padding: '6px',
                    border: '2px solid rgba(220, 38, 38, 0.1)'
                  }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 60% 40%, rgba(220, 38, 38, 0.15) 0%, transparent 70%)',
                    animation: 'pulse 2s ease-in-out infinite alternate'
                  }}
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={onStartOrder}
                className="text-gray-700 hover:text-caribbean-blue font-semibold transition-colors"
              >
                Start Order
              </button>
              <button 
                onClick={onTrackOrder}
                className="text-gray-700 hover:text-caribbean-blue font-semibold transition-colors"
              >
                Track Order
              </button>
              <button 
                onClick={onRefundRequest}
                className="text-gray-700 hover:text-caribbean-blue font-semibold transition-colors"
              >
                Request Refund
              </button>
              <SupportContact />
              <button 
                onClick={onTrustedServices}
                className="text-gray-700 hover:text-caribbean-blue font-semibold transition-colors"
              >
                Trusted Services
              </button>
              <button 
                onClick={onInfoAccess}
                className="text-gray-700 hover:text-caribbean-blue font-semibold transition-colors"
              >
                Information
              </button>
              <button 
                onClick={onAdminAccess}
                className="text-gray-700 hover:text-caribbean-blue font-semibold transition-colors"
              >
                Admin
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-caribbean-blue hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 py-4">
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => { onStartOrder(); setIsMenuOpen(false); }}
                  className="px-4 py-2 text-left text-gray-700 hover:text-caribbean-blue font-semibold transition-colors"
                >
                  Start Order
                </button>
                <button 
                  onClick={() => { onTrackOrder(); setIsMenuOpen(false); }}
                  className="px-4 py-2 text-left text-gray-700 hover:text-caribbean-blue font-semibold transition-colors"
                >
                  Track Order
                </button>
                <button 
                  onClick={() => { onRefundRequest(); setIsMenuOpen(false); }}
                  className="px-4 py-2 text-left text-gray-700 hover:text-caribbean-blue font-semibold transition-colors"
                >
                  Request Refund
                </button>
                <div className="px-4 py-2">
                  <SupportContact />
                </div>
                <button 
                  onClick={() => { onTrustedServices(); setIsMenuOpen(false); }}
                  className="px-4 py-2 text-left text-gray-700 hover:text-caribbean-blue font-semibold transition-colors"
                >
                  Trusted Services
                </button>
                <button 
                  onClick={() => { onInfoAccess(); setIsMenuOpen(false); }}
                  className="px-4 py-2 text-left text-gray-700 hover:text-caribbean-blue font-semibold transition-colors"
                >
                  Information
                </button>
                <button 
                  onClick={() => { onAdminAccess(); setIsMenuOpen(false); }}
                  className="px-4 py-2 text-left text-gray-700 hover:text-caribbean-blue font-semibold transition-colors"
                >
                  Admin Access
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-gradient-to-br from-caribbean-blue/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-gradient-to-tr from-pink-300/10 to-caribbean-blue/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight animate-fade-in">
            Order from anywhere,
            <span className="text-caribbean-blue block mt-1 sm:mt-2 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>deliver right to you</span>
          </h1>
          
          {/* Styled Hero Message */}
          <div 
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: '1.15rem',
              fontWeight: '600',
              color: '#ffffff',
              textAlign: 'center',
              padding: '1.8rem 1.5rem 1.2rem 1.5rem',
              background: 'linear-gradient(135deg, #40E0D0 0%, #8A2BE2 100%)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(64, 224, 208, 0.3), 0 4px 16px rgba(138, 43, 226, 0.2)',
              maxWidth: '95%',
              margin: '0 auto 1.5rem auto',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="animate-fade-in"
          >
            {/* S-shaped curve overlay */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 30%, rgba(64, 224, 208, 0.3) 0%, transparent 30%), radial-gradient(circle at 80% 70%, rgba(138, 43, 226, 0.3) 0%, transparent 30%)',
                borderRadius: '20px',
                zIndex: 1
              }}
            />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <p style={{ margin: '0' }}>
                No credit card, no problem 😉<br />
                <span style={{ fontWeight: '400' }}>
                  Just send us the links to the items you want,<br />
                  we'll quote you & place the order for you 🫡
                </span>
              </p>
            </div>
          </div>

          <button 
            onClick={onStartOrder}
            className="btn-primary inline-block animate-scale-in w-full sm:w-auto max-w-xs sm:max-w-none"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            Start Your Order
          </button>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-10 md:p-14 border border-gray-100">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-8 text-center">
              Our Mission
            </h2>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-center font-medium text-gray-700">
              <em>At Klynt Shipment, we make international shopping easy and accessible for everyone — 
              no credit card needed. Whether you're ordering fashion, gadgets, or digital services, 
              we handle it all. Fast, reliable, and delivered right to you with ease.</em>
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="services" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-caribbean-blue to-purple-600 bg-clip-text text-transparent">
              What We Deliver
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              From fashion to tech, gaming to streaming - we handle all your international shopping needs with care and precision.
            </p>
          </div>
          
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="rounded-2xl transition-all duration-500 text-center cursor-pointer hover:-translate-y-2 hover:scale-105 group animate-fade-in overflow-hidden relative"
                onClick={onStartOrder}
                style={{ 
                  animationDelay: `${index * 0.1 + 0.2}s`, 
                  animationFillMode: 'both',
                  background: service.gradientFrom ? `linear-gradient(135deg, ${service.gradientFrom} 0%, ${service.gradientTo} 100%)` : 'rgba(255,255,255,0.03)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 16px rgba(0, 0, 0, 0.08)',
                  padding: '2.5rem 1.8rem 2rem 1.8rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.18), 0 4px 24px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 16px rgba(0, 0, 0, 0.08)';
                }}
              >
                {/* Radial gradient overlay for soft glow effect */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: service.gradientFrom ? `radial-gradient(circle at 20% 30%, ${service.gradientFrom}30 0%, transparent 30%), radial-gradient(circle at 80% 70%, ${service.gradientTo}30 0%, transparent 30%)` : 'none',
                    borderRadius: '12px',
                    zIndex: 1
                  }}
                />
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  {/* Logo or Icon Display */}
                  <div className="flex justify-center items-center mb-6 transition-transform duration-300 group-hover:scale-110">
                    {service.logo && typeof service.logo === 'string' ? (
                      <div 
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: (service as any).specialStyling ? '#000000' : service.name === 'Electronics' ? '#ffffff' : 'rgba(255,255,255,0.08)',
                          borderRadius: '16px',
                          padding: '1rem',
                          boxShadow: (service as any).specialStyling 
                            ? '0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                            : service.name === 'Electronics' 
                            ? '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.1)' 
                            : '0 6px 20px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
                          width: '84px',
                          height: '84px',
                          border: (service as any).specialStyling 
                            ? '3px solid #000000' 
                            : service.name === 'Electronics' 
                            ? '1px solid rgba(0,0,0,0.05)' 
                            : '1px solid rgba(255,255,255,0.12)',
                          backdropFilter: 'blur(8px)'
                        }}
                      >
                        <img 
                          src={service.logo} 
                          alt={`${service.name} logo`}
                          style={{ 
                            height: '42px',
                            width: 'auto',
                            maxWidth: '64px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            backgroundColor: 'transparent',
                            filter: service.name === 'Electronics' 
                              ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))' 
                              : 'brightness(1.05) drop-shadow(0 2px 6px rgba(255,255,255,0.15))'
                          }}
                        />
                      </div>
                    ) : (
                      <div 
                        className="text-5xl transition-transform duration-300"
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '80px',
                          height: '80px',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        {(service as any).icon}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3" style={{ 
                    fontFamily: '"Open Sans", sans-serif', 
                    color: service.textColor || '#ffffff',
                    letterSpacing: '0.5px',
                    textShadow: service.textColor === '#000000' ? 'none' : '0 2px 4px rgba(0,0,0,0.3)'
                  }}>{service.name}</h3>
                  <p className="text-sm mb-4 leading-relaxed" style={{ 
                    color: service.textColor ? `${service.textColor}DD` : 'rgba(255,255,255,0.9)',
                    fontWeight: '500'
                  }}>{service.description}</p>
                  
                  {service.brands && (
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {service.brands.map((brand, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 hover:scale-105"
                          style={{ 
                            color: service.textColor ? `${service.textColor}EE` : 'rgba(255,255,255,0.9)',
                            background: service.textColor === '#000000' 
                              ? 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 100%)' 
                              : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.25) 100%)',
                            backdropFilter: 'blur(15px)',
                            border: service.textColor === '#000000' ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
            <CreditCard className="w-8 h-8 text-caribbean-blue mx-auto mb-3" />
            <p className="text-lg font-semibold text-gray-800">
              Prices vary by item type and delivery location. 
              <button 
                onClick={handleWhatsAppContact}
                className="text-caribbean-blue hover:underline ml-1"
              >
                Contact us on WhatsApp for a quote.
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-cyan-400 to-yellow-400 rounded-xl shadow-md p-6 text-center border border-cyan-500">
            <div className="flex justify-center mb-3">
              <img src={nowOpenImg} alt="Now Open" className="h-16 w-auto" style={{ filter: 'brightness(1.1)' }} />
            </div>
            <p className="text-lg font-bold text-white">
              Orders are being processed normally!
            </p>
          </div>
        </div>
      </section>

      {/* Trusted Brands Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-caribbean-blue to-purple-600 bg-clip-text text-transparent">
              Shop from Trusted Brands
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-medium">
              We partner with the world's most popular retailers to bring you authentic products at competitive prices.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border border-gray-100/50">
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60px',
                borderRadius: '12px',
                padding: '0.5rem'
              }}>
                <img src={amazonLogo} alt="Amazon" style={{
                  height: '48px',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border border-gray-100/50">
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60px',
                borderRadius: '12px',
                padding: '0.5rem'
              }}>
                <img src={sheinLogo} alt="SHEIN" style={{
                  height: '48px',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border border-gray-100/50">
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60px',
                borderRadius: '12px',
                padding: '0.5rem'
              }}>
                <img src={netflixLogo} alt="Netflix" style={{
                  height: '48px',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border border-gray-100/50">
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60px',
                borderRadius: '12px',
                padding: '0.5rem'
              }}>
                <img src={playstationLogo} alt="PlayStation" style={{
                  height: '48px',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border border-gray-100/50">
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  height: '60px',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                <img src={samsungLogo} alt="Samsung" style={{
                  height: '48px',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))'
                }} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border border-gray-100/50">
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60px',
                borderRadius: '12px',
                padding: '0.5rem'
              }}>
                <img src={robloxLogo} alt="Roblox" style={{
                  height: '48px',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Clock className="w-12 h-12 text-caribbean-blue mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Opening Hours</h3>
              <div className="text-gray-600 text-sm space-y-1">
                <p>Mon-Thu: 10am - 8pm</p>
                <p>Friday: 10am - 6pm</p>
                <p>Sunday: 9am - 5pm</p>
                <p className="font-semibold text-red-600">Closed Saturday</p>
              </div>
            </div>
            <div className="text-center">
              <Truck className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable local delivery service</p>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Trusted Service</h3>
              <p className="text-gray-600">Local business you can rely on</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleWhatsAppContact}
                  className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: +1 (868) 475-0965</span>
                </button>
                <button 
                  onClick={() => window.open('tel:+18684750965', '_self')}
                  className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Phone: +1 (868) 475-0965</span>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button 
                  onClick={onStartOrder}
                  className="block hover:text-blue-400 transition-colors text-left"
                >
                  Start Order
                </button>
                <button 
                  onClick={onTrackOrder}
                  className="block hover:text-blue-400 transition-colors text-left"
                >
                  Track Order
                </button>
                <button 
                  onClick={onRefundRequest}
                  className="block hover:text-blue-400 transition-colors text-left"
                >
                  Request Refund
                </button>
                <div className="block">
                  <SupportContact />
                </div>
                <button 
                  onClick={onTrustedServices}
                  className="block hover:text-blue-400 transition-colors text-left"
                >
                  Trusted Services
                </button>
                <button 
                  onClick={onAdminAccess}
                  className="block hover:text-blue-400 transition-colors text-left"
                >
                  Admin Access
                </button>
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="space-y-2">
                <a 
                  href="https://instagram.com/klynt_shipment" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram: @klynt_shipment</span>
                </a>
                <a 
                  href="mailto:klyntshipment@gmail.com"
                  className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email: klyntshipment@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Klynt Shipment. All rights reserved. Visit us at klyntshipment.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}