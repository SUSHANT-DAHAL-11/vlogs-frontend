import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Video, Home, Compass, Upload, PlaySquare, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navbarStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 16px'
  };

  const navContentStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  };

  const logoIconStyle = {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease'
  };

  const logoTextStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const desktopNavStyle = {
    display: 'none',
    alignItems: 'center',
    gap: '4px'
  };

  const navLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  };

  const userMenuStyle = {
    display: 'none',
    alignItems: 'center',
    gap: '12px'
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.875rem',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
  };

  const ghostButtonStyle = {
    ...buttonStyle,
    background: 'transparent',
    color: '#6b7280',
    border: 'none'
  };

  const mobileMenuButtonStyle = {
    display: 'block',
    background: 'transparent',
    border: 'none',
    padding: '8px',
    color: '#6b7280',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  };

  const mobileMenuStyle = {
    display: isMobileMenuOpen ? 'block' : 'none',
    borderTop: '1px solid rgba(229, 231, 235, 0.5)',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)'
  };

  const mobileMenuContentStyle = {
    padding: '8px 8px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    minWidth: '224px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    zIndex: 50
  };

  const dropdownItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    color: '#374151',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left'
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/videos', label: 'Explore', icon: Compass },
    { to: '/upload', label: 'Upload', icon: Upload },
    { to: '/my-videos', label: 'My Videos', icon: PlaySquare },
  ];

  const isActiveLink = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Add media query styles
  const mediaQueries = `
    @media (min-width: 768px) {
      .desktop-nav { display: flex !important; }
      .user-menu { display: flex !important; }
      .mobile-menu-button { display: none !important; }
    }
  `;

  return (
    <>
      <style>{mediaQueries}</style>
      <nav style={navbarStyle}>
        <div style={containerStyle}>
          <div style={navContentStyle}>
            {/* Logo */}
            <Link 
              to="/" 
              style={logoStyle}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector('.logo-icon').style.transform = 'scale(1.05)';
                e.currentTarget.querySelector('.logo-icon').style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector('.logo-icon').style.transform = 'scale(1)';
                e.currentTarget.querySelector('.logo-icon').style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
              }}
            >
              <div className="logo-icon" style={logoIconStyle}>
                <Video size={24} color="white" />
              </div>
              <span style={logoTextStyle}>VlogApp</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="desktop-nav" style={desktopNavStyle}>
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = isActiveLink(link.to);

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    style={{
                      ...navLinkStyle,
                      background: isActive ? '#dbeafe' : 'transparent',
                      color: isActive ? '#1e40af' : '#6b7280',
                      boxShadow: isActive ? '0 2px 8px rgba(59, 130, 246, 0.15)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.color = '#1f2937';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                      }
                    }}
                  >
                    <IconComponent size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* User Menu / Auth Links */}
            <div className="user-menu" style={userMenuStyle}>
              {user ? (
                <UserDropdown 
                  user={user} 
                  handleLogout={handleLogout}
                  avatarStyle={avatarStyle}
                  dropdownStyle={dropdownStyle}
                  dropdownItemStyle={dropdownItemStyle}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link 
                    to="/login" 
                    style={{...ghostButtonStyle, color: '#6b7280'}}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#1f2937';
                      e.currentTarget.style.background = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#6b7280';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    style={primaryButtonStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button"
              style={mobileMenuButtonStyle}
              onClick={toggleMobileMenu}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.color = '#1f2937';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div style={mobileMenuStyle}>
            <div style={mobileMenuContentStyle}>
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = isActiveLink(link.to);

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      ...navLinkStyle,
                      background: isActive ? '#dbeafe' : 'transparent',
                      color: isActive ? '#1e40af' : '#6b7280'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.color = '#1f2937';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                      }
                    }}
                  >
                    <IconComponent size={20} />
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile User Section */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(229, 231, 235, 0.5)' }}>
                {user ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px' }}>
                      <div style={avatarStyle}>
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>{user.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Creator</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        ...navLinkStyle,
                        color: '#6b7280'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.color = '#1f2937';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      <User size={20} />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        ...navLinkStyle,
                        color: '#dc2626',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        ...navLinkStyle,
                        color: '#6b7280'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.color = '#1f2937';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        ...navLinkStyle,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

// User Dropdown Component
const UserDropdown = ({ user, handleLogout, avatarStyle, dropdownStyle, dropdownItemStyle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const triggerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        style={triggerStyle}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <div style={avatarStyle}>
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', maxWidth: '96px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.name}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Creator</p>
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
            onClick={() => setIsOpen(false)}
          />
          <div style={dropdownStyle}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>{user.name}</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
            </div>
            <Link
              to="/profile"
              style={dropdownItemStyle}
              onClick={() => setIsOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <User size={16} />
              Profile Settings
            </Link>
            <Link
              to="/my-videos"
              style={dropdownItemStyle}
              onClick={() => setIsOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <PlaySquare size={16} />
              My Videos
            </Link>
            <div style={{ borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                style={{
                  ...dropdownItemStyle,
                  color: '#dc2626'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;