import React from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import Uploader from './Uploader';
import { GALLERY_CATEGORIES } from '../services/galleryService';
import styles from '../styles/AGF.module.css';

const AdminGalleryForm = ({
  formData,
  editingId,
  isGeneratingThumb,
  onChange,
  onSubmit,
  onCancel,
  onMainUploadSuccess,
  onPosterUploadSuccess
}) => {
  return (
    <section className={styles.formCard}>
      <form onSubmit={onSubmit}>
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
              onChange={onChange}
              placeholder="e.g. Maasai Mara Lion Pride"
            />
          </div>

          {/* Format Selector */}
          <div className={styles.formGroup}>
            <label htmlFor="type">Media Format</label>
            <select id="type" name="type" value={formData.type} onChange={onChange}>
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
              onUploadSuccess={onMainUploadSuccess}
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
                label={formData.posterUrl ? 'Upload replacement thumbnail' : 'Upload custom thumbnail'}
                onUploadSuccess={onPosterUploadSuccess}
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={onChange}>
              {GALLERY_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={onChange}
              placeholder="Detailed description of the shot or experience..."
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn} disabled={isGeneratingThumb}>
            <Check size={18} />
            <span>{editingId ? 'Update Item' : 'Publish to Supabase'}</span>
          </button>
          <button type="button" className={styles.btnSecondary} onClick={onCancel}>
            <X size={18} />
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminGalleryForm;