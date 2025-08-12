import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, Clock, Play } from 'lucide-react';

const VideoCard = ({ video }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
    cursor: 'pointer'
  };

  const thumbnailContainerStyle = {
    position: 'relative',
    aspectRatio: '16/9',
    background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
    overflow: 'hidden'
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.2)',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };

  const badgeStyle = {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    fontSize: '0.75rem',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const playButtonStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const formatCount = (count) => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  const likesCount = Array.isArray(video.likes) ? video.likes.length : 0;
  const viewsCount = Array.isArray(video.views) ? video.views.length : 0;

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'short':
        return '#10b981';
      case 'long':
        return '#8b5cf6';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Thumbnail */}
      <div style={thumbnailContainerStyle}>
        {!imageError && video.thumbnail ? (
          <img
            src={video.thumbnail || '/placeholder.svg'}
            alt={video.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Play size={48} color="rgba(255, 255, 255, 0.6)" />
          </div>
        )}

        {/* Overlay */}
        <div style={overlayStyle} />

        {/* Duration Badge */}
        <div style={{ ...badgeStyle, bottom: '8px', right: '8px' }}>
          <Clock size={12} />
          {formatDuration(video.duration)}
        </div>

        {/* Video Type Badge */}
        <div style={{ 
          ...badgeStyle, 
          top: '8px', 
          left: '8px',
          background: getTypeColor(video.videoType)
        }}>
          {video.videoType || 'Video'}
        </div>

        {/* Play Button Overlay */}
        <div style={playButtonStyle}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.2s ease'
          }}>
            <Play size={24} color="#1f2937" style={{ marginLeft: '4px' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Video Title */}
        <h3 style={{
          fontWeight: '600',
          color: isHovered ? '#3b82f6' : '#1f2937',
          marginBottom: '8px',
          fontSize: '1rem',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          transition: 'color 0.2s ease'
        }}>
          {video.title}
        </h3>

        {/* Video Description */}
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginBottom: '12px',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {video.description}
        </p>

        {/* Creator Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {video.user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {video.user?.name || 'Unknown'}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {formatDate(video.createdAt)}
            </p>
          </div>
        </div>

        {/* Video Stats */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          fontSize: '0.75rem',
          color: '#6b7280'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={12} />
              {formatCount(viewsCount)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Heart size={12} />
              {formatCount(likesCount)}
            </span>
          </div>
        </div>

        {/* Watch Button */}
        <Link to={`/video/${video._id}`} style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
          }}>
            <Play size={16} />
            Watch Video
          </button>
        </Link>
      </div>
    </div>
  );
};

export default VideoCard;