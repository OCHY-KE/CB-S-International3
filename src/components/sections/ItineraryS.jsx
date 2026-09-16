import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Play, X, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import styles from '../../styles/IS.module.css';

const ItinerariesSection = () => {
  const visibleCount = 7;
  const [allPool, setAllPool] = useState(fallbackData);
  const [displayItems, setDisplayItems] = useState(() => getDisplayItems(fallbackData, visibleCount));
  const [fadeIndex, setFadeIndex] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const navigate = useNavigate();
  
  const timerRef = useRef(null);
  const replaceTimerRef = useRef(null);
  const fadeInTimerRef = useRef(null);

  const getPackageMedia = (pkg) => {
    if (!pkg) return {};
    const dayVideos = pkg.days?.map((d) => d.media?.video).filter(Boolean) || [];
    const primaryVideo = pkg.video_url || dayVideos[0] || null;
    const primaryImage = pkg.image_url || pkg.days?.[0]?.media?.images?.[0] || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200';
    return { primaryImage, primaryVideo, hasVideo: !!primaryVideo };
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await supabase
          .from('itineraries')
          .select('*')
          .limit(12)
          .order('created_at', { ascending: false });

        const pool = data?.length > 0 ? data : fallbackData;
        setAllPool(pool);
        setDisplayItems(getDisplayItems(pool, visibleCount));
      } catch (err) {
        setAllPool(fallbackData);
        setDisplayItems(getDisplayItems(fallbackData, visibleCount));
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    if (allPool.length <= visibleCount) return;

    timerRef.current = setInterval(() => {
      const randomIndexToReplace = Math.floor(Math.random() * visibleCount);
      setFadeIndex(randomIndexToReplace);

      replaceTimerRef.current = setTimeout(() => {
        setDisplayItems(prevDisplay => {
          const newDisplay = [...prevDisplay];
          const currentlyDisplayedIds = newDisplay.map(item => item.id);
          const availableInPool = allPool.filter(item => !currentlyDisplayedIds.includes(item.id));
          
          if (availableInPool.length > 0) {
            const nextItem = availableInPool[Math.floor(Math.random() * availableInPool.length)];
            newDisplay[randomIndexToReplace] = nextItem;
          }
          return newDisplay;
        });
        
        fadeInTimerRef.current = setTimeout(() => setFadeIndex(null), 50);
      }, 400);

    }, 6000);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(replaceTimerRef.current);
      clearTimeout(fadeInTimerRef.current);
    };
  }, [allPool]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.headerContainer}>
        <div className={styles.titleGroup}>
          <span className={styles.kicker}>
            <Sparkles size={14} /> Signature Journeys
          </span>
          <h2 className={styles.title}>Plan Your <span>Next Stop</span></h2>
          <p className={styles.intro}>
            Curated journeys across Kenya and Tanzania, built around raw landscapes and unforgettable wildlife encounters.
          </p>
        </div>
        <button className={styles.viewAllBtn} onClick={() => navigate('/itineraries')}>
          Explore all <ArrowRight size={16} />
        </button>
      </div>

      <div className={styles.editorialGrid}>
        {displayItems[0] && (() => {
          const pkg = displayItems[0];
          const { primaryImage, primaryVideo, hasVideo } = getPackageMedia(pkg);
          return (
            <article
              className={`${styles.featuredCard} ${fadeIndex === 0 ? styles.fadeOut : ''}`}
              onClick={() => navigate(`/itineraries/${pkg.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate(`/itineraries/${pkg.id}`);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${pkg.title} itinerary`}
            >
              <div className={styles.imageContainer}>
                <img src={primaryImage} alt={pkg.title} className={styles.cardImage} />
                <span className={styles.categoryBadge}>{pkg.category}</span>
                {hasVideo && (
                  <button
                    className={styles.playIconButton}
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveVideo({ url: primaryVideo, title: pkg.title });
                    }}
                    aria-label={`Watch ${pkg.title} video`}
                  >
                    <Play size={18} fill="currentColor" />
                  </button>
                )}
              </div>
              <div className={styles.featuredContent}>
                <h3 className={styles.featuredTitle}>{pkg.title}</h3>
                <div className={styles.metaRow}>
                  <span><Clock size={13} /> {pkg.duration}</span>
                  <span><MapPin size={13} /> {pkg.route?.split('→')[0]}</span>
                </div>
                <div className={styles.actionLink}>
                  <span>Read Itinerary</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </article>
          );
        })()}

        <div className={styles.secondaryGrid}>
          {displayItems.slice(1).map((pkg, index) => {
            const { primaryImage, primaryVideo, hasVideo } = getPackageMedia(pkg);
            const itemIndex = index + 1;
            return (
              <article
                key={pkg.id}
                className={`${styles.standardCard} ${fadeIndex === itemIndex ? styles.fadeOut : ''}`}
                onClick={() => navigate(`/itineraries/${pkg.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`/itineraries/${pkg.id}`);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View ${pkg.title} itinerary`}
              >
                <div className={styles.imageContainer}>
                  <img src={primaryImage} alt={pkg.title} className={styles.cardImage} />
                  <span className={styles.categoryBadge}>{pkg.category}</span>
                  {hasVideo && (
                    <button
                      className={styles.playIconButton}
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveVideo({ url: primaryVideo, title: pkg.title });
                      }}
                      aria-label={`Watch ${pkg.title} video`}
                    >
                      <Play size={14} fill="currentColor" />
                    </button>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{pkg.title}</h3>
                  <div className={styles.metaRow}>
                    <span><Clock size={12} /> {pkg.duration}</span>
                    <span className={styles.routeText}>
                      <MapPin size={12} /> {pkg.route}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {activeVideo && (
        <div className={styles.modalOverlay} onClick={() => setActiveVideo(null)}>
          <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setActiveVideo(null)} aria-label="Close modal">
              <X size={20} />
            </button>
            <video src={activeVideo.url} controls autoPlay className={styles.mainVideo} />
          </div>
        </div>
      )}
    </section>
  );
};

const getDisplayItems = (pool, visibleCount) => {
  const poolIds = new Set(pool.map((item) => item.id));
  const supplementalItems = fallbackData.filter((item) => !poolIds.has(item.id));
  return [...pool, ...supplementalItems].slice(0, visibleCount);
};

const fallbackData = [
  { id: '1', title: 'The Great Migration Safari', duration: '5 Days', category: 'Safari', route: 'Masai Mara', image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200' },
  { id: '2', title: 'Amboseli Elephant Escape', duration: '3 Days', category: 'Luxury', route: 'Amboseli', image_url: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200' },
  { id: '3', title: 'Diani Beach Sanctuary', duration: '4 Days', category: 'Beach', route: 'Diani', image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200' },
  { id: '4', title: 'Tsavo Wilderness Trail', duration: '3 Days', category: 'Wildlife', route: 'Tsavo West', image_url: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200' },
  { id: '5', title: 'Samburu Cultural Journey', duration: '4 Days', category: 'Culture', route: 'Samburu', image_url: 'https://images.unsplash.com/photo-1523805081446-eb9a40e2b710?auto=format&fit=crop&w=1200' },
  { id: '6', title: 'Mount Kenya Summit Trek', duration: '6 Days', category: 'Trek', route: 'Nanyuki', image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200' },
  { id: '7', title: 'Kilifi Coastal Expedition', duration: '3 Days', category: 'Beach', route: 'Kilifi', image_url: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1200' }
];

export default ItinerariesSection;