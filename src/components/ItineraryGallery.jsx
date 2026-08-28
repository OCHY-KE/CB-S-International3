import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Video, Play, Maximize2, Minimize2, X, ChevronLeft, 
  ChevronRight, Sparkles, MapPin, Share2, MessageCircle, 
  ZoomIn, ZoomOut, Check, Compass, Info
} from 'lucide-react';
import { getVideoTypeAndEmbed, getMediaFormatLabel } from '../utils/mediaUtils';
import styles from '../styles/ItineraryReader.module.css';

const ItineraryGallery = ({ 
  media = [], 
  title = '', 
  onInquire = null,
  initialOpenIndex = null,
  onCloseLightbox = null
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const lightboxStageRef = useRef(null);
  const filmstripRef = useRef(null);
  const videoRef = useRef(null);

  // Sync initial open index if provided
  useEffect(() => {
    if (initialOpenIndex !== null && initialOpenIndex >= 0 && initialOpenIndex < media.length) {
      setLightboxIndex(initialOpenIndex);
      setIsZoomed(false);
    }
  }, [initialOpenIndex, media.length]);

  const photos = media.filter((m) => m.type === 'image');
  const videos = media.filter((m) => m.type === 'video');

  const filteredMedia = activeFilter === 'photos' 
    ? photos 
    : activeFilter === 'videos' 
      ? videos 
      : media;

  const currentItem = lightboxIndex !== null ? filteredMedia[lightboxIndex] : null;

  // Auto scroll active thumbnail into view inside the filmstrip
  useEffect(() => {
    if (lightboxIndex !== null && filmstripRef.current) {
      const activeThumb = filmstripRef.current.children[lightboxIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [lightboxIndex]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsZoomed(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    setLightboxIndex((prev) => (prev === 0 ? filteredMedia.length - 1 : prev - 1));
  }, [filteredMedia.length]);

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    setLightboxIndex((prev) => (prev === filteredMedia.length - 1 ? 0 : prev + 1));
  }, [filteredMedia.length]);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
    setIsZoomed(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    if (onCloseLightbox) onCloseLightbox();
  }, [onCloseLightbox]);

  // Keyboard navigation & hotkeys
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'z' || e.key === 'Z') {
        if (currentItem?.type === 'image') {
          setIsZoomed((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleClose, handlePrev, handleNext, currentItem]);

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (lightboxStageRef.current?.requestFullscreen) {
        lightboxStageRef.current.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Toast feedback
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2800);
  };

  // Share current visual item
  const handleShare = async (e, item) => {
    e.stopPropagation();
    const shareUrl = window.location.href;
    const shareText = `Explore "${item.title || title}" on CBSI Safaris visual itinerary.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title || title,
          text: shareText,
          url: shareUrl
        });
        showToast('Link shared successfully');
      } catch {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast('Itinerary link copied to clipboard');
      } catch {
        showToast('Link ready to share');
      }
    }
  };

  // Direct WhatsApp booking inquiry for the specific media capture
  const handleSpecificInquiry = (item) => {
    const itemTitle = item.title || title;
    const locationInfo = item.location ? `in ${item.location}` : '';
    const message = `Hello CBSI Safaris! I'm viewing "${itemTitle}" ${locationInfo} from the "${title}" itinerary and would love to check rates and safari dates.`;
    window.open(`https://wa.me/254722774952?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  // Touch Swipe for Mobile Navigation
  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (!media || media.length === 0) return null;

  return (
    <section className={styles.gallerySection} id="safari-gallery">
      {/* Section Header */}
      <div className={styles.galleryHeader}>
        <div>
          <div className={styles.gallerySubHeading}>
            <Sparkles size={16} className={styles.sparkleIcon} />
            <span>Curated Visual Showcase</span>
          </div>
          <h2 className={styles.galleryTitle}>Safari Gallery & Live Reels</h2>
          <p className={styles.galleryDesc}>
            Experience authentic high-definition captures and 4K video footage of wildlife sightings, iconic landscapes, and luxury lodges along this itinerary.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className={styles.galleryFilterTabs}>
          <button
            type="button"
            className={`${styles.galleryFilterBtn} ${activeFilter === 'all' ? styles.activeGalleryFilter : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Media ({media.length})
          </button>
          {photos.length > 0 && (
            <button
              type="button"
              className={`${styles.galleryFilterBtn} ${activeFilter === 'photos' ? styles.activeGalleryFilter : ''}`}
              onClick={() => setActiveFilter('photos')}
            >
              <Camera size={14} /> Photos ({photos.length})
            </button>
          )}
          {videos.length > 0 && (
            <button
              type="button"
              className={`${styles.galleryFilterBtn} ${activeFilter === 'videos' ? styles.activeGalleryFilter : ''}`}
              onClick={() => setActiveFilter('videos')}
            >
              <Video size={14} /> 4K Reels ({videos.length})
            </button>
          )}
        </div>
      </div>

      {/* Media Grid Cards */}
      <div className={styles.mediaGrid}>
        {filteredMedia.map((item, idx) => {
          const videoInfo = item.type === 'video' ? getVideoTypeAndEmbed(item.url) : null;
          const formatLabel = getMediaFormatLabel(item);

          return (
            <div
              key={idx}
              className={`${styles.mediaCard} ${item.type === 'video' ? styles.videoMediaCard : ''}`}
              onClick={() => {
                setLightboxIndex(idx);
                setIsZoomed(false);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setLightboxIndex(idx);
                }
              }}
              aria-label={`Open ${formatLabel}: ${item.title || title}`}
            >
              {item.type === 'video' ? (
                <div className={styles.galleryVideoWrapper}>
                  {item.poster ? (
                    <img 
                      src={item.poster} 
                      alt={item.title || title} 
                      className={styles.galleryVideoThumb}
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={item.url}
                      muted
                      playsInline
                      preload="metadata"
                      className={styles.galleryVideoThumb}
                    />
                  )}
                  <div className={styles.galleryVideoOverlay}>
                    <div className={styles.galleryPlayBtn}>
                      <Play size={22} fill="currentColor" className={styles.playIconSvg} />
                    </div>
                    <div className={styles.galleryVideoBadge}>
                      <Video size={12} /> {videoInfo?.type === 'youtube' ? 'YouTube 4K' : '4K Reel'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.galleryImageWrapper}>
                  <img
                    src={item.url}
                    alt={item.title || `${title} sighting ${idx + 1}`}
                    loading="lazy"
                    className={styles.galleryImage}
                  />
                  <div className={styles.galleryHoverOverlay}>
                    <div className={styles.expandPill}>
                      <Maximize2 size={16} className={styles.zoomIcon} />
                      <span>View Sighting</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Meta & Caption */}
              <div className={styles.mediaCardCaption}>
                <div className={styles.cardTagRow}>
                  <span className={styles.mediaTag}>
                    {item.type === 'video' ? '🎬 Live Footage' : '📷 High-Res Capture'}
                  </span>
                  {item.location && (
                    <span className={styles.cardLocationTag}>
                      <MapPin size={11} /> {item.location}
                    </span>
                  )}
                </div>
                <p className={styles.mediaCaptionText}>{item.title || title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- CINEMATIC MODERN CLASSIC LIGHTBOX THEATER --- */}
      <AnimatePresence>
        {lightboxIndex !== null && currentItem && (
          <motion.div 
            className={styles.classicLightboxOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
          >
            <div 
              ref={lightboxStageRef}
              className={styles.classicLightboxContainer}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Top Navigation & Status Bar */}
              <div className={styles.classicLightboxHeader}>
                <div className={styles.headerLeftMeta}>
                  <span className={styles.classicFormatBadge}>
                    {currentItem.type === 'video' ? <Video size={13} /> : <Camera size={13} />}
                    {getMediaFormatLabel(currentItem)} • {lightboxIndex + 1} of {filteredMedia.length}
                  </span>
                  <h3 className={styles.classicHeaderTitle}>
                    {currentItem.title || title}
                  </h3>
                  {currentItem.location && (
                    <span className={styles.classicHeaderLocation}>
                      <MapPin size={12} /> {currentItem.location}
                    </span>
                  )}
                </div>

                <div className={styles.headerRightActions}>
                  {/* Photo Zoom Toggle (Photos Only) */}
                  {currentItem.type === 'image' && (
                    <button
                      type="button"
                      className={`${styles.actionIconBtn} ${isZoomed ? styles.activeActionBtn : ''}`}
                      onClick={() => setIsZoomed((prev) => !prev)}
                      title={isZoomed ? "Reset Zoom (Z)" : "Zoom In (Z)"}
                      aria-label="Toggle photo zoom"
                    >
                      {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
                    </button>
                  )}

                  {/* Fullscreen Toggle */}
                  <button
                    type="button"
                    className={styles.actionIconBtn}
                    onClick={toggleFullscreen}
                    title="Toggle Fullscreen (F)"
                    aria-label="Toggle fullscreen"
                  >
                    {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>

                  {/* Share Button */}
                  <button
                    type="button"
                    className={styles.actionIconBtn}
                    onClick={(e) => handleShare(e, currentItem)}
                    title="Share this experience"
                    aria-label="Share media"
                  >
                    <Share2 size={18} />
                  </button>

                  {/* Direct WhatsApp Inquiry */}
                  <button 
                    type="button"
                    className={styles.classicInquireBtn}
                    onClick={() => handleSpecificInquiry(currentItem)}
                    title="Inquire about this sighting"
                  >
                    <MessageCircle size={16} />
                    <span>Inquire Now</span>
                  </button>

                  {/* Close Modal Button */}
                  <button
                    type="button"
                    className={styles.classicCloseBtn}
                    onClick={handleClose}
                    title="Close Lightbox (Esc)"
                    aria-label="Close Lightbox"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              {/* Main Media Stage */}
              <div className={styles.classicMediaStage}>
                {/* Previous Media Arrow */}
                {filteredMedia.length > 1 && (
                  <button
                    type="button"
                    className={`${styles.classicStageNavBtn} ${styles.classicPrevBtn}`}
                    onClick={handlePrev}
                    aria-label="Previous capture (Left Arrow)"
                  >
                    <ChevronLeft size={30} />
                  </button>
                )}

                {/* Media Presentation Display */}
                <div className={styles.stageContentWrapper}>
                  {currentItem.type === 'video' ? (
                    (() => {
                      const videoInfo = getVideoTypeAndEmbed(currentItem.url);
                      if (videoInfo.embedUrl) {
                        return (
                          <div className={styles.classicEmbedContainer}>
                            <iframe
                              src={videoInfo.embedUrl}
                              title={currentItem.title || title}
                              className={styles.classicEmbedIframe}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        );
                      }
                      return (
                        <div className={styles.classicDirectVideoContainer}>
                          <video
                            key={currentItem.url}
                            ref={videoRef}
                            src={currentItem.url}
                            poster={currentItem.poster}
                            controls
                            autoPlay
                            playsInline
                            className={styles.classicDirectVideo}
                          >
                            Your browser does not support video playback.
                          </video>
                        </div>
                      );
                    })()
                  ) : (
                    <div 
                      className={`${styles.classicImageStage} ${isZoomed ? styles.zoomedStage : ''}`}
                      onClick={() => setIsZoomed((prev) => !prev)}
                      title="Click to toggle zoom"
                    >
                      <img
                        key={currentItem.url}
                        src={currentItem.url}
                        alt={currentItem.title || title}
                        className={`${styles.classicMainImage} ${isZoomed ? styles.imageZoomed : ''}`}
                      />
                    </div>
                  )}
                </div>

                {/* Next Media Arrow */}
                {filteredMedia.length > 1 && (
                  <button
                    type="button"
                    className={`${styles.classicStageNavBtn} ${styles.classicNextBtn}`}
                    onClick={handleNext}
                    aria-label="Next capture (Right Arrow)"
                  >
                    <ChevronRight size={30} />
                  </button>
                )}
              </div>

              {/* Bottom Filmstrip Carousel & Narrative Footer */}
              <div className={styles.classicLightboxFooter}>
                <div className={styles.footerCaptionRow}>
                  <div className={styles.footerCaptionInfo}>
                    <p className={styles.footerDescription}>
                      {currentItem.title || title}
                    </p>
                    <span className={styles.footerSubText}>
                      {currentItem.type === 'video' 
                        ? 'High quality safari footage captured on tour' 
                        : 'Authentic high-resolution wildlife sighting photograph'}
                    </span>
                  </div>

                  <div className={styles.footerQuickActions}>
                    <button
                      type="button"
                      className={styles.footerBookBtn}
                      onClick={() => handleSpecificInquiry(currentItem)}
                    >
                      <MessageCircle size={15} />
                      <span>Book this Sighting</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Filmstrip Carousel */}
                {filteredMedia.length > 1 && (
                  <div className={styles.classicFilmstripWrapper}>
                    <div className={styles.filmstripTrack} ref={filmstripRef}>
                      {filteredMedia.map((m, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`${styles.filmstripThumbBtn} ${idx === lightboxIndex ? styles.activeFilmstripThumb : ''}`}
                          onClick={() => {
                            setLightboxIndex(idx);
                            setIsZoomed(false);
                          }}
                          title={m.title || `Capture ${idx + 1}`}
                          aria-label={`Jump to item ${idx + 1}`}
                        >
                          {m.type === 'video' && (
                            <div className={styles.filmstripVideoPill}>
                              <Play size={10} fill="currentColor" />
                            </div>
                          )}
                          <img 
                            src={m.type === 'video' ? (m.poster || m.url) : m.url} 
                            alt={`Thumbnail ${idx + 1}`} 
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className={styles.galleryToast}>
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};

export default ItineraryGallery;