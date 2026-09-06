import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Play, X, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import styles from '../../styles/IS.module.css';

const ItinerariesSection = () => {
  const visibleCount = 7;
  const [allPool, setAllPool] = useState(fallbackData); // All fetched items
  const [displayItems, setDisplayItems] = useState(() => getDisplayItems(fallbackData, visibleCount));
  const [fadeIndex, setFadeIndex] = useState(null); // Which index is currently fading
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
          .limit(12) // Fetch more than we show for shuffling
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

  // Shuffle Logic: Swaps one item at a time every 5 seconds
  useEffect(() => {
    if (allPool.length <= visibleCount) return;

    timerRef.current = setInterval(() => {
      const randomIndexToReplace = Math.floor(Math.random() * visibleCount);
      
      // 2. Start fade out
      setFadeIndex(randomIndexToReplace);

      replaceTimerRef.current = setTimeout(() => {
        setDisplayItems(prevDisplay => {
          const newDisplay = [...prevDisplay];
          // 3. Find an item in allPool that isn't currently displayed
          const currentlyDisplayedIds = newDisplay.map(item => item.id);
          const availableInPool = allPool.filter(item => !currentlyDisplayedIds.includes(item.id));
          
          if (availableInPool.length > 0) {
            const nextItem = availableInPool[Math.floor(Math.random() * availableInPool.length)];
            newDisplay[randomIndexToReplace] = nextItem;
          }
          return newDisplay;
        });
        
        // 4. Fade back in
        fadeInTimerRef.current = setTimeout(() => setFadeIndex(null), 50);
      }, 800); // Wait for fade out duration

    }, 5000); // Swap every 5 seconds

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
          <span className={styles.kicker}><Sparkles size={16} /> Signature Collections</span>
          <h2 className={styles.title}>Plan Your <span>Next Stop</span></h2>
          <p className={styles.intro}>
            Handpicked journeys across Kenya and Tanzania, shaped around the places and wildlife you want to remember.
          </p>
        </div>
        <button className={styles.viewAllBtn} onClick={() => navigate('/itineraries')}>
          Explore all journeys <ArrowRight size={18} />
        </button>
      </div>

      <div className={styles.landscapeGrid}>
        {displayItems[0] && (() => {
          const pkg = displayItems[0];
          const { primaryImage, primaryVideo, hasVideo } = getPackageMedia(pkg);
          return (
            <article
              className={`${styles.gridItem} ${styles.featured} ${fadeIndex === 0 ? styles.fadeOut : styles.fadeIn}`}
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
              <div className={styles.mediaWrapper}>
                <img src={primaryImage} alt={pkg.title} className={styles.media} />
                {hasVideo && (
                  <button
                    className={styles.playBtn}
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveVideo({ url: primaryVideo, title: pkg.title });
                    }}
                    aria-label={`Watch ${pkg.title} video`}
                  >
                    <Play fill="white" size={24} />
                  </button>
                )}
              </div>
              <div className={styles.featuredInfo}>
                <span className={styles.tag}>{pkg.category}</span>
                <h3>{pkg.title}</h3>
                <div className={styles.meta}>
                  <span><Clock size={14} /> {pkg.duration}</span>
                  <span><MapPin size={14} /> {pkg.route?.split('→')[0]}</span>
                </div>
                <span className={styles.exploreCue}>View itinerary <ArrowRight size={15} /></span>
              </div>
            </article>
          );
        })()}

        <div className={styles.supportingGrid}>
          {displayItems.slice(1).map((pkg, index) => {
            const { primaryImage, primaryVideo, hasVideo } = getPackageMedia(pkg);
            const itemIndex = index + 1;
            return (
              <article
                key={pkg.id}
                className={`${styles.gridItem} ${styles.supportingCard} ${fadeIndex === itemIndex ? styles.fadeOut : styles.fadeIn}`}
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
                <div className={styles.mediaWrapper}>
                  <img src={primaryImage} alt={pkg.title} className={styles.media} />
                  {hasVideo && (
                    <button
                      className={styles.playBtn}
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveVideo({ url: primaryVideo, title: pkg.title });
                      }}
                      aria-label={`Watch ${pkg.title} video`}
                    >
                      <Play fill="white" size={18} />
                    </button>
                  )}
                </div>
                <div className={styles.supportingInfo}>
                  <span className={styles.tag}>{pkg.category}</span>
                  <h3>{pkg.title}</h3>
                  <div className={styles.meta}>
                    <span><Clock size={13} /> {pkg.duration}</span>
                    <span className={styles.routeMeta}>
                      <MapPin size={13} />
                      <span className={styles.routeText}>{pkg.route}</span>
                    </span>
                  </div>
                  <span className={styles.supportingAction}>View journey <ArrowRight size={14} /></span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {activeVideo && (
        <div className={styles.modalOverlay} onClick={() => setActiveVideo(null)}>
          <div className={styles.modalBody} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setActiveVideo(null)}><X /></button>
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
    { id: '1', title: 'The Great Migration', duration: '5 Days', category: 'Safari', route: 'Masai Mara', image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200' },
    { id: '2', title: 'Amboseli Escape', duration: '3 Days', category: 'Luxury Safari', route: 'Amboseli', image_url: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200' },
    { id: '3', title: 'Diani Retreat', duration: '4 Days', category: 'Beach', route: 'Diani', image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200' },
    { id: '4', title: 'Tsavo West', duration: '3 Days', category: 'Wildlife', route: 'Tsavo', image_url: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200' },
    { id: '5', title: 'Samburu Explorer', duration: '4 Days', category: 'Cultural', route: 'Samburu', image_url: 'https://images.unsplash.com/photo-1523805081446-eb9a40e2b710?auto=format&fit=crop&w=1200' },
    { id: '6', title: 'Mount Kenya', duration: '6 Days', category: 'Adventure', route: 'Nanyuki', image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200' },
    { id: '7', title: 'Kilifi Coast', duration: '3 Days', category: 'Beach', route: 'Kilifi', image_url: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1200' },
    { id: '8', title: 'Naivasha Day Trip', duration: '1 Day', category: 'Adventure', route: 'Naivasha', image_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200' }
];

export default ItinerariesSection;