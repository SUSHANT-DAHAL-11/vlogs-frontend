import React, { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, Video, Clock, FileVideo, CheckCircle, X, Play, Zap } from 'lucide-react';

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoType: 'short',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const fileInputRef = useRef(null);

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
    marginBottom: '24px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.5)',
    outline: 'none'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'inherit'
  };

  const buttonStyle = {
    padding: '12px 24px',
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateFile = (file) => {
    const maxSize = formData.videoType === 'short' ? 50 * 1024 * 1024 : 500 * 1024 * 1024;
    const maxSizeLabel = formData.videoType === 'short' ? '50MB' : '500MB';

    if (file.size > maxSize) {
      toast.error(`File size exceeds ${maxSizeLabel} limit`);
      return false;
    }

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return false;
    }

    return true;
  };

  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      setVideoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      toast.success('Video file selected successfully!');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a video title');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('video', videoFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);

      const endpoint = formData.videoType === 'short' ? '/api/videos/upload/short' : '/api/videos/upload/long';

      await axios.post(endpoint, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(progress);
        },
      });

      toast.success('Video uploaded successfully!');

      // Reset form
      setFormData({ title: '', description: '', videoType: 'short' });
      setVideoFile(null);
      setVideoPreview(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVideoTypeInfo = (type) => {
    return type === 'short'
      ? { icon: Zap, color: '#10b981', label: 'Short Video', limit: '≤ 45 seconds, Max 50MB' }
      : { icon: Clock, color: '#8b5cf6', label: 'Long Video', limit: 'Max 500MB' };
  };

  const videoTypeInfo = getVideoTypeInfo(formData.videoType);
  const TypeIcon = videoTypeInfo.icon;

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Upload Your Video</h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Share your creativity with the world</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Video Type Selection */}
          <div style={cardStyle}>
            <div style={{ padding: '24px 24px 16px' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Video size={20} color="#3b82f6" />
                Video Type
              </h3>
            </div>
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: formData.videoType === 'short' ? '2px solid #10b981' : '2px solid #e5e7eb',
                    background: formData.videoType === 'short' ? '#ecfdf5' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setFormData({ ...formData, videoType: 'short' })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#10b981',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Zap size={20} color="white" />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>Short Video</h4>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>≤ 45 seconds, Max 50MB</p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: formData.videoType === 'long' ? '2px solid #8b5cf6' : '2px solid #e5e7eb',
                    background: formData.videoType === 'long' ? '#f3e8ff' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setFormData({ ...formData, videoType: 'long' })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#8b5cf6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Clock size={20} color="white" />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>Long Video</h4>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Any duration, Max 500MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div style={cardStyle}>
            <div style={{ padding: '24px 24px 16px' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Upload size={20} color="#3b82f6" />
                Upload Video File
              </h3>
            </div>
            <div style={{ padding: '0 24px 24px' }}>
              {!videoFile ? (
                <div
                  style={{
                    border: dragActive ? '2px dashed #3b82f6' : '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '32px',
                    textAlign: 'center',
                    background: dragActive ? '#eff6ff' : '#f9fafb',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 16px',
                    background: '#dbeafe',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Upload size={32} color="#3b82f6" />
                  </div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                    Drop your video here, or click to browse
                  </h4>
                  <p style={{ color: '#6b7280', marginBottom: '16px' }}>Supports MP4, MOV, AVI and other video formats</p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: videoTypeInfo.color,
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    marginBottom: '16px'
                  }}>
                    <TypeIcon size={12} />
                    {videoTypeInfo.label}: {videoTypeInfo.limit}
                  </div>
                  <div>
                    <button
                      type="button"
                      style={{
                        background: 'white',
                        border: '2px solid #e5e7eb',
                        color: '#374151',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        margin: '0 auto'
                      }}
                    >
                      <FileVideo size={16} />
                      Choose File
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div>
                  {/* File Info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: '#ecfdf5',
                    borderRadius: '8px',
                    border: '1px solid #d1fae5',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#10b981',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckCircle size={20} color="white" />
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', color: '#1f2937' }}>{videoFile.name}</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{formatFileSize(videoFile.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Video Preview */}
                  {videoPreview && (
                    <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                      <video src={videoPreview} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} preload="metadata">
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Video Details */}
          <div style={cardStyle}>
            <div style={{ padding: '24px 24px 16px' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FileVideo size={20} color="#3b82f6" />
                Video Details
              </h3>
            </div>
            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Title *
                </label>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Enter an engaging title for your video"
                  style={inputStyle}
                />
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>{formData.title.length}/100 characters</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={500}
                  placeholder="Describe your video (optional)"
                  style={textareaStyle}
                />
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>{formData.description.length}/500 characters</p>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {loading && (
            <div style={cardStyle}>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulse 2s infinite'
                  }}>
                    <Upload size={16} color="white" />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#1f2937' }}>Uploading your video...</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{uploadProgress}% complete</p>
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#f3f4f6',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              disabled={loading || !videoFile}
              style={{
                ...primaryButtonStyle,
                fontSize: '1.125rem',
                padding: '16px 32px',
                opacity: (loading || !videoFile) ? 0.5 : 1,
                cursor: (loading || !videoFile) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Uploading... {uploadProgress}%
                </>
              ) : (
                <>
                  <Play size={20} />
                  Upload Video
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;