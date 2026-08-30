import React, { useState, useEffect, useCallback } from 'react';
import { X, MapPin, Tag, User, Play, Maximize2 } from 'lucide-react';
import { getGalleryItems, GALLERY_CATEGORIES } from '../services/galleryService';
import styles from '../styles/Gallery.module.css';

const SUPABASE_PROJECT_ID = 'cccevikzhxeyxsjvomzg';
const SUPABASE_STORAGE_BASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public`;

const formatStorageUrl = (url, bucket = 'CBSI') => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const cleanPath = url.replace(/^\/+/, '');
  if (cleanPath.startsWith(`${bucket}/`)) {
    return `${SUPABASE_STORAGE_BASE_URL}/${cleanPath}`;
  }
  return `${SUPABASE_STORAGE_BASE_URL}/${bucket}/${cleanPath}`;
};

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  const loadGallery = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getGalleryItems();
      const formatted = (data || []).map(item => ({
        ...item,
        mediaUrl: formatStorageUrl(item.mediaUrl || item.media_url),
        posterUrl: formatStorageUrl(item.posterUrl || item.poster_url || item.mediaUrl),
      }));
      setItems(formatted);
      setFilteredItems(formatted);
    } catch (err) {
      console.error('Error loading gallery:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(i => i.category === activeCategory));
    }
  }, [activeCategory, items]);

  return (
    <div className={styles.galleryWrapper}>
      {/* Category Filter */}
      <div className={styles.filterBar}>
        {GALLERY_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={activeCategory === cat ? styles.activeFilter : ''}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loader}>Exploring Wilderness...</div>
      ) : (
        <div className={styles.masonryGrid}>
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className={styles.gridItem}
              onClick={() => setSelectedItem(item)}
            >
              {item.type === 'video' ? (
                <div className={styles.videoWrapper}>
                  <img src={item.posterUrl} alt={item.title} loading="lazy" />
                  <div className={styles.playOverlay}>
                    <Play fill="white" size={32} />
                  </div>
                </div>
              ) : (
                <img src={item.mediaUrl} alt={item.title} loading="lazy" />
              )}
              <div className={styles.hoverOverlay}>
                <Maximize2 size={24} color="white" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Details Modal */}
      {selectedItem && (
        <div className={styles.modalOverlay} onClick={() => setSelectedItem(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedItem(null)}>
              <X size={28} />
            </button>
            
            <div className={styles.modalMedia}>
              {selectedItem.type === 'video' ? (
                <video controls autoPlay src={selectedItem.mediaUrl} poster={selectedItem.posterUrl} />
              ) : (
                <img src={selectedItem.mediaUrl} alt={selectedItem.title} />
              )}
            </div>

            <div className={styles.modalDetails}>
              <h2>{selectedItem.title}</h2>
              <div className={styles.metaRow}>
                <span className={styles.badge}>{selectedItem.category}</span>
                {selectedItem.location && (
                  <span className={styles.location}>
                    <MapPin size={14} /> {selectedItem.location}
                  </span>
                )}
              </div>
              
              <p className={styles.description}>{selectedItem.description}</p>
              
              <div className={styles.footerInfo}>
                {selectedItem.author && (
                  <span><User size={14} /> {selectedItem.author}</span>
                )}
                <div className={styles.tags}>
                  {Array.isArray(selectedItem.tags) && selectedItem.tags.map(tag => (
                    <span key={tag} className={styles.tag}><Tag size={12} /> {tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;