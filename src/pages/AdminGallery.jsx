import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit3, Film, Check, RotateCcw, X, Image as ImageIcon } from 'lucide-react';
import {
  getGalleryItems,
  saveGalleryItem,
  deleteGalleryItem,
  resetGalleryToDefaults,
  GALLERY_CATEGORIES
} from '../services/galleryService';
import styles from '../styles/AdminGallery.module.css';
import Uploader from '../components/Uploader';

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState('All');
  const [toast, setToast] = useState('');

  const initialFormState = {
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

  const [formData, setFormData] = useState(initialFormState);

  const loadItems = useCallback(async () => {
    try {
      const data = await getGalleryItems();
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching gallery items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetFormState = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setShowForm(false);
  };

  const handleToggleForm = () => {
    if (!showForm) {
      setEditingId(null);
      setFormData(initialFormState);
      setShowForm(true);
    } else {
      resetFormState();
    }
  };

  const handleMainUploadSuccess = (fileInfo) => {
    setFormData(prev => ({
      ...prev,
      mediaUrl: fileInfo.url,
      title: prev.title || fileInfo.name.split('.')[0].replace(/[-_]/g, ' ')
    }));
    showToastMsg("Media uploaded to Supabase Storage!");
  };

  const handlePosterUploadSuccess = (fileInfo) => {
    setFormData(prev => ({ ...prev, posterUrl: fileInfo.url }));
    showToastMsg("Video thumbnail uploaded!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.mediaUrl.trim()) {
      showToastMsg('Please upload a media file first!');
      return;
    }

    const payload = {
      ...formData,
      id: editingId || `safari-media-${Date.now()}`,
      tags: typeof formData.tags === 'string' 
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) 
        : formData.tags,
    };

    try {
      await saveGalleryItem(payload);
      await loadItems();
      showToastMsg(editingId ? 'Updated!' : 'Published to Gallery!');
      resetFormState();
    } catch (err) {
      showToastMsg(`Error: ${err?.message}`);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ 
      ...item, 
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '') 
    });
    setShowForm(true);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      await deleteGalleryItem(id);
      await loadItems();
      showToastMsg('Item removed.');
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
            <button className={styles.btnPrimary} onClick={handleToggleForm}>
              <Plus size={18} />
              <span>{showForm ? 'Close Form' : 'Post New Media'}</span>
            </button>
            <button className={styles.btnSecondary} onClick={resetGalleryToDefaults}>
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
                  <label>Title *</label>
                  <input name="title" type="text" required value={formData.title} onChange={handleChange} />
                </div>

                {/* Format Selector */}
                <div className={styles.formGroup}>
                  <label>Media Format</label>
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="image">📷 Photograph</option>
                    <option value="video">🎬 4K Video</option>
                  </select>
                </div>

                {/* Main Media Upload to Supabase */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Upload {formData.type === 'video' ? 'Video (MP4)' : 'Image'}</label>
                  <Uploader 
                    bucket="CBSI"
                    folder="Media"
                    allowedTypes={formData.type === 'video' ? ['video/mp4', 'video/quicktime'] : ['image/jpeg', 'image/png', 'image/webp']}
                    maxSizeMB={formData.type === 'video' ? 50 : 10}
                    label={`Select ${formData.type} to upload to Cloud`}
                    onUploadSuccess={handleMainUploadSuccess}
                  />
                  {formData.mediaUrl && (
                    <p className={styles.uploadSuccessLink}>✅ Linked: {formData.mediaUrl.split('/').pop()}</p>
                  )}
                </div>

                {/* Poster Upload (Only for Videos) */}
                {formData.type === 'video' && (
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Video Thumbnail (Poster Image)</label>
                    <Uploader 
                      bucket="CBSI"
                      folder="Media"
                      allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                      label="Upload thumbnail image"
                      onUploadSuccess={handlePosterUploadSuccess}
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    {GALLERY_CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Location</label>
                  <input name="location" type="text" value={formData.location} onChange={handleChange} />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Description</label>
                  <textarea name="description" rows={3} value={formData.description} onChange={handleChange} />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn}>
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
                    const previewUrl = item.type === 'video' ? item.posterUrl : item.mediaUrl;
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
                            <button className={styles.iconActionBtn} onClick={() => handleEdit(item)} title="Edit">
                              <Edit3 size={15} />
                            </button>
                            <button className={`${styles.iconActionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(item.id, item.title)} title="Delete">
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