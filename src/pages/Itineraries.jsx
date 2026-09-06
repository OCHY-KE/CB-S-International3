import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, ChevronRight, Compass, Search, Video, Play, X, Eye, Sparkles, Filter } from 'lucide-react';
import { supabase } from '../supabaseClient';
import SEO from '../components/SEO';
import styles from '../styles/Itineraries.module.css';

const Itineraries = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const navigate = useNavigate();

  const categories = ['All', 'Safari & Adventure', 'Luxury Safari', 'Mid-Range Safari', 'Corporate Retreat'];

  useEffect(() => {
    fetchPublicPackages();
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeVideoModal ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeVideoModal]);

  const fetchPublicPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setPackages(data);
      } else {
        // Fallback demo data
        setPackages([
          {
            id: 'sample-mara',
            title: '4-Day Masai Mara Great Migration',
            duration: '4 Days / 3 Nights',
            category: 'Safari & Adventure',
            route: 'Nairobi → Masai Mara → Nairobi',
            days: [{ location: 'Masai Mara', media: { video: 'https://res.cloudinary.com/demo/video/upload/sp_auto/sea-turtle.mp4' } }],
            image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'
          },
          {
            id: 'sample-amboseli',
            title: '3-Day Amboseli Elephant Sanctuary',
            duration: '3 Days / 2 Nights',
            category: 'Luxury Safari',
            route: 'Nairobi → Amboseli → Nairobi',
            days: [{ location: 'Amboseli', media: { video: 'https://res.cloudinary.com/demo/video/upload/q_auto/docs/elephants.mp4' } }],
            image_url: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80'
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPackageMedia = (pkg) => {
    const dayVideos = pkg.days?.map((d) => d.media?.video).filter(Boolean) || [];
    const primaryVideo = pkg.video_url || dayVideos[0] || null;
    const primaryImage = pkg.image_url || pkg.days?.[0]?.media?.images?.[0] || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80';

    return { primaryImage, primaryVideo, hasVideo: !!primaryVideo };
  };

  const filteredPackages = useMemo(() => {
    return activeCategory === 'All' ? packages : packages.filter(p => p.category === activeCategory);
  }, [activeCategory, packages]);

  return (
    <div className={styles.container}>
      <SEO title="Safari Itineraries | Explore East Africa" />

      <header className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Compass size={14} /> <span>Unforgettable Journeys</span>
          </div>
          <h1>Curated <span>Safari</span> <br /> Experiences</h1>
          <p>Discover the heart of Africa through expertly crafted itineraries, immersive 4K previews, and breathtaking landscapes.</p>
        </div>
      </header>

      <nav className={styles.stickyFilterContainer}>
        <div className={styles.filterWrapper}>
          <div className={styles.filterLabel}>
            <Filter size={16} /> <span>Filter by:</span>
          </div>
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
      </nav>

      <main className={styles.mainContent}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loader}></div>
            <p>Preparing your adventure...</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredPackages.map((pkg, index) => {
              const { primaryImage, primaryVideo, hasVideo } = getPackageMedia(pkg);
              return (
                <article
                  key={pkg.id}
                  className={`${styles.card} ${index === 0 ? styles.featuredCard : ''}`}
                  onClick={() => navigate(`/itineraries/${pkg.id}`)}
                >
                  <div className={styles.imageSection}>
                    <img src={primaryImage} alt={pkg.title} loading="lazy" />
                    <div className={styles.cardCategory}>{pkg.category}</div>
                    {hasVideo && (
                      <button 
                        className={styles.playTrigger}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVideoModal({ url: primaryVideo, title: pkg.title, duration: pkg.duration });
                        }}
                      >
                        <Play fill="currentColor" size={20} />
                      </button>
                    )}
                  </div>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardMeta}>
                      <span className={styles.storyLabel}>{index === 0 ? 'Featured journey' : `Journey ${String(index + 1).padStart(2, '0')}`}</span>
                      <span className={styles.durationTag}><Clock size={14} /> {pkg.duration}</span>
                    </div>
                    <h3>{pkg.title}</h3>
                    <div className={styles.location}>
                      <MapPin size={14} /> <span>{pkg.route}</span>
                    </div>
                    <div className={styles.cardAction}>
                      <span>Explore Itinerary</span>
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {activeVideoModal && (
        <div className={styles.modal} onClick={() => setActiveVideoModal(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.liveTag}><Sparkles size={12} /> Video Tour</span>
                <h4>{activeVideoModal.title}</h4>
              </div>
              <button className={styles.closeBtn} onClick={() => setActiveVideoModal(null)}><X /></button>
            </div>
            <video src={activeVideoModal.url} controls autoPlay className={styles.videoPlayer} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Itineraries;