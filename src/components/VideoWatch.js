import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Eye, Calendar, User } from 'lucide-react';
import { useParams } from 'react-router-dom';

const VideoWatch = () => {
  const { id: videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

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

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white'
  };

  const outlineButtonStyle = {
    ...buttonStyle,
    background: 'transparent',
    border: '2px solid #e5e7eb',
    color: '#374151'
  };

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/videos/${videoId}`);
        setVideo(res.data.video);
        if (res.data.video.likes && user) {
          setIsLiked(res.data.video.likes.includes(user._id || user.userId));
        }
        // Record view count
        if (user) {
          try {
            await axios.post(`/api/videos/${videoId}/view`);
          } catch (error) {
            console.error('Failed to record view:', error);
            // Silently fail for view recording to not interrupt video playback
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId, user]);

  const handleLike = async () => {
    if (!user || !video) return;

    try {
      const res = await axios.post(`/api/videos/${videoId}/like`);
      setVideo(res.data.video);
      setIsLiked(!isLiked);
      toast.success(isLiked ? 'Removed from likes' : 'Added to likes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to like video');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div style={cardStyle}>
              <div style={{ aspectRatio: '16/9', background: '#f3f4f6', animation: 'pulse 2s infinite' }}></div>
              <div style={{ padding: '24px' }}>
                <div style={{ height: '32px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '16px', animation: 'pulse 2s infinite' }}></div>
                <div style={{ height: '20px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 2s infinite' }}></div>
              </div>
            </div>
            <div style={cardStyle}>
              <div style={{ padding: '24px' }}>
                <div style={{ height: '24px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '16px', animation: 'pulse 2s infinite' }}></div>
                <div style={{ height: '60px', background: '#f3f4f6', borderRadius: '4px', animation: 'pulse 2s infinite' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div style={containerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={cardStyle}>
            <div style={{ padding: '48px', textAlign: 'center' }}>
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
                <Eye size={32} color="#dc2626" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Video Not Found</h2>
              <p style={{ color: '#6b7280' }}>The video you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

    const isCreator = (user?._id || user?.userId) === video.user?._id;
  const viewCount = Array.isArray(video.views) ? video.views.length : 0;
  const likeCount = Array.isArray(video.likes) ? video.likes.length : 0;

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Main Video Section */}
          <div style={cardStyle}>
            {/* Video Player */}
            <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
              <video
                controls
                src={video.url}
                poster={video.thumbnail}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Video Title */}
              <h1 style={{ 
                fontSize: '1.875rem', 
                fontWeight: 'bold', 
                color: '#1f2937', 
                marginBottom: '16px', 
                lineHeight: '1.2' 
              }}>
                {video.title}
              </h1>

              {/* Creator Info & Actions */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}>
                    {video.user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#1f2937' }}>{video.user.name || 'Unknown Creator'}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      {formatDate(video.createdAt)}
                    </p>
                  </div>
                </div>

                {!isCreator && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={handleLike}
                      style={isLiked ? primaryButtonStyle : outlineButtonStyle}
                    >
                      <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                      Like
                    </button>
                    <button style={outlineButtonStyle}>
                      <MessageCircle size={16} />
                      Comment
                    </button>
                  </div>
                )}
              </div>

              {/* Video Description */}
              <div style={{ 
                background: '#f9fafb', 
                borderRadius: '8px', 
                padding: '16px' 
              }}>
                <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Description</h3>
                <p style={{ color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {video.description || 'No description available.'}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Video Stats */}
            <div style={cardStyle}>
              <div style={{ padding: '24px' }}>
                <h3 style={{ 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  <Eye size={20} color="#2563eb" />
                  Video Stats
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '12px', 
                    background: '#dbeafe', 
                    borderRadius: '8px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Eye size={16} color="#2563eb" />
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e40af' }}>Views</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{viewCount.toLocaleString()}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '12px', 
                    background: '#fee2e2', 
                    borderRadius: '8px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heart size={16} color="#dc2626" />
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#991b1b' }}>Likes</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#dc2626' }}>{likeCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Creator Info */}
            <div style={cardStyle}>
              <div style={{ padding: '24px' }}>
                <h3 style={{ 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  <User size={20} color="#7c3aed" />
                  About Creator
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                  }}>
                    {video.user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{video.user.name || 'Unknown Creator'}</h4>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Content Creator</p>
                  </div>
                </div>
                {!isCreator && (
                  <button style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    Follow Creator
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoWatch;