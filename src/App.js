import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import VideoList from './components/VideoList';
import VideoWatch from './components/VideoWatch';
import UploadVideo from './components/UploadVideo';
import MyVideos from './components/MyVideos';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/videos" element={<VideoList />} />
              <Route path="/video/:id" element={<VideoWatch />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <UploadVideo />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-videos" 
                element={
                  <ProtectedRoute>
                    <MyVideos />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
                padding: '16px',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

const NotFound = () => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>404</h1>
      <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '32px' }}>Page not found</p>
      <a 
        href="/" 
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'all 0.3s ease'
        }}
      >
        Go Home
      </a>
    </div>
  </div>
);

export default App;