import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, ChevronRight, Compass, Search } from 'lucide-react';
import { supabase } from '../supabaseClient';
import SEO from '../components/SEO';
import styles from '../styles/Itineraries.module.css';

const Itineraries = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Safari & Adventure', 'Luxury Safari', 'Mid-Range Safari', 'Corporate Retreat'];

  useEffect(() => {
    fetchPublicPackages();
  }, []);

  const fetchPublicPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching itineraries:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Optimization: useMemo filters the list only when category or packages change
  const filteredPackages = useMemo(() => {
    return activeCategory === 'All'
      ? packages
      : packages.filter((pkg) => pkg.category === activeCategory);
  }, [activeCategory, packages]);

  return (
    <div className={styles.container}>
      <SEO 
        title="Safari Itineraries | Explore East Africa" 
        description="Discover hand-crafted safari itineraries designed for unforgettable adventures across Kenya and beyond."
      />

      {/* --- HERO SECTION --- */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.tagline}>
            <Compass size={16} /> Explore Kenya & Beyond
          </span>
          <h1>Curated Safari <br /><span>Experiences</span></h1>
          <p>Hand-crafted journeys designed for the soul of adventure. Find your next great story here.</p>
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
            <p>Gathering our best adventures for you...</p>
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className={styles.grid}>
            {filteredPackages.map((pkg) => (
              <article 
                key={pkg.id} 
                className={styles.card}
                onClick={() => navigate(`/itineraries/${pkg.id}`)} // Corrected path to match App.js
                aria-label={`View details for ${pkg.title}`}
              >
                <div className={styles.cardImageWrapper}>
                  <img 
                    src={pkg.days?.[0]?.media?.images?.[0] || '/api/placeholder/800/600'} 
                    alt={pkg.title}
                    loading="lazy"
                  />
                  <div className={styles.categoryBadge}>{pkg.category}</div>
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
                    </div>
                    <div className={styles.cta}>
                      Explore <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
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
    </div>
  );
};

export default Itineraries;