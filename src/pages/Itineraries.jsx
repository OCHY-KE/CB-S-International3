import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, ChevronRight, Compass, Search, Video, Play, X, Eye, Sparkles } from 'lucide-react';
import { supabase } from '../supabaseClient';
import SEO from '../components/SEO';
import styles from '../styles/Itineraries.module.css';

const Itineraries = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeVideoModal, setActiveVideoModal] = useState(null); // { url, title, location }
  const navigate = useNavigate();

  const categories = ['All', 'Safari & Adventure', 'Luxury Safari', 'Mid-Range Safari', 'Corporate Retreat'];

  useEffect(() => {
    fetchPublicPackages();
  }, []);

  // Lock scroll when video modal is open
  useEffect(() => {
    if (activeVideoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeVideoModal]);

  const fetchPublicPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error or table empty, loading defaults:', error.message);
      }
      
      if (data && data.length > 0) {
        setPackages(data);
      } else {
        // Fallback demo packages with rich video & photo assets if database is empty
        setPackages([
          {
            id: 'sample-mara-migration',
            title: '4-Day Masai Mara Great Migration & Big Cats Safari',
            duration: '4 Days / 3 Nights',
            category: 'Safari & Adventure',
            route: 'Nairobi → Masai Mara National Reserve → Nairobi',
            created_at: new Date().toISOString(),
            days: [
              {
                day: 1,
                location: 'Masai Mara Game Reserve',
                activity: 'Morning flight from Wilson Airport, afternoon 4x4 game drive across the savannah plains.',
                media: {
                  images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'],
                  video: 'https://res.cloudinary.com/demo/video/upload/sp_auto/sea-turtle.mp4'
                }
              },
              {
                day: 2,
                location: 'Mara River & Talek Crossing',
                activity: 'Full-day migration tracking, hippos & crocodiles at the Mara River, sunset bush sundowner.',
                media: {
                  images: ['https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'],
                  video: ''
                }
              }
            ]
          },
          {
            id: 'sample-amboseli-kilimanjaro',
            title: '3-Day Amboseli Elephant Sanctuary & Kilimanjaro Views',
            duration: '3 Days / 2 Nights',
            category: 'Luxury Safari',
            route: 'Nairobi → Amboseli National Park → Nairobi',
            created_at: new Date().toISOString(),
            days: [
              {
                day: 1,
                location: 'Amboseli National Park',
                activity: 'Arrival at luxury tented camp with iconic views of Mount Kilimanjaro and elephant herds.',
                media: {
                  images: ['https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80'],
                  video: 'https://res.cloudinary.com/demo/video/upload/q_auto/docs/elephants.mp4'
                }
              }
            ]
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract package media details
  const getPackageMedia = (pkg) => {
    // Find all videos in days or root
    const dayVideos = pkg.days?.map((d) => d.media?.video).filter(Boolean) || [];
    const directVideo = pkg.video || pkg.video_url || null;
    const allVideos = directVideo ? [directVideo, ...dayVideos] : dayVideos;
    const primaryVideo = allVideos[0] || null;

    // Find all images in days or root
    const dayImages = pkg.days?.flatMap((d) => d.media?.images || []).filter(Boolean) || [];
    const directImage = pkg.image || null;
    const primaryImage =
      directImage ||
      dayImages[0] ||
      pkg.days?.[0]?.media?.images?.[0] ||
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80';

    return {
      primaryImage,
      primaryVideo,
      allVideos,
      totalPhotos: dayImages.length || (directImage ? 1 : 0),
      hasVideo: Boolean(primaryVideo)
    };
  };

  // Filter packages based on active category
  const filteredPackages = useMemo(() => {
    return activeCategory === 'All'
      ? packages
      : packages.filter((pkg) => pkg.category === activeCategory);
  }, [activeCategory, packages]);

  return (
    <div className={styles.container}>
      <SEO 
        title="Safari Itineraries | Explore East Africa" 
        description="Discover hand-crafted safari itineraries designed for unforgettable adventures across Kenya and beyond, featuring high-resolution photos and video tours."
      />

      {/* --- HERO SECTION --- */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.tagline}>
            <Compass size={16} /> Explore Kenya & Beyond
          </span>
          <h1>Curated Safari <br /><span>Experiences</span></h1>
          <p>Hand-crafted journeys designed for the soul of adventure. Explore itineraries with real 4K footage & photo galleries.</p>
        </div>
      </section>

      {/* --- FILTER BAR --- */}
      <div className={styles.stickyFilterContainer}>
        <div className={styles.filterBar}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className={styles.contentWrapper}>
        {loading ? (
          <div className={styles.loadingArea}>
            <div className={styles.spinner}></div>
            <p>Gathering our best adventures & video tours for you...</p>
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className={styles.grid}>
            {filteredPackages.map((pkg) => {
              const { primaryImage, primaryVideo, allVideos, hasVideo } = getPackageMedia(pkg);

              return (
                <article 
                  key={pkg.id} 
                  className={styles.card}
                  onClick={() => navigate(`/itineraries/${pkg.id}`)}
                  aria-label={`View details for ${pkg.title}`}
                >
                  <div className={styles.cardImageWrapper}>
                    <img 
                      src={primaryImage} 
                      alt={pkg.title}
                      loading="lazy"
                    />
                    
                    <div className={styles.categoryBadge}>{pkg.category}</div>

                    {/* Video Badge & Play Trigger */}
                    {hasVideo && (
                      <div className={styles.mediaBadgesRow}>
                        <span className={styles.videoBadge} title="Includes video tour">
                          <Video size={13} />
                          <span>{allVideos.length > 1 ? `${allVideos.length} Videos` : 'Video Tour'}</span>
                        </span>
                      </div>
                    )}

                    {hasVideo && (
                      <button
                        type="button"
                        className={styles.playButtonOverlay}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVideoModal({
                            url: primaryVideo,
                            title: pkg.title,
                            duration: pkg.duration,
                            location: pkg.days?.[0]?.location || pkg.route
                          });
                        }}
                        title="Watch Itinerary Video Preview"
                        aria-label="Play video preview"
                      >
                        <Play size={20} className={styles.playIcon} />
                      </button>
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <h3>{pkg.title}</h3>
                      <div className={styles.duration}>
                        <Clock size={14} />
                        <span>{pkg.duration}</span>
                      </div>
                    </div>

                    <div className={styles.routeRow}>
                      <MapPin size={14} className={styles.pinIcon} />
                      <span>{pkg.route}</span>
                    </div>

                    <div className={styles.cardFooter}>
                      <div className={styles.stopsCount}>
                        <strong>{pkg.days?.length || 0}</strong> Destinations
                        {hasVideo && <span className={styles.videoIndicator}> • 🎬 Video</span>}
                      </div>
                      <div className={styles.cta}>
                        Explore Details <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Search size={48} />
            <h3>No itineraries found</h3>
            <p>We don't have any packages in the <strong>{activeCategory}</strong> category at the moment. Try checking "All" or contact us for a custom request!</p>
            <button onClick={() => setActiveCategory('All')} className={styles.resetBtn}>
              View All Packages
            </button>
          </div>
        )}
      </main>

      {/* --- VIDEO PREVIEW MODAL --- */}
      {activeVideoModal && (
        <div 
          className={styles.videoModalBackdrop}
          onClick={() => setActiveVideoModal(null)}
        >
          <div 
            className={styles.videoModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.videoModalHeader}>
              <div className={styles.videoModalTitle}>
                <span className={styles.videoLiveBadge}>
                  <Sparkles size={14} /> Video Preview
                </span>
                <h3>{activeVideoModal.title}</h3>
                {activeVideoModal.location && (
                  <p><MapPin size={13} /> {activeVideoModal.location} • {activeVideoModal.duration}</p>
                )}
              </div>
              <button 
                type="button" 
                className={styles.closeVideoBtn}
                onClick={() => setActiveVideoModal(null)}
                aria-label="Close video preview"
              >
                <X size={22} />
              </button>
            </div>

            <div className={styles.videoPlayerContainer}>
              <video 
                src={activeVideoModal.url} 
                controls 
                autoPlay 
                playsInline
                className={styles.modalVideo}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className={styles.videoModalFooter}>
              <button 
                className={styles.modalFullDetailsBtn}
                onClick={() => {
                  const currentPkg = packages.find(p => p.title === activeVideoModal.title);
                  if (currentPkg) {
                    navigate(`/itineraries/${currentPkg.id}`);
                  }
                  setActiveVideoModal(null);
                }}
              >
                <Eye size={16} />
                <span>View Full Day-by-Day Itinerary</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Itineraries;