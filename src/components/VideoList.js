import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from './VideoCard';
import { Search, Clock, Zap } from 'lucide-react';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: '16px'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflow: 'hidden'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 40px',
    fontSize: '1.125rem',
    border: 'none',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '24px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const params = filter !== 'all' ? { type: filter } : {};
        const response = await axios.get('/api/videos', { params });
        setVideos(response.data.videos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [filter]);

  useEffect(() => {
    const filtered = videos.filter(
      (video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(filtered);
  }, [videos, searchTerm]);

  const filterOptions = [
    { value: 'all', label: 'All Videos', icon: Search, color: '#3b82f6' },
    { value: 'short', label: 'Short Videos', icon: Zap, color: '#10b981' },
    { value: 'long', label: 'Long Videos', icon: Clock, color: '#8b5cf6' },
  ];

  const LoadingSkeleton = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} style={cardStyle}>
          <div style={{ aspectRatio: '16/9', background: '#f3f4f6', animation: 'pulse 2s infinite' }}></div>
          <div style={{ padding: '16px' }}>
            <div style={{ height: '16px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 2s infinite' }}></div>
            <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 2s infinite' }}></div>
            <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '4px', width: '60%', animation: 'pulse 2s infinite' }}></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Explore Videos</h1>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Discover amazing content from creators around the world</p>
          </div>

          {/* Search Bar */}
          <div style={{ maxWidth: '512px', margin: '0 auto 24px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
              <input
                type="text"
                placeholder="Search videos, creators, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            {filterOptions.map((option) => {
              const IconComponent = option.icon;
              const isActive = filter === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  style={{
                    ...buttonStyle,
                    background: isActive 
                      ? option.color 
                      : 'rgba(255, 255, 255, 0.8)',
                    color: isActive ? 'white' : '#374151',
                    boxShadow: isActive 
                      ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
                      : '0 4px 16px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <IconComponent size={16} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
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
                  Showing <span style={{ fontWeight: '600', color: '#1f2937' }}>{filteredVideos.length}</span> videos
                </>
              )}
            </p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredVideos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ ...cardStyle, maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ padding: '32px' }}>
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  {searchTerm ? 'No videos found' : 'No videos available'}
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                  {searchTerm
                    ? 'Try adjusting your search terms or browse all videos.'
                    : 'Check back later for new content!'}
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    style={{
                      background: 'transparent',
                      border: '2px solid #e5e7eb',
                      color: '#374151',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {filteredVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoList;