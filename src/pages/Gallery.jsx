import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Image as ImageIcon,
  Film,
  Search,
  Heart,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Calendar,
  User,
  Check
} from 'lucide-react';
import {
  getGalleryItems,
  toggleLikeItem,
  getUserLikes,
  GALLERY_CATEGORIES
} from '../services/galleryService';
import styles from '../styles/Gallery.module.css';

const Gallery = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all'); // 'all' | 'image' | 'video'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'likes' | 'newest' | 'title'
  const [userLikes, setUserLikes] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Load items and listen for admin updates
  const loadData = useCallback(async () => {
    try {
      const data = await getGalleryItems();
      setItems(data);
      setUserLikes(getUserLikes());
    } catch (err) {
      console.error('Failed to load gallery items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    const handleUpdate = (e) => {
      if (e.detail) {
        setItems(e.detail);
        setUserLikes(getUserLikes());
      } else {
        loadData();
      }
    };

    window.addEventListener('cbs-gallery-updated', handleUpdate);
    return () => window.removeEventListener('cbs-gallery-updated', handleUpdate);
  }, [loadData]);

  // Show temporary toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Handle Like
  const handleLike = (e, id) => {
    e.stopPropagation();
    const isNowLiked = toggleLikeItem(id);
    setUserLikes(prev => ({ ...prev, [id]: isNowLiked }));
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likes: Math.max(0, (item.likes || 0) + (isNowLiked ? 1 : -1))
        };
      }
      return item;
    }));
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedItem) return;
      if (e.key === 'Escape') {
        setSelectedItem(null);
      } else if (e.key === 'ArrowRight') {
        navigateModal(1);
      } else if (e.key === 'ArrowLeft') {
        navigateModal(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Filtered & Sorted items computation
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Category filter
      const matchCategory = activeCategory === 'All' || item.category.toLowerCase() === activeCategory.toLowerCase();
      // Media type filter
      const matchType = mediaTypeFilter === 'all' || item.type === mediaTypeFilter;
      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));

      return matchCategory && matchType && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (b.likes || 0) - (a.likes || 0);
      }
      if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
      if (sortBy === 'newest') return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [items, activeCategory, mediaTypeFilter, searchQuery, sortBy]);

  // Modal Next / Prev index navigation
  const navigateModal = (direction) => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(it => it.id === selectedItem.id);
    if (currentIndex === -1) return;

    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = filteredItems.length - 1;
    if (newIndex >= filteredItems.length) newIndex = 0;

    setSelectedItem(filteredItems[newIndex]);
  };

  // Counts for tabs
  const counts = useMemo(() => {
    const total = items.length;
    const photos = items.filter(i => i.type === 'image').length;
    const videos = items.filter(i => i.type === 'video').length;
    return { total, photos, videos };
  }, [items]);

  // Direct Inquiry WhatsApp message
  const handleInquireSafari = (item) => {
    const text = encodeURIComponent(
      `Hello CB S International team! I saw "${item.title}" in ${item.location} on your website gallery and would love to request a custom safari & conference itinerary quotation.`
    );
    window.open(`https://wa.me/254700000000?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  // Copy shareable link
  const handleShare = async (item) => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Explore ${item.title} with CB S International Safaris`,
          url: url
        });
        showToast('Link shared successfully!');
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        showToast('Gallery link copied to clipboard!');
      } catch {
        showToast('Sharing available via URL');
      }
    }
  };

  return (
    <section className={styles.gallerySection}>
      <div className={styles.container}>
        {/* Header Title Section */}
        <div className={styles.header}>
          <div className={styles.topTitleRow}>
            <span className={styles.topTitle}>Visual Odyssey</span>
            <Link to="/admin-dashboard" className={styles.adminBadgeLink} title="Manage gallery & post media">
              <ShieldCheck size={14} />
              <span>Admin Gallery Hub</span>
            </Link>
          </div>
          <h1 className={styles.galleryTitle}>
            Experience The <span>African Wilderness</span>
          </h1>
          <div className={styles.underline}></div>
          <p className={styles.gallerySubtitle}>
            Immerse yourself in 4K video expeditions, iconic wildlife captures, luxury lodge retreats,
            and prestigious conference destinations curated by CB S International.
          </p>
        </div>

        {/* Interactive Controls & Filter Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.topControlsRow}>
            {/* Media Type Switcher */}
            <div className={styles.mediaTypeSwitcher}>
              <button
                type="button"
                className={`${styles.mediaTypeBtn} ${mediaTypeFilter === 'all' ? styles.activeMediaType : ''}`}
                onClick={() => setMediaTypeFilter('all')}
              >
                <Sparkles size={16} />
                <span>All Media</span>
                <span className={styles.mediaTypeBadge}>{counts.total}</span>
              </button>

              <button
                type="button"
                className={`${styles.mediaTypeBtn} ${mediaTypeFilter === 'image' ? styles.activeMediaType : ''}`}
                onClick={() => setMediaTypeFilter('image')}
              >
                <ImageIcon size={16} />
                <span>Photos</span>
                <span className={styles.mediaTypeBadge}>{counts.photos}</span>
              </button>

              <button
                type="button"
                className={`${styles.mediaTypeBtn} ${mediaTypeFilter === 'video' ? styles.activeMediaType : ''}`}
                onClick={() => setMediaTypeFilter('video')}
              >
                <Film size={16} />
                <span>Videos</span>
                <span className={styles.mediaTypeBadge}>{counts.videos}</span>
              </button>
            </div>

            {/* Search Input */}
            <div className={styles.searchBoxWrapper}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search wildlife, lodges, Serengeti, Mara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className={styles.utilityControls}>
              <SlidersHorizontal size={16} color="#64748b" />
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort gallery items"
              >
                <option value="featured">Featured & Best</option>
                <option value="likes">Most Popular (Likes)</option>
                <option value="newest">Newest Additions</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className={styles.categoryPills}>
            {GALLERY_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                className={`${styles.categoryPill} ${activeCategory === cat ? styles.activeCategory : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Summary Row */}
          <div className={styles.resultsSummary}>
            <span>Showing <strong>{filteredItems.length}</strong> safari {filteredItems.length === 1 ? 'item' : 'moments'}</span>
            {searchQuery && <span>Filter: &quot;{searchQuery}&quot;</span>}
          </div>
        </div>

        {/* Empty State when no filters match */}
        {filteredItems.length === 0 && !loading && (
          <div className={styles.emptyState}>
            <Film className={styles.emptyIcon} size={48} />
            <h3>No matching safari media found</h3>
            <p>Try modifying your search keywords or switching category filters.</p>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => {
                setActiveCategory('All');
                setMediaTypeFilter('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Media Grid */}
        <motion.div layout className={styles.galleryGrid}>
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const isLiked = !!userLikes[item.id];
              const isVideo = item.type === 'video';
              const displayImage = isVideo ? (item.posterUrl || item.mediaUrl) : item.mediaUrl;

              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className={styles.galleryItem}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className={styles.mediaWrapper}>
                    <img
                      src={displayImage}
                      alt={item.title}
                      className={styles.galleryMedia}
                      loading="lazy"
                    />

                    {/* Top Badges */}
                    <div className={styles.badgeContainer}>
                      <span className={`${styles.typeBadge} ${isVideo ? styles.videoTypeBadge : ''}`}>
                        {isVideo ? (
                          <>
                            <Play size={12} fill="#ffffff" /> 4K Video
                          </>
                        ) : (
                          <>
                            <ImageIcon size={12} /> Photo
                          </>
                        )}
                      </span>

                      {item.featured && (
                        <span className={styles.featuredBadge}>
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Play Indicator for Videos */}
                    {isVideo && (
                      <div className={styles.playIndicator} title="Watch video clip">
                        <Play size={24} fill="currentColor" />
                      </div>
                    )}
                  </div>

                  {/* Card Content Details */}
                  <div className={styles.itemDetails}>
                    <div className={styles.categoryLocationRow}>
                      <span className={styles.itemCategory}>{item.category}</span>
                      <span className={styles.itemLocation}>
                        <MapPin size={13} /> {item.location}
                      </span>
                    </div>

                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemDescription}>{item.description}</p>

                    <div className={styles.itemFooter}>
                      <button
                        type="button"
                        className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
                        onClick={(e) => handleLike(e, item.id)}
                        aria-label={`Like ${item.title}`}
                      >
                        <Heart size={15} fill={isLiked ? 'currentColor' : 'none'} />
                        <span>{item.likes || 0}</span>
                      </button>

                      <button type="button" className={styles.viewActionBtn}>
                        <span>{isVideo ? 'Watch Clip' : 'Explore View'}</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* =========================================================================
          LIGHTBOX / CINEMA EXPEDITION MODAL
          ========================================================================= */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={styles.modalHeader}>
                <div className={styles.modalTitleArea}>
                  <div className={styles.modalCategoryLocation}>
                    <span className={styles.modalCategory}>{selectedItem.category}</span>
                    <span className={styles.modalLocation}>
                      <MapPin size={14} /> {selectedItem.location}
                    </span>
                  </div>
                  <h2 className={styles.modalMainTitle}>{selectedItem.title}</h2>
                </div>

                <div className={styles.modalHeaderActions}>
                  <button
                    type="button"
                    className={`${styles.modalIconBtn} ${userLikes[selectedItem.id] ? styles.liked : ''}`}
                    onClick={(e) => handleLike(e, selectedItem.id)}
                    title="Like this capture"
                  >
                    <Heart size={18} fill={userLikes[selectedItem.id] ? '#e11d48' : 'none'} />
                  </button>

                  <button
                    type="button"
                    className={styles.modalIconBtn}
                    onClick={() => handleShare(selectedItem)}
                    title="Share capture"
                  >
                    <Share2 size={18} />
                  </button>

                  <button
                    type="button"
                    className={styles.modalIconBtn}
                    onClick={() => setSelectedItem(null)}
                    title="Close (Esc)"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Main Body */}
              <div className={styles.modalBody}>
                {/* Left: Media Viewport */}
                <div className={styles.modalMediaViewer}>
                  {/* Prev / Next Arrows */}
                  {filteredItems.length > 1 && (
                    <>
                      <button
                        type="button"
                        className={`${styles.navArrowBtn} ${styles.prevArrow}`}
                        onClick={() => navigateModal(-1)}
                        aria-label="Previous capture"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.navArrowBtn} ${styles.nextArrow}`}
                        onClick={() => navigateModal(1)}
                        aria-label="Next capture"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {selectedItem.type === 'video' ? (
                    selectedItem.videoEmbedUrl ? (
                      <iframe
                        src={selectedItem.videoEmbedUrl}
                        title={selectedItem.title}
                        className={styles.modalVideoPlayer}
                        style={{ height: '480px', border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        key={selectedItem.mediaUrl}
                        src={selectedItem.mediaUrl}
                        poster={selectedItem.posterUrl}
                        controls
                        autoPlay
                        playsInline
                        className={styles.modalVideoPlayer}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )
                  ) : (
                    <img
                      src={selectedItem.mediaUrl}
                      alt={selectedItem.title}
                      className={styles.modalFullImage}
                    />
                  )}
                </div>

                {/* Right: Sidebar Story & Details */}
                <div className={styles.modalSidebar}>
                  <div>
                    <span className={styles.sidebarSectionTitle}>Safari Story & Details</span>
                    <p className={styles.sidebarDescription}>
                      {selectedItem.description || 'Experience the untouched landscapes and majestic wildlife of East Africa with our certified safari guides and luxury logistical planning.'}
                    </p>
                  </div>

                  <div className={styles.sidebarMetaGrid}>
                    <div className={styles.sidebarMetaItem}>
                      <span>Format</span>
                      <strong>{selectedItem.type === 'video' ? '🎬 4K Safari Video' : '📷 High-Res Photograph'}</strong>
                    </div>
                    <div className={styles.sidebarMetaItem}>
                      <span>Location</span>
                      <strong>{selectedItem.location}</strong>
                    </div>
                    {selectedItem.author && (
                      <div className={styles.sidebarMetaItem}>
                        <span>Curator / Guide</span>
                        <strong>{selectedItem.author}</strong>
                      </div>
                    )}
                    {selectedItem.dateAdded && (
                      <div className={styles.sidebarMetaItem}>
                        <span>Recorded</span>
                        <strong>{selectedItem.dateAdded}</strong>
                      </div>
                    )}
                    <div className={styles.sidebarMetaItem}>
                      <span>Appreciation</span>
                      <strong>{selectedItem.likes || 0} Explorer Likes</strong>
                    </div>
                  </div>

                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div>
                      <span className={styles.sidebarSectionTitle}>Tags</span>
                      <div className={styles.tagsCloud}>
                        {selectedItem.tags.map((tag, idx) => (
                          <span key={idx} className={styles.tagChip}>#{tag.replace(/^#/, '')}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions & Inquiry CTA */}
                  <div className={styles.modalInquiryCta}>
                    <button
                      type="button"
                      className={styles.modalBookBtn}
                      onClick={() => handleInquireSafari(selectedItem)}
                    >
                      <MessageCircle size={18} />
                      <span>Book Safari to This Spot</span>
                    </button>

                    <button
                      type="button"
                      className={styles.modalShareBtn}
                      onClick={() => handleShare(selectedItem)}
                    >
                      <Share2 size={16} />
                      <span>Share Visual Experience</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toast */}
      {toastMessage && (
        <div className={styles.toastNotice}>
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};

export default Gallery;