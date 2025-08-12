import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  const loadingStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  if (loading) {
    return (
      <div style={loadingStyle} role="status" aria-live="polite">
        <div style={cardStyle}>
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 16px',
                background: '#f3f4f6',
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
              }}
            />
            <div
              style={{
                height: '24px',
                width: '128px',
                background: '#f3f4f6',
                borderRadius: '4px',
                margin: '0 auto 8px',
                animation: 'pulse 2s infinite',
              }}
            />
            <div
              style={{
                height: '16px',
                width: '192px',
                background: '#f3f4f6',
                borderRadius: '4px',
                margin: '0 auto',
                animation: 'pulse 2s infinite',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
