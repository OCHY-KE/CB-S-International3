import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RotateCcw, Check } from 'lucide-react';
import {
  getGalleryItems,
  saveGalleryItem,
  deleteGalleryItem,
  resetGalleryToDefaults
} from '../services/galleryService';
import { supabase } from '../supabaseClient';
import styles from '../styles/AdminGallery.module.css';
import AdminGalleryForm from '../components/AdminGalleryForm';
import AdminGalleryTable from '../components/AdminGalleryTable';

const SUPABASE_PROJECT_ID = 'cccevikzhxeyxsjvomzg';
const SUPABASE_STORAGE_BASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public`;

const formatStorageUrl = (url, bucket = 'CBSI') => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const cleanPath = url.replace(/^\/+/, '');
  if (cleanPath.startsWith(`${bucket}/`)) {
    return `${SUPABASE_STORAGE_BASE_URL}/${cleanPath}`;
  }
  return `${SUPABASE_STORAGE_BASE_URL}/${bucket}/${cleanPath}`;
};

const getStorageFilePath = (fullUrl, bucket = 'CBSI') => {
  if (!fullUrl) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  if (fullUrl.includes(marker)) {
    const rawPath = fullUrl.split(marker)[1];
    return rawPath ? rawPath.split('?')[0] : null;
  }
  return null;
};

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
      reject(new Error('Error loading video file for frame extraction (Check CORS).'));
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

  const normalizeItem = useCallback((item) => {
    const rawMedia = item.mediaUrl || item.media_url || item.image_url || '';
    const rawPoster = item.posterUrl || item.poster_url || (item.type === 'image' ? rawMedia : '');

    return {
      id: item.id,
      title: item.title || 'Untitled Asset',
      type: item.type || 'image',
      category: item.category || 'Wildlife',
      mediaUrl: formatStorageUrl(rawMedia),
      posterUrl: formatStorageUrl(rawPoster),
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
    setFormData((prev) => ({
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

    setFormData((prev) => ({
      ...prev,
      mediaUrl: fullUrl,
      title: prev.title || fileInfo?.name?.split('.')[0]?.replace(/[-_]/g, ' ') || ''
    }));

    showToastMsg('Media file successfully uploaded!');

    if (formData.type === 'video') {
      try {
        setIsGeneratingThumb(true);
        showToastMsg('Generating video thumbnail frame...');

        const thumbFile = await captureVideoThumbnail(fullUrl, `thumb_${Date.now()}.jpg`);
        const filePath = `Media/thumbnails/${thumbFile.name}`;

        const { data, error } = await supabase.storage.from('CBSI').upload(filePath, thumbFile, {
          contentType: 'image/jpeg',
          upsert: true
        });

        if (error) throw error;

        const generatedPosterUrl = formatStorageUrl(data.path);
        setFormData((prev) => ({ ...prev, posterUrl: generatedPosterUrl }));
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

    setFormData((prev) => ({ ...prev, posterUrl: fullUrl }));
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

    const processedTags =
      typeof formData.tags === 'string'
        ? formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : Array.isArray(formData.tags)
        ? formData.tags
        : [];

    const payload = {
      ...formData,
      mediaUrl: formatStorageUrl(formData.mediaUrl),
      posterUrl: formatStorageUrl(formData.posterUrl),
      tags: processedTags
    };

    if (editingId) payload.id = editingId;

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
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;

    const itemToDelete = items.find((item) => item.id === id);
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));

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

  const filteredTableItems = items.filter((item) => {
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
          <AdminGalleryForm
            formData={formData}
            editingId={editingId}
            isGeneratingThumb={isGeneratingThumb}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetFormState}
            onMainUploadSuccess={handleMainUploadSuccess}
            onPosterUploadSuccess={handlePosterUploadSuccess}
          />
        )}

        <AdminGalleryTable
          items={filteredTableItems}
          loading={loading}
          tableCategory={tableCategory}
          tableSearch={tableSearch}
          onCategoryChange={setTableCategory}
          onSearchChange={setTableSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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