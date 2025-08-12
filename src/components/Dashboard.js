import React from 'react';
import { Video, Play, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const heroStyle = {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ec4899 100%)',
    color: 'white',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 16px',
    textAlign: 'center',
  };

  const heroOverlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.2)',
  };

  const primaryButtonStyle = {
    padding: '16px 32px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '1.125rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    background: 'white',
    color: '#1f2937',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  };

  const outlineButtonStyle = {
    padding: '16px 32px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '1.125rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div style={heroStyle}>
      <div style={heroOverlayStyle} />
      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1.1' }}>
          Welcome to{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            VlogApp
          </span>
        </h1>
        <p style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', marginBottom: '32px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>
          Discover amazing videos from creators around the world. Share your story, connect with your audience, and build your community.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {user ? (
            <>
              <Link to="/upload" style={primaryButtonStyle}>
                <Upload size={20} />
                Upload Your Video
              </Link>
              <Link to="/videos" style={outlineButtonStyle}>
                <Play size={20} />
                Explore Videos
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" style={primaryButtonStyle}>
                <Video size={20} />
                Get Started Free
              </Link>
              <Link to="/videos" style={outlineButtonStyle}>
                <Play size={20} />
                Watch Videos
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
