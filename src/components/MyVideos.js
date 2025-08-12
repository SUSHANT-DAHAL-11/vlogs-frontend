import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from './VideoCard';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Video, Search, Eye, Heart, Filter, Grid3X3, List, Plus, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyVideos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: '16px'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
  };

  const outlineButtonStyle = {
    ...buttonStyle,
    background: 'rgba(255, 255, 255, 0.8)',
    color: '#374151',
    border: '1px solid #e5e7eb',
    backdropFilter: 'blur(10px)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 40px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    outline: 'none'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    minWidth: '200px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    zIndex: 50,
    overflow: 'hidden'
  };

  const dropdownItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left'
  };

  useEffect(() => {
    if (!user || !user.token) {
      setLoading(false);
      return;
    }

    const fetchMyVideos = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/videos/my-videos', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error('Error fetching my videos:', error);
        toast.error(error.response?.data?.message || 'Failed to load your videos');
      } finally {
        setLoading(false);
      }
    };

    fetchMyVideos();
  }, [user]);

  useEffect(() => {
    let filtered = [...videos];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterBy !== 'all') {
      filtered = filtered.filter((video) => video.videoType === filterBy);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views?.length || 0) - (a.views?.length || 0));
        break;
      case 'liked':
        filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        break;
      default:
        break;
    }

    setFilteredVideos(filtered);
  }, [videos, searchTerm, sortBy, filterBy]);

  // Calculate stats using backend-provided counts, excluding creator's own views
  const totalViews = videos.reduce((sum, video) => {
    // Exclude creator's own view from count if present
    const viewsCount = video.views ? video.views.filter(viewerId => viewerId.toString() !== video.user._id.toString()).length : 0;
    return sum + viewsCount;
  }, 0);

  const totalLikes = videos.reduce((sum, video) => sum + (video.likeCount || 0), 0);
  const shortVideos = videos.filter((v) => v.videoType === 'short').length;
  const longVideos = videos.filter((v) => v.videoType === 'long').length;

  // Use backend-provided stats
  const stats = [
    { label: 'Total Videos', value: videos.length, icon: Video, color: '#3b82f6' },
    { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: '#10b981' },
    { label: 'Total Likes', value: totalLikes.toLocaleString(), icon: Heart, color: '#ef4444' },
  ];

  const sortOptions = [
    { key: 'newest', label: 'Newest First' },
    { key: 'oldest', label: 'Oldest First' },
    { key: 'popular', label: 'Most Viewed' },
    { key: 'liked', label: 'Most Liked' },
  ];

  const filterOptions = [
    { key: 'all', label: 'All Videos', count: videos.length },
    { key: 'short', label: 'Short Videos', count: shortVideos },
    { key: 'long', label: 'Long Videos', count: longVideos },
  ];

  const LoadingSkeleton = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {Array.from({ length: 3 }).map((_, index) => (  // updated length to 3 to match stats
          <div key={index} style={cardStyle}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ height: '16px', width: '80px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 2s infinite' }} />
                  <div style={{ height: '32px', width: '64px', background: '#f3f4f6', borderRadius: '4px', animation: 'pulse 2s infinite' }} />
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f3f4f6', animation: 'pulse 2s infinite' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Videos Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} style={cardStyle}>
            <div style={{ aspectRatio: '16/9', background: '#f3f4f6', animation: 'pulse 2s infinite' }} />
            <div style={{ padding: '16px' }}>
              <div style={{ height: '16px', width: '75%', background: '#f3f4f6', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 2s infinite' }} />
              <div style={{ height: '12px', width: '100%', background: '#f3f4f6', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 2s infinite' }} />
              <div style={{ height: '12px', width: '60%', background: '#f3f4f6', borderRadius: '4px', animation: 'pulse 2s infinite' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ height: '40px', width: '192px', background: '#f3f4f6', borderRadius: '8px', marginBottom: '8px', animation: 'pulse 2s infinite' }} />
            <div style={{ height: '24px', width: '384px', background: '#f3f4f6', borderRadius: '8px', animation: 'pulse 2s infinite' }} />
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={containerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ ...cardStyle, maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                background: '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Video size={32} color="#dc2626" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Authentication Required</h3>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>Please log in to view your videos.</p>
              <Link to="/login" style={primaryButtonStyle}>
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>My Videos</h1>
                <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Manage and track your video content</p>
              </div>
              <Link
                to="/upload"
                style={primaryButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Plus size={16} />
                Upload New Video
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} style={cardStyle}>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>{stat.label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{stat.value}</p>
                    </div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color
                    }}>
                      <IconComponent size={24} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {videos.length === 0 ? (
          /* Empty State */
          <div style={cardStyle}>
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                background: '#f3f4f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Video size={32} color="#9ca3af" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>No videos uploaded yet</h3>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>Start by uploading your first video.</p>
              <Link to="/upload" style={primaryButtonStyle}>
                Upload Video
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Search and Filter Bar */}
            <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {/* Filter Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    style={outlineButtonStyle}
                    onClick={() => {
                      setShowFilterDropdown(!showFilterDropdown);
                      setShowSortDropdown(false);
                    }}
                  >
                    <Filter size={16} />
                    {filterOptions.find((f) => f.key === filterBy)?.label}
                  </button>

                  {showFilterDropdown && (
                    <>
                      <div
                        style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                        onClick={() => setShowFilterDropdown(false)}
                      />
                      <div style={dropdownStyle}>
                        {filterOptions.map((option) => (
                          <button
                            key={option.key}
                            onClick={() => {
                              setFilterBy(option.key);
                              setShowFilterDropdown(false);
                            }}
                            style={{
                              ...dropdownItemStyle,
                              background: filterBy === option.key ? '#eff6ff' : 'transparent',
                              color: filterBy === option.key ? '#1e40af' : '#374151',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                            onMouseEnter={(e) => {
                              if (filterBy !== option.key) {
                                e.currentTarget.style.background = '#f3f4f6';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (filterBy !== option.key) {
                                e.currentTarget.style.background = 'transparent';
                              }
                            }}
                          >
                            <span>{option.label}</span>
                            <span style={{ fontWeight: '600', color: '#6b7280' }}>{option.count}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    style={outlineButtonStyle}
                    onClick={() => {
                      setShowSortDropdown(!showSortDropdown);
                      setShowFilterDropdown(false);
                    }}
                  >
                    <BarChart3 size={16} />
                    Sort: {sortOptions.find((s) => s.key === sortBy)?.label}
                  </button>

                  {showSortDropdown && (
                    <>
                      <div
                        style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                        onClick={() => setShowSortDropdown(false)}
                      />
                      <div style={dropdownStyle}>
                        {sortOptions.map((option) => (
                          <button
                            key={option.key}
                            onClick={() => {
                              setSortBy(option.key);
                              setShowSortDropdown(false);
                            }}
                            style={{
                              ...dropdownItemStyle,
                              background: sortBy === option.key ? '#eff6ff' : 'transparent',
                              color: sortBy === option.key ? '#1e40af' : '#374151'
                            }}
                            onMouseEnter={(e) => {
                              if (sortBy !== option.key) {
                                e.currentTarget.style.background = '#f3f4f6';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (sortBy !== option.key) {
                                e.currentTarget.style.background = 'transparent';
                              }
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', padding: '4px', border: '1px solid #e5e7eb' }}>
                  <button
                    style={{
                      ...buttonStyle,
                      padding: '8px',
                      background: viewMode === 'grid' ? '#667eea' : 'transparent',
                      color: viewMode === 'grid' ? 'white' : '#6b7280',
                      fontSize: '0'
                    }}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    style={{
                      ...buttonStyle,
                      padding: '8px',
                      background: viewMode === 'list' ? '#667eea' : 'transparent',
                      color: viewMode === 'list' ? 'white' : '#6b7280',
                      fontSize: '0'
                    }}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: '#6b7280' }}>
                {searchTerm ? (
                  <>
                    Found <span style={{ fontWeight: '600', color: '#1f2937' }}>{filteredVideos.length}</span> videos
                    {searchTerm && (
                      <>
                        {' '}for "<span style={{ fontWeight: '600', color: '#3b82f6' }}>{searchTerm}</span>"
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Showing <span style={{ fontWeight: '600', color: '#1f2937' }}>{filteredVideos.length}</span> of{' '}
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>{videos.length}</span> videos
                  </>
                )}
              </p>
            </div>

            {/* Videos Grid */}
            {filteredVideos.length === 0 ? (
              <div style={cardStyle}>
                <div style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 16px',
                    background: '#f3f4f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Search size={32} color="#9ca3af" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>No videos found</h3>
                  <p style={{ color: '#6b7280', marginBottom: '16px' }}>Try adjusting your search terms or filters.</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    style={outlineButtonStyle}
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' 
                  ? 'repeat(auto-fill, minmax(300px, 1fr))' 
                  : '1fr',
                gap: '24px',
                maxWidth: viewMode === 'list' ? '800px' : 'none',
                margin: viewMode === 'list' ? '0 auto' : '0'
              }}>
                {filteredVideos.map((video) => (
                  <VideoCard key={video._id} video={video} viewMode={viewMode} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyVideos;
