import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit3, Film, Check, RotateCcw, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import {
  getGalleryItems,
  saveGalleryItem,
  deleteGalleryItem,
  resetGalleryToDefaults,
  GALLERY_CATEGORIES
} from '../services/galleryService';
import { supabase } from '../supabaseClient';
import styles from '../styles/AdminGallery.module.css';
import Uploader from '../components/Uploader';

// Constants for Supabase Storage construction
const SUPABASE_PROJECT_ID = 'cccevikzhxeyxsjvomzg';
const SUPABASE_STORAGE_BASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public`;

/**
 * Ensures any path or filename is returned as a complete Supabase Public Storage URL.
 */
const formatStorageUrl = (url, bucket = 'CBSI') => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanPath = url.replace(/^\/+/, '');
  if (cleanPath.startsWith(`${bucket}/`)) {
    return `${SUPABASE_STORAGE_BASE_URL}/${cleanPath}`;
  }
  return `${SUPABASE_STORAGE_BASE_URL}/${bucket}/${cleanPath}`;
};

/**
 * Extracts relative storage path from a full Supabase URL for file deletion.
 * Handles URL query parameters cleanly.
 */
const getStorageFilePath = (fullUrl, bucket = 'CBSI') => {
  if (!fullUrl) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  if (fullUrl.includes(marker)) {
    const rawPath = fullUrl.split(marker)[1];
    return rawPath ? rawPath.split('?')[0] : null;
  }
  return null;
};

/**
 * Captures a single frame from a video URL and returns a File object for upload.
 */
const captureVideoThumbnail = (videoUrl, fileName = 'thumbnail.jpg') => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      video.removeAttribute('src');
      video.load();
    };

    video.addEventListener('loadeddata', () => {
      video.currentTime = Math.min(1.0, video.duration ? video.duration / 2 : 0);
    });

    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          reject(new Error('Failed to get 2D canvas context.'));
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          cleanup();
          if (!blob) {
            reject(new Error('Failed to render video thumbnail to blob.'));
            return;
          }
          const file = new File([blob], fileName, { type: 'image/jpeg' });
          resolve(file);
        }, 'image/jpeg', 0.85);
      } catch (err) {
        cleanup();
        reject(err);
      }
    });

    video.addEventListener('error', () => {
      cleanup();
      reject(new Error('Error loading video file for frame extraction. (Check CORS settings)'));
    });
  });
};

const INITIAL_FORM_STATE = {
  title: '',
  type: 'image',
  category: 'Wildlife',
  mediaUrl: '',
  posterUrl: '',
  location: '',
  description: '',
  tags: '',
  featured: false,
  author: 'CBSI Safari Lead'
};

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState('All');
  const [toast, setToast] = useState('');
  const [isGeneratingThumb, setIsGeneratingThumb] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Normalize data coming from Supabase into full public URLs
  const normalizeItem = useCallback((item) => {
    const rawMedia = item.mediaUrl || item.media_url || item.image_url || '';
    const rawPoster = item.posterUrl || item.poster_url || (item.type === 'image' ? rawMedia : '');

    const media = formatStorageUrl(rawMedia);
    const poster = formatStorageUrl(rawPoster);

    return {
      id: item.id,
      title: item.title || 'Untitled Asset',
      type: item.type || 'image',
      category: item.category || 'Wildlife',
      mediaUrl: media,
      posterUrl: poster,
      location: item.location || '',
      description: item.description || '',
      tags: item.tags || [],
      featured: Boolean(item.featured),
      author: item.author || 'CBSI Safari Lead'
    };
  }, []);

  const showToastMsg = useCallback((msg) => {
    setToast(msg);
    const timer = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(timer);
  }, []);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getGalleryItems();
      const rawList = Array.isArray(data) ? data : [];
      setItems(rawList.map(normalizeItem));
    } catch (err) {
      console.error('Error fetching gallery items:', err);
      showToastMsg('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  }, [normalizeItem, showToastMsg]);

  useEffect(() => {
    loadItems();

    const handleGalleryUpdate = (event) => {
      if (event?.detail && Array.isArray(event.detail)) {
        setItems(event.detail.map(normalizeItem));
      } else {
        loadItems();
      }
    };

    window.addEventListener('cbs-gallery-updated', handleGalleryUpdate);
    return () => {
      window.removeEventListener('cbs-gallery-updated', handleGalleryUpdate);
    };
  }, [loadItems, normalizeItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetFormState = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
    setShowForm(false);
    setIsGeneratingThumb(false);
  };

  const handleToggleForm = () => {
    if (!showForm) {
      setEditingId(null);
      setFormData(INITIAL_FORM_STATE);
      setShowForm(true);
    } else {
      resetFormState();
    }
  };

  const handleMainUploadSuccess = async (fileInfo) => {
    const rawUrl = fileInfo?.url || fileInfo;
    const fullUrl = formatStorageUrl(rawUrl);

    setFormData(prev => ({
      ...prev,
      mediaUrl: fullUrl,
      title: prev.title || fileInfo?.name?.split('.')[0]?.replace(/[-_]/g, ' ') || ''
    }));

    showToastMsg('Media file successfully uploaded!');

    // Automatically extract and upload a poster thumbnail if media is a video
    if (formData.type === 'video') {
      try {
        setIsGeneratingThumb(true);
        showToastMsg('Generating video thumbnail frame...');

        const thumbFile = await captureVideoThumbnail(fullUrl, `thumb_${Date.now()}.jpg`);
        const filePath = `Media/thumbnails/${thumbFile.name}`;

        const { data, error } = await supabase.storage
          .from('CBSI')
          .upload(filePath, thumbFile, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (error) throw error;

        const generatedPosterUrl = formatStorageUrl(data.path);
        setFormData(prev => ({ ...prev, posterUrl: generatedPosterUrl }));
        showToastMsg('Video thumbnail generated & saved!');
      } catch (err) {
        console.error('Auto-thumbnail generation error:', err);
        showToastMsg('Auto-thumbnail creation failed. You can upload one manually below.');
      } finally {
        setIsGeneratingThumb(false);
      }
    }
  };

  const handlePosterUploadSuccess = (fileInfo) => {
    const rawUrl = fileInfo?.url || fileInfo;
    const fullUrl = formatStorageUrl(rawUrl);

    setFormData(prev => ({ ...prev, posterUrl: fullUrl }));
    showToastMsg('Custom thumbnail updated!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToastMsg('Please provide a title!');
      return;
    }

    if (!formData.mediaUrl.trim()) {
      showToastMsg('Please upload a media file first!');
      return;
    }

    const processedTags = typeof formData.tags === 'string'
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : (Array.isArray(formData.tags) ? formData.tags : []);

    const payload = {
      ...formData,
      mediaUrl: formatStorageUrl(formData.mediaUrl),
      posterUrl: formatStorageUrl(formData.posterUrl),
      tags: processedTags
    };

    if (editingId) {
      payload.id = editingId;
    }

    try {
      await saveGalleryItem(payload);
      showToastMsg(editingId ? 'Item updated successfully!' : 'Published to Gallery!');
      resetFormState();
      await loadItems();
    } catch (err) {
      console.error('Submit error details:', err);
      showToastMsg(`Save Failed: ${err?.message || 'Check database permissions'}`);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      ...item,
      mediaUrl: formatStorageUrl(item.mediaUrl),
      posterUrl: formatStorageUrl(item.posterUrl),
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '')
    });
    setShowForm(true);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;

    const itemToDelete = items.find(item => item.id === id);

    // Optimistic UI update
    setItems(prevItems => prevItems.filter(item => item.id !== id));

    try {
      await deleteGalleryItem(id);

      if (itemToDelete && supabase) {
        const filesToRemove = [];
        const mediaFilePath = getStorageFilePath(itemToDelete.mediaUrl);
        const posterFilePath = getStorageFilePath(itemToDelete.posterUrl);

        if (mediaFilePath) filesToRemove.push(mediaFilePath);
        if (posterFilePath && posterFilePath !== mediaFilePath) filesToRemove.push(posterFilePath);

        if (filesToRemove.length > 0) {
          await supabase.storage.from('CBSI').remove(filesToRemove);
        }
      }

      showToastMsg('Item removed successfully.');
    } catch (err) {
      console.error('Delete error:', err);
      showToastMsg(`Delete Failed: ${err?.message}`);
      await loadItems();
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset gallery to default sample items?')) {
      try {
        await resetGalleryToDefaults();
        showToastMsg('Reset to defaults complete.');
        await loadItems();
      } catch (err) {
        console.error('Reset error:', err);
        showToastMsg(`Reset Failed: ${err?.message}`);
      }
    }
  };

  const filteredTableItems = items.filter(item => {
    const matchCat = tableCategory === 'All' || item.category === tableCategory;
    const q = tableSearch.toLowerCase();
    const titleMatch = item.title ? item.title.toLowerCase().includes(q) : false;
    const locationMatch = item.location ? item.location.toLowerCase().includes(q) : false;
    return matchCat && (titleMatch || locationMatch);
  });

  return (
    <div className={styles.adminGalleryShell}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <div className={styles.headerTitleArea}>
            <h1>Gallery Manager</h1>
            <p>Cloud-synced storage for high-definition safari media.</p>
          </div>

          <div className={styles.headerActions}>
            <button type="button" className={styles.btnPrimary} onClick={handleToggleForm}>
              <Plus size={18} />
              <span>{showForm ? 'Close Form' : 'Post New Media'}</span>
            </button>
            <button type="button" className={styles.btnSecondary} onClick={handleResetDefaults}>
              <RotateCcw size={16} /> Reset Samples
            </button>
          </div>
        </header>

        {showForm && (
          <section className={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                {/* Title */}
                <div className={styles.formGroup}>
                  <label htmlFor="title">Title *</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Maasai Mara Lion Pride"
                  />
                </div>

                {/* Format Selector */}
                <div className={styles.formGroup}>
                  <label htmlFor="type">Media Format</label>
                  <select id="type" name="type" value={formData.type} onChange={handleChange}>
                    <option value="image">📷 Photograph</option>
                    <option value="video">🎬 4K Video</option>
                  </select>
                </div>

                {/* Main Media Upload */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Upload {formData.type === 'video' ? 'Video (MP4)' : 'Image'}</label>
                  <Uploader
                    bucket="CBSI"
                    folder="Media"
                    allowedTypes={
                      formData.type === 'video'
                        ? ['video/mp4', 'video/quicktime', 'video/webm']
                        : ['image/jpeg', 'image/png', 'image/webp']
                    }
                    maxSizeMB={formData.type === 'video' ? 50 : 10}
                    label={`Select ${formData.type} to upload to Cloud`}
                    onUploadSuccess={handleMainUploadSuccess}
                  />
                  {formData.mediaUrl && (
                    <p className={styles.uploadSuccessLink}>
                      ✅ Linked Media: {formData.mediaUrl.split('/').pop()}
                    </p>
                  )}
                </div>

                {/* Poster / Thumbnail Section (For Videos) */}
                {formData.type === 'video' && (
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>
                      Video Thumbnail
                      {isGeneratingThumb && (
                        <span style={{ marginLeft: 8, fontSize: '0.85rem', color: '#666' }}>
                          <Loader2 size={12} className={styles.spin} /> Generating...
                        </span>
                      )}
                    </label>

                    {/* Preview Thumbnail */}
                    {formData.posterUrl && (
                      <div style={{ marginBottom: 10 }}>
                        <img
                          src={formData.posterUrl}
                          alt="Poster Preview"
                          style={{ height: 80, borderRadius: 6, objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <Uploader
                      bucket="CBSI"
                      folder="Media/thumbnails"
                      allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                      maxSizeMB={5}
                      label={formData.posterUrl ? "Upload replacement thumbnail" : "Upload custom thumbnail"}
                      onUploadSuccess={handlePosterUploadSuccess}
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="category">Category</label>
                  <select id="category" name="category" value={formData.category} onChange={handleChange}>
                    {GALLERY_CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Amboseli National Park"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="tags">Tags (comma separated)</label>
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="wildlife, big5, safari"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="author">Author / Credit</label>
                  <input
                    id="author"
                    name="author"
                    type="text"
                    value={formData.author}
                    onChange={handleChange}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed description of the shot or experience..."
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn} disabled={isGeneratingThumb}>
                  <Check size={18} />
                  <span>{editingId ? 'Update Item' : 'Publish to Supabase'}</span>
                </button>
                <button type="button" className={styles.btnSecondary} onClick={resetFormState}>
                  <X size={18} />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Media Table */}
        <section className={styles.tableCard}>
          <div className={styles.tableToolbar}>
            <h2>Published Assets ({filteredTableItems.length})</h2>
            <div className={styles.tableFilters}>
              <select
                aria-label="Filter assets by category"
                value={tableCategory}
                onChange={(e) => setTableCategory(e.target.value)}
                className={styles.tableSearchInput}
              >
                {GALLERY_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search by title or location..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className={styles.tableSearchInput}
              />
            </div>
          </div>

          <div className={styles.tableResponsive}>
            {loading ? (
              <p style={{ padding: '2rem', textAlign: 'center' }}>Loading gallery assets...</p>
            ) : filteredTableItems.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center' }}>No assets found matching criteria.</p>
            ) : (
              <table className={styles.mediaTable}>
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Format</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTableItems.map((item) => {
                    const previewUrl = item.type === 'video'
                      ? (item.posterUrl || item.mediaUrl)
                      : (item.mediaUrl || item.posterUrl);

                    return (
                      <tr key={item.id}>
                        <td>
                          {previewUrl ? (
                            <img src={previewUrl} className={styles.tableThumb} alt={item.title} />
                          ) : (
                            <div className={styles.tableThumbPlaceholder}>
                              {item.type === 'video' ? <Film size={18} /> : <ImageIcon size={18} />}
                            </div>
                          )}
                        </td>
                        <td>{item.title}</td>
                        <td>{item.category}</td>
                        <td>{item.type === 'video' ? '🎬 Video' : '📷 Photo'}</td>
                        <td>
                          <div className={styles.actionBtnsRow}>
                            <button
                              type="button"
                              className={styles.iconActionBtn}
                              onClick={() => handleEdit(item)}
                              title="Edit"
                              aria-label={`Edit ${item.title}`}
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              className={`${styles.iconActionBtn} ${styles.deleteBtn}`}
                              onClick={() => handleDelete(item.id, item.title)}
                              title="Delete"
                              aria-label={`Delete ${item.title}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {toast && (
        <div className={styles.adminToast}>
          <Check size={18} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;