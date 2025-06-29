import { ArrowLeft } from 'lucide-react';

// Import brand logos
import robloxLogo from '../../assets/images/brands/roblox-logo.jpeg';
import netflixLogo from '../../assets/images/brands/netflix-logo.jpeg';
import playstationLogo from '../../assets/images/brands/playstation-logo.jpeg';
import sheinLogo from '../../assets/images/brands/shein-logo.jpeg';
import amazonLogo from '../../assets/images/brands/amazon-logo.jpeg';
import samsungLogo from '../../assets/images/brands/samsung-logo.jpeg';

interface TrustedServicesPageProps {
  onBack: () => void;
}

export function TrustedServicesPage({ onBack }: TrustedServicesPageProps) {
  return (
    <div 
      style={{
        padding: '2rem',
        fontFamily: '"Open Sans", sans-serif',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #7B2CBF 0%, #00CFC1 100%)',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          display: 'flex',
          alignItems: 'center',
          color: '#ffffff',
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
        Back to Home
      </button>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          Trusted Services
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          maxWidth: '700px', 
          margin: '0 auto 2rem',
          lineHeight: '1.6'
        }}>
          We're proud to serve a growing community of satisfied customers who trust Klynt Shipment 
          to deliver fashion, gadgets, and services from around the world — directly to their doorsteps.
        </p>
        
        {/* Brand Partners Section */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '2rem',
          margin: '2rem 0',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Trusted Retail Partners
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80px'
            }}>
              <img src={amazonLogo} alt="Amazon" style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80px'
            }}>
              <img src={sheinLogo} alt="SHEIN" style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80px'
            }}>
              <img src={netflixLogo} alt="Netflix" style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80px'
            }}>
              <img src={playstationLogo} alt="PlayStation" style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80px'
            }}>
              <img src={samsungLogo} alt="Samsung" style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80px'
            }}>
              <img src={robloxLogo} alt="Roblox" style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
          </div>
          
          <p style={{ fontSize: '1rem', opacity: '0.9', marginBottom: '0' }}>
            And many more! We can order from virtually any international retailer.
          </p>
        </div>
        
        <a 
          href="https://www.instagram.com/clean.shipment/" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
            display: 'inline-block',
            backgroundColor: '#ffffff',
            color: '#7B2CBF',
            padding: '0.8rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
            fontSize: '1.1rem',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
          }}
        >
          View Customer Gallery on Instagram →
        </a>
      </div>
    </div>
  );
}