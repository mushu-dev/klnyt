import { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export function AdminLoginPage({ onLoginSuccess, onBack }: AdminLoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const handleKeyPress = (e: KeyboardEvent) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keyup', handleKeyPress);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedUsername = username.trim().toUpperCase();
    const trimmedPassword = password.trim().toUpperCase();

    if (trimmedUsername === 'KLYNTJETTA' && trimmedPassword === 'KLYNTJETTA') {
      onLoginSuccess();
    } else {
      alert('Incorrect username or password.');
    }
  };

  return (
    <div 
      style={{
        fontFamily: '"Open Sans", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0f172a',
        color: 'white',
        position: 'relative'
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          color: 'white',
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        ← Back to Home
      </button>

      <h1 style={{ 
        fontSize: '2rem', 
        marginBottom: '1rem',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        fontWeight: 'bold',
        letterSpacing: '2px'
      }}>Admin Access</h1>
      <p style={{ 
        marginBottom: '2rem',
        color: 'white',
        fontSize: '1.1rem',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
      }}>Enter the admin username and password to continue.</p>
      
      <form 
        onSubmit={handleSubmit} 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="USERNAME" 
          style={{
            padding: '0.8rem 1rem',
            fontSize: '1rem',
            borderRadius: '6px',
            border: '2px dotted #333',
            marginBottom: '1rem',
            width: '250px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            color: '#000',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}
          required
        />
        
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <input 
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD" 
            style={{
              padding: '0.8rem 1rem',
              paddingRight: capsLockOn ? '4.5rem' : '2.5rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '2px dotted #333',
              width: '250px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              color: '#000',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}
            required
          />
          {capsLockOn && (
            <div
              style={{
                position: 'absolute',
                right: '40px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#ff6b6b',
                padding: '4px'
              }}
              title="Caps Lock is on"
            >
              <AlertTriangle size={16} />
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              padding: '4px'
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        
        <button 
          type="submit" 
          style={{
            backgroundColor: '#00CFC1',
            color: '#000',
            padding: '0.8rem 1.5rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#00B5A5';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#00CFC1';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}