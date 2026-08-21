import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  Plus,
  Trash2,
  Edit3,
  Film,
  Image as ImageIcon,
  Sparkles,
  Search,
  Eye,
  Check,
  RotateCcw,
  ArrowLeft,
  Star,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Play,
  Heart
} from 'lucide-react';
import {
  getGalleryItems,
  saveGalleryItem,
  deleteGalleryItem,
  resetGalleryToDefaults,
  GALLERY_CATEGORIES
} from '../services/galleryService';
import styles from '../styles/AdminGallery.module.css';

const PRESETS = [
  {
    label: '🐘 Amboseli Elephants 4K Video',
    data: {
      type: 'video',
      title: 'Amboseli Elephant Herd Dust Bath Expedition',
      category: 'Wildlife',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=1200',
      location: 'Amboseli National Park, Kenya',
      description: 'Remarkable 4K recording of elephant families congregating at the freshwater marshlands with Kilimanjaro in the horizon.',
      tags: ['Amboseli', 'Elephants', 'BigFive', 'WildKenya'],
      featured: true,
      author: 'Ole Sankale'
    }
  },
  {
    label: '🦁 Mara Lion Pride Photo',
    data: {
      type: 'image',
      title: 'Mara River Marsh Pride at Sunset',
      category: 'Wildlife',
      mediaUrl: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&q=80&w=1200',
      posterUrl: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&q=80&w=600',
      location: 'Maasai Mara, Kenya',
      description: 'Lions resting along the Mara escarpment under an acacia canopy during the late afternoon golden glow.',
      tags: ['Lions', 'Sunset', 'MaraPride'],
      featured: false,
      author: 'Samson Kimani'
    }
  },
  {
    label: '🏛️ KICC Nairobi Conference Hall',
    data: {
      type: 'image',
      title: 'KICC Plenary Hall - Pan-African Trade Summit',
      category: 'Conferences',
      mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200',
      posterUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600',
      location: 'KICC Nairobi, Kenya',
      description: 'Executive conference layout with bilingual audio feeds, delegate table setups, and stage production managed by CBSI Conferences.',
      tags: ['CorporateEvents', 'MICE', 'Nairobi'],
      featured: false,
      author: 'Events Directorate'
    }
  },
  {
    label: '🏨 Ngorongoro Crater Lodge Haven',
    data: {
      type: 'image',
      title: 'Ngorongoro Rim Luxury Suite Deck',
      category: 'Lodges',
      mediaUrl: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=1200',
      posterUrl: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=600',
      location: 'Ngorongoro Conservation Area, Tanzania',
      description: 'Elegantly appointed suites overlooking the volcanic caldera floor 600 meters below.',
      tags: ['LuxuryLodge', 'Ngorongoro', 'Tanzania'],
      featured: true,
      author: 'Hospitality Concierge'
    }
  }
];

const AdminGallery = ({ onBack }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState('All');
  const [toast, setToast] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Form State
  const initialFormState = {
    title: '',
    type: 'image', // 'image' | 'video'
    category: 'Wildlife',
    mediaUrl: '',
    posterUrl: '',
    videoEmbedUrl: '',
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
      setItems(data);
    } catch (err) {
      console.error(err);
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

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Preset loader
  const handleApplyPreset = (preset) => {
    setFormData({
      ...preset.data,
      tags: Array.isArray(preset.data.tags) ? preset.data.tags.join(', ') : preset.data.tags
    });
    setShowForm(true);
    showToastMsg(`Loaded preset: ${preset.data.title}`);
  };

  // Local File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      showToastMsg('Please upload a valid image or video file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setFormData(prev => ({
        ...prev,
        type: isVideo ? 'video' : 'image',
        mediaUrl: result,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      }));
      showToastMsg(`Attached local ${isVideo ? 'video' : 'image'} successfully!`);
    };
    reader.readAsDataURL(file);
  };

  // Submit Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.mediaUrl.trim()) {
      showToastMsg('Please provide a title and media URL or file');
      return;
    }

    const parsedTags = typeof formData.tags === 'string'
      ? formData.tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean)
      : formData.tags;

    const payload = {
      ...formData,
      id: editingId || `safari-media-${Date.now()}`,
      tags: parsedTags,
      location: formData.location.trim() || 'East Africa'
    };

    try {
      await saveGalleryItem(payload);
      await loadItems();
      showToastMsg(editingId ? 'Media updated successfully!' : 'New media posted to Public Gallery!');
      setFormData(initialFormState);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      showToastMsg(`Error saving media: ${err?.message}`);
    }
  };

  // Edit item trigger
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      type: item.type || 'image',
      category: item.category || 'Wildlife',
      mediaUrl: item.mediaUrl || '',
      posterUrl: item.posterUrl || '',
      videoEmbedUrl: item.videoEmbedUrl || '',
      location: item.location || '',
      description: item.description || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
      featured: !!item.featured,
      author: item.author || 'CBSI Safari Lead'
    });
    setShowForm(true);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Delete item
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from the gallery?`)) {
      try {
        await deleteGalleryItem(id);
        await loadItems();
        showToastMsg('Item removed from gallery.');
      } catch (err) {
        showToastMsg(`Delete error: ${err?.message}`);
      }
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (item) => {
    const updated = {
      ...item,
      featured: !item.featured
    };
    await saveGalleryItem(updated);
    await loadItems();
    showToastMsg(`${item.title} ${updated.featured ? 'pinned as Featured' : 'unpinned'}`);
  };

  // Reset to default sample items
  const handleResetDefaults = () => {
    if (window.confirm('Reset gallery to default curated wildlife photos and 4K videos?')) {
      resetGalleryToDefaults();
      loadItems();
      showToastMsg('Gallery restored to standard curated catalogue.');
    }
  };

  // Filtered items in table
  const filteredTableItems = items.filter(item => {
    const matchCat = tableCategory === 'All' || item.category === tableCategory;
    const q = tableSearch.toLowerCase().trim();
    const matchQ = !q ||
      item.title.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  // Calculate statistics
  const totalItems = items.length;
  const videoCount = items.filter(i => i.type === 'video').length;
  const photoCount = items.filter(i => i.type === 'image').length;
  const totalLikes = items.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  return (
    <div className={styles.adminGalleryShell}>
      <div className={styles.container}>
        {/* Header Title Area */}
        <header className={styles.pageHeader}>
          <div className={styles.headerTitleArea}>
            <h1>Admin Gallery Manager</h1>
            <p>Publish, edit, and curate high-definition wildlife imagery and 4K safari expedition videos for the live gallery.</p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => {
                if (showForm && !editingId) {
                  setShowForm(false);
                } else {
                  setEditingId(null);
                  setFormData(initialFormState);
                  setShowForm(true);
                }
              }}
            >
              <Plus size={18} />
              <span>{showForm && !editingId ? 'Close Form' : 'Post New Media'}</span>
            </button>

            <Link to="/gallery" target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
              <ExternalLink size={16} />
              <span>Public Gallery Live View</span>
            </Link>

            <button
              type="button"
              className={styles.btnSecondary}
              onClick={handleResetDefaults}
              title="Reset to default curated gallery items"
            >
              <RotateCcw size={16} />
              <span>Reset Samples</span>
            </button>
          </div>
        </header>

        {/* Overview Stats Cards */}
        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <div className={styles.statIconWrap}>
              <Sparkles size={24} />
            </div>
            <div>
              <strong>{totalItems}</strong>
              <span>Total Media Assets</span>
            </div>
          </article>

          <article className={styles.statCard}>
            <div className={styles.statIconWrap}>
              <Film size={24} />
            </div>
            <div>
              <strong>{videoCount}</strong>
              <span>4K Safari Videos</span>
            </div>
          </article>

          <article className={styles.statCard}>
            <div className={styles.statIconWrap}>
              <ImageIcon size={24} />
            </div>
            <div>
              <strong>{photoCount}</strong>
              <span>High-Res Photos</span>
            </div>
          </article>

          <article className={styles.statCard}>
            <div className={styles.statIconWrap}>
              <Heart size={24} />
            </div>
            <div>
              <strong>{totalLikes}</strong>
              <span>Client Likes & Favorites</span>
            </div>
          </article>
        </section>

        {/* Media Posting / Editing Form */}
        {showForm && (
          <section className={styles.formCard}>
            <div className={styles.formCardHeader}>
              <h2>
                {editingId ? <Edit3 size={20} /> : <Plus size={20} />}
                <span>{editingId ? 'Edit Gallery Media' : 'Publish New Safari Photo or Video'}</span>
              </h2>

              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData(initialFormState);
                }}
              >
                Cancel
              </button>
            </div>

            {/* Quick 1-Click Safari Presets */}
            <div className={styles.presetsSection}>
              <span>⚡ Quick Safari Presets (1-Click Fill):</span>
              <div className={styles.presetButtonsRow}>
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={styles.presetBtn}
                    onClick={() => handleApplyPreset(p)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

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
                    placeholder="e.g. Wildebeest Mara Crossing 4K Expedition"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                {/* Media Type */}
                <div className={styles.formGroup}>
                  <label htmlFor="type">Media Format *</label>
                  <select id="type" name="type" value={formData.type} onChange={handleChange}>
                    <option value="image">📷 Photograph (JPEG, PNG, WebP)</option>
                    <option value="video">🎬 4K Safari Video (MP4, Embed)</option>
                  </select>
                </div>

                {/* Category */}
                <div className={styles.formGroup}>
                  <label htmlFor="category">Category *</label>
                  <select id="category" name="category" value={formData.category} onChange={handleChange}>
                    {GALLERY_CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className={styles.formGroup}>
                  <label htmlFor="location">Location / Sanctuary</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Maasai Mara National Reserve, Kenya"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                {/* Media URL / Source */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="mediaUrl">
                    Media URL (Direct Image or MP4 Video URL) *
                  </label>
                  <input
                    id="mediaUrl"
                    name="mediaUrl"
                    type="url"
                    required
                    placeholder={formData.type === 'video' ? 'https://example.com/safari-video.mp4' : 'https://images.unsplash.com/...'}
                    value={formData.mediaUrl}
                    onChange={handleChange}
                  />
                </div>

                {/* Optional Local File Drag & Drop */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Or Upload File Directly from Device</label>
                  <div
                    className={`${styles.uploadZone} ${isDragging ? styles.dragging : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files?.[0]) {
                        handleFileUpload({ target: { files: e.dataTransfer.files } });
                      }
                    }}
                  >
                    <Upload className={styles.uploadIcon} size={32} />
                    <p>Click or drag image / MP4 video here to upload</p>
                    <span>Supports high-resolution JPG, PNG, WebP, and MP4 video clips</span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className={styles.uploadInputHidden}
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                    />
                  </div>

                  {formData.mediaUrl && (
                    <div className={styles.previewBox}>
                      {formData.type === 'video' ? (
                        <video src={formData.mediaUrl} controls className={styles.previewMedia} />
                      ) : (
                        <img src={formData.mediaUrl} alt="Preview" className={styles.previewMedia} />
                      )}
                    </div>
                  )}
                </div>

                {/* Poster URL for Videos */}
                {formData.type === 'video' && (
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="posterUrl">Video Poster / Thumbnail Image URL</label>
                    <input
                      id="posterUrl"
                      name="posterUrl"
                      type="url"
                      placeholder="https://images.unsplash.com/... (cover image shown before playing)"
                      value={formData.posterUrl}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* Description */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="description">Safari Story & Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Describe the wildlife encounter, conservation notes, or venue highlights..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Tags */}
                <div className={styles.formGroup}>
                  <label htmlFor="tags">Tags (Comma-separated)</label>
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    placeholder="BigFive, Serengeti, Aerial, MaraRiver"
                    value={formData.tags}
                    onChange={handleChange}
                  />
                </div>

                {/* Author / Guide Credit */}
                <div className={styles.formGroup}>
                  <label htmlFor="author">Curator / Safari Guide Name</label>
                  <input
                    id="author"
                    name="author"
                    type="text"
                    placeholder="e.g. Lead Guide Ole Sankale"
                    value={formData.author}
                    onChange={handleChange}
                  />
                </div>

                {/* Featured Toggle */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="featured"
                      className={styles.checkboxInput}
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                    <span>⭐ Pin as Featured on Public Gallery Top</span>
                  </label>
                </div>
              </div>

              {/* Form Submit Row */}
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className={styles.submitBtn}>
                  <Check size={18} />
                  <span>{editingId ? 'Update Gallery Item' : 'Publish to Live Gallery'}</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Media Catalogue Table */}
        <section className={styles.tableCard}>
          <div className={styles.tableToolbar}>
            <h2>Manage Published Gallery Media ({filteredTableItems.length})</h2>

            <div className={styles.tableFilters}>
              <select
                value={tableCategory}
                onChange={(e) => setTableCategory(e.target.value)}
                className={styles.tableSearchInput}
                aria-label="Filter by category"
              >
                {GALLERY_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search title, location..."
                className={styles.tableSearchInput}
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.tableResponsive}>
            <table className={styles.mediaTable}>
              <thead>
                <tr>
                  <th>Media</th>
                  <th>Title & Description</th>
                  <th>Format</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Featured</th>
                  <th>Likes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTableItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      No gallery media found matching current filter.
                    </td>
                  </tr>
                ) : (
                  filteredTableItems.map((item) => (
                    <tr key={item.id}>
                      {/* Thumbnail */}
                      <td>
                        <div className={styles.tableThumbWrapper}>
                          <img
                            src={item.type === 'video' ? (item.posterUrl || item.mediaUrl) : item.mediaUrl}
                            alt={item.title}
                            className={styles.tableThumb}
                          />
                          {item.type === 'video' && (
                            <span className={styles.tableVideoBadge}>
                              <Play size={10} fill="#fff" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Title & Caption */}
                      <td className={styles.titleCell}>
                        <strong>{item.title}</strong>
                        <span>{item.description ? `${item.description.slice(0, 70)}...` : 'No caption'}</span>
                      </td>

                      {/* Format */}
                      <td>
                        <span className={`${styles.badgePill} ${item.type === 'video' ? styles.featuredPill : styles.categoryPill}`}>
                          {item.type === 'video' ? '🎬 4K Video' : '📷 Photo'}
                        </span>
                      </td>

                      {/* Category */}
                      <td>
                        <span className={`${styles.badgePill} ${styles.categoryPill}`}>
                          {item.category}
                        </span>
                      </td>

                      {/* Location */}
                      <td>
                        <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                          {item.location}
                        </span>
                      </td>

                      {/* Featured */}
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(item)}
                          className={styles.iconActionBtn}
                          title={item.featured ? 'Pinned (Click to unpin)' : 'Click to pin as Featured'}
                        >
                          <Star size={16} fill={item.featured ? '#c5a059' : 'none'} color={item.featured ? '#c5a059' : '#94a3b8'} />
                        </button>
                      </td>

                      {/* Likes */}
                      <td>
                        <span style={{ fontWeight: 600, color: '#e11d48', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Heart size={14} fill="#e11d48" /> {item.likes || 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className={styles.actionBtnsRow}>
                          <button
                            type="button"
                            className={styles.iconActionBtn}
                            onClick={() => handleEdit(item)}
                            title="Edit media details"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            type="button"
                            className={`${styles.iconActionBtn} ${styles.deleteBtn}`}
                            onClick={() => handleDelete(item.id, item.title)}
                            title="Delete media from gallery"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Floating Notification */}
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