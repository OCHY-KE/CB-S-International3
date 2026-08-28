import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Video as VideoIcon, Image as ImageIcon, Sparkles } from 'lucide-react';
import { getVideoTypeAndEmbed } from '../utils/mediaUtils';
import styles from '../styles/Itineraries.module.css';

const ItineraryCardMedia = ({ 
  media = [], 
  title = '', 
  category = '', 
  onPlayVideo = null,
  onClickMedia = null
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  // If no media provided, provide default fallback
  const items = media.length > 0 ? media : [
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80',
      title: title
    }
  ];

  const total = items.length;
  const currentItem = items[currentIndex] || items[0];
  const videoInfo = currentItem.type === 'video' ? getVideoTypeAndEmbed(currentItem.url) : null;

  // Auto-cycle through images gently when card is hovered (if multiple items and not direct playing)
  useEffect(() => {
    if (!isHovered || total <= 1 || isVideoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3500);

    return () => clearInterval(timer);
  }, [isHovered, total, isVideoPlaying]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    setIsVideoPlaying(false);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % total);
    setIsVideoPlaying(false);
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    setCurrentIndex(index);
    setIsVideoPlaying(false);
  };

  const handleMediaClick = (e) => {
    e.stopPropagation();
    if (currentItem.type === 'video' && onPlayVideo) {
      onPlayVideo(currentItem.url, currentItem.title || title);
    } else if (onClickMedia) {
      onClickMedia(currentIndex, currentItem);
    }
  };

  return (
    <div 
      className={styles.slideshowContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsVideoPlaying(false);
      }}
      onClick={handleMediaClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${currentItem.type === 'video' ? 'video' : 'photo'} for ${title}`}
    >
      {/* Active Slide Media */}
      <div className={styles.slideFrame}>
        {currentItem.type === 'video' ? (
          <div className={styles.slideVideoWrapper}>
            {currentItem.poster ? (
              <img 
                src={currentItem.poster} 
                alt={currentItem.title || title}
                className={styles.slideImage}
                loading="lazy"
              />
            ) : videoInfo?.isDirect ? (
              <video
                ref={videoRef}
                src={currentItem.url}
                playsInline
                muted
                loop
                autoPlay
                className={styles.slideVideo}
              />
            ) : (
              <div className={styles.videoPlaceholderSlide}>
                <div className={styles.videoPosterFallback}>
                  <Sparkles size={24} className={styles.sparkleIcon} />
                  <span>4K Video Tour</span>
                </div>
              </div>
            )}
            
            {/* Play Button Overlay to open in Cinematic Mode */}
            <button
              type="button"
              className={styles.slidePlayOverlay}
              onClick={(e) => {
                e.stopPropagation();
                if (onPlayVideo) {
                  onPlayVideo(currentItem.url, currentItem.title || title);
                }
              }}
              title="Watch in High Definition"
              aria-label="Play full video"
            >
              <Play size={20} className={styles.slidePlayIcon} fill="currentColor" />
              <span>Watch 4K Video</span>
            </button>
          </div>
        ) : (
          <img 
            src={currentItem.url} 
            alt={currentItem.title || title}
            loading="lazy"
            className={styles.slideImage}
          />
        )}
      </div>

      {/* Category Badge on Top-Left */}
      {category && (
        <div className={styles.categoryBadge}>
          {category}
        </div>
      )}

      {/* Top-Right Indicator Badge */}
      <div className={styles.mediaCounterBadge}>
        {currentItem.type === 'video' ? (
          <span className={styles.counterVideoTag}>
            <VideoIcon size={12} /> Video {currentIndex + 1}/{total}
          </span>
        ) : (
          <span className={styles.counterImageTag}>
            <ImageIcon size={12} /> {currentIndex + 1}/{total}
          </span>
        )}
      </div>

      {/* Navigation Arrows (if multiple media items exist) */}
      {total > 1 && (
        <>
          <button 
            type="button"
            className={`${styles.slideNavBtn} ${styles.prevBtn} ${isHovered ? styles.btnVisible : ''}`}
            onClick={handlePrev}
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>

          <button 
            type="button"
            className={`${styles.slideNavBtn} ${styles.nextBtn} ${isHovered ? styles.btnVisible : ''}`}
            onClick={handleNext}
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Slide Indicator Dots at Bottom */}
      {total > 1 && (
        <div className={styles.slideDotsRow}>
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.slideDot} ${idx === currentIndex ? styles.activeDot : ''} ${item.type === 'video' ? styles.videoDot : ''}`}
              onClick={(e) => handleDotClick(e, idx)}
              title={`Slide ${idx + 1} (${item.type})`}
              aria-label={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryCardMedia;