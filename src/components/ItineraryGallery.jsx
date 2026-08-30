import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, Play, X, Sparkles, MapPin, MessageCircle } from 'lucide-react';
import styles from '../styles/IG.module.css';

// Helper component to extract thumbnail from video URL
const AutoVideoThumbnail = ({ src, alt, className }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const video = document.createElement('video');
    video.src = src;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.currentTime = 1.0;

    const handleSeeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        if (isMounted) setThumbnailUrl(dataUrl);
      } catch (e) {
        console.warn('Canvas thumbnail capture blocked by CORS:', e);
      }
    };

    video.addEventListener('seeked', handleSeeked);

    return () => {
      isMounted = false;
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [src]);

  return <img src={thumbnailUrl || src} alt={alt} className={className} />;
};

const ItineraryGallery = ({ 
  media = [], 
  title = 'Safari Experience', 
  initialOpenIndex = null,
  onCloseLightbox = null
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const photos = useMemo(() => media.filter(m => m.type === 'image'), [media]);
  const videos = useMemo(() => media.filter(m => m.type === 'video'), [media]);
  
  const filteredMedia = useMemo(() => {
    if (activeFilter === 'photos') return photos;
    if (activeFilter === 'videos') return videos;
    return media;
  }, [activeFilter, media, photos, videos]);

  const currentItem = lightboxIndex !== null ? filteredMedia[lightboxIndex] : null;

  const handleFilterChange = (tab) => {
    setActiveFilter(tab);
    setLightboxIndex(null);
  };

  useEffect(() => {
    if (initialOpenIndex !== null && initialOpenIndex < media.length) {
      setLightboxIndex(initialOpenIndex);
    }
  }, [initialOpenIndex, media.length]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
    onCloseLightbox?.();
  }, [onCloseLightbox]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleClose]);

  const handleInquiry = (item) => {
    const message = `I'm interested in "${item.title || title}" ${item.location ? `at ${item.location}` : ''}.`;
    window.open(`https://wa.me/254722774952?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  if (!media.length) return null;

  return (
    <section className={styles.gallerySection}>
      <div className={styles.galleryHeader}>
        <div className={styles.headerInfo}>
          <div className={styles.subHeading}>
            <Sparkles size={16} /> <span>Visual Showcase</span>
          </div>
          <h2 className={styles.galleryTitle}>Safari Gallery & 4K Reels</h2>
        </div>

        <div className={styles.filterTabs}>
          {['all', 'photos', 'videos'].map(tab => (
            <button
              key={tab}
              className={`${styles.filterBtn} ${activeFilter === tab ? styles.activeFilter : ''}`}
              onClick={() => handleFilterChange(tab)}
            >
              {tab === 'photos' && <Camera size={14} />}
              {tab === 'videos' && <Video size={14} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.mediaGrid}>
        {filteredMedia.map((item, idx) => (
          <motion.div
            layout
            key={item.url + idx}
            className={styles.mediaCard}
            onClick={() => setLightboxIndex(idx)}
          >
            <div className={styles.imageContainer}>
              {item.type === 'video' ? (
                <>
                  {item.poster ? (
                    <img src={item.poster} alt="" className={styles.thumbnail} />
                  ) : (
                    <AutoVideoThumbnail src={item.url} alt="" className={styles.thumbnail} />
                  )}
                  <div className={styles.playOverlay}><Play fill="white" size={24} /></div>
                </>
              ) : (
                <img src={item.url} alt={item.title || title} className={styles.thumbnail} />
              )}
              {item.location && (
                <div className={styles.cardOverlay}>
                  <span className={styles.locationTag}><MapPin size={12} /> {item.location}</span>
                </div>
              )}
            </div>
            <div className={styles.cardMeta}>
              <p>{item.title || title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && currentItem && (
          <motion.div 
            className={styles.lightboxOverlay}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <div 
              className={styles.lightboxContainer}
              onClick={e => e.stopPropagation()}
            >
              {/* Only Close (X) button top-right */}
              <button 
                className={styles.closeBtn} 
                onClick={handleClose} 
                aria-label="Close"
              >
                <X size={24} />
              </button>

              {/* Media Stage - Full Width on Small Screens */}
              <div className={styles.stage}>
                <div className={styles.content}>
                  {currentItem.type === 'video' ? (
                    <video 
                      key={currentItem.url} 
                      controls 
                      autoPlay 
                      src={currentItem.url} 
                      className={styles.mainVideo} 
                    />
                  ) : (
                    <img 
                      src={currentItem.url} 
                      alt={currentItem.title || title} 
                      className={styles.mainImage} 
                    />
                  )}
                </div>
              </div>

              {/* Minimal Info Bar */}
              <div className={styles.lightboxFooter}>
                <div className={styles.footerInfo}>
                  <p>{currentItem.title || title}</p>
                  {currentItem.location && (
                    <span><MapPin size={14} /> {currentItem.location}</span>
                  )}
                </div>

                <button className={styles.inquireBtn} onClick={() => handleInquiry(currentItem)}>
                  <MessageCircle size={18} /> Inquire Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ItineraryGallery;