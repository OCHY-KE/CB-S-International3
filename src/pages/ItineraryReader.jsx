import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, MapPin, MessageCircle, ArrowLeft, Share2, 
  Calendar, CheckCircle2, XCircle, Info, Tag, 
  Users, Sun, Camera, ShieldCheck 
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import SEO from '../components/SEO';
import styles from '../styles/ItineraryReader.module.css';

const ItineraryReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  const WHATSAPP_PHONE = '254722774952';

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  const fetchPackageDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error:', error);
      navigate('/itineraries');
    } else {
      setPkg(data);
    }
    setLoading(false);
  };

  const handleWhatsAppBooking = () => {
    const message = `Hello! I'm interested in the "${pkg.title}" (${pkg.duration}) safari. Please share current rates and availability.`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return (
    <div className={styles.loaderPage}>
      <div className={styles.spinner}></div>
      <p>Mapping your adventure...</p>
    </div>
  );

  if (!pkg) return null;

  return (
    <div className={styles.container}>
      <SEO title={`${pkg.title} | Safari Itinerary`} description={pkg.route} />

      {/* Floating Header */}
      <nav className={styles.floatingNav}>
        <button onClick={() => navigate('/itineraries')} className={styles.iconCircle}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.navActions}>
          <button className={styles.iconCircle} onClick={() => navigator.share({title: pkg.title, url: window.location.href})}>
            <Share2 size={20} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <img src={pkg.days?.[0]?.media?.images?.[0]} alt="" className={styles.heroImg} />
        <div className={styles.heroOverlay}>
          <div className={styles.heroText}>
            <span className={styles.badge}>{pkg.category}</span>
            <h1>{pkg.title}</h1>
            <div className={styles.quickFacts}>
              <span><Clock size={18} /> {pkg.duration}</span>
              <span><MapPin size={18} /> {pkg.route}</span>
              <span><Users size={18} /> Private/Group</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <main className={styles.main}>
          {/* Highlights Section */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <Camera size={22} className={styles.accentIcon} />
              <h2>Tour Highlights</h2>
            </div>
            <div className={styles.highlightsGrid}>
              {/* Assuming these might be in your DB or generic for Safaris */}
              <div className={styles.hCard}><CheckCircle2 size={16} /> Professional Guide</div>
              <div className={styles.hCard}><CheckCircle2 size={16} /> 4x4 Landcruiser</div>
              <div className={styles.hCard}><CheckCircle2 size={16} /> All Park Fees</div>
              <div className={styles.hCard}><CheckCircle2 size={16} /> Luxury Lodging</div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <Calendar size={22} className={styles.accentIcon} />
              <h2>Day-by-Day Experience</h2>
            </div>
            <div className={styles.timeline}>
              {pkg.days?.map((day, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineLeft}>
                    <div className={styles.dayBlob}>Day {day.day}</div>
                    <div className={styles.timelineLine}></div>
                  </div>
                  <div className={styles.timelineRight}>
                    <h3>{day.location}</h3>
                    <p className={styles.activity}>{day.activity}</p>
                    
                    {day.media?.images?.length > 0 && (
                      <div className={styles.gallery}>
                        {day.media.images.map((img, i) => (
                          <div key={i} className={styles.galleryItem}>
                            <img src={img} alt="" loading="lazy" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Inclusions & Exclusions */}
          <section className={styles.dualSection}>
            <div className={styles.box}>
              <h3>Included</h3>
              <ul>
                <li><CheckCircle2 size={18} className={styles.check} /> Ground transport in 4x4</li>
                <li><CheckCircle2 size={18} className={styles.check} /> Professional English guide</li>
                <li><CheckCircle2 size={18} className={styles.check} /> All park entry fees</li>
                <li><CheckCircle2 size={18} className={styles.check} /> Bottled water during game drives</li>
              </ul>
            </div>
            <div className={styles.box}>
              <h3>Excluded</h3>
              <ul>
                <li><XCircle size={18} className={styles.uncheck} /> International Flights</li>
                <li><XCircle size={18} className={styles.uncheck} /> Tourist Visa</li>
                <li><XCircle size={18} className={styles.uncheck} /> Travel Insurance</li>
                <li><XCircle size={18} className={styles.uncheck} /> Tipping & Gratitude</li>
              </ul>
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <div className={styles.priceTag}>
              <Tag size={20} />
              <span>Inquire for current rates</span>
            </div>
            <p className={styles.sidebarNote}>
              Each safari is tailored to your dates and preference.
            </p>
            <button className={styles.primaryBtn} onClick={handleWhatsAppBooking}>
              <MessageCircle size={20} />
              Reserve This Journey
            </button>
            <div className={styles.trustBadges}>
              <div className={styles.badgeItem}><ShieldCheck size={14} /> Secure Booking</div>
              <div className={styles.badgeItem}><Sun size={14} /> Best Season: Jun-Oct</div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h4>Need Customization?</h4>
            <p>Our experts can tweak this itinerary to fit your budget and schedule perfectly.</p>
          </div>
        </aside>
      </div>

      {/* Sticky Mobile Footer */}
      <div className={styles.mobileCta}>
        <div className={styles.mobilePrice}>
          <p>Ready to explore?</p>
          <span>{pkg.duration} Safari</span>
        </div>
        <button onClick={handleWhatsAppBooking} className={styles.mobileBookBtn}>
          Inquire Now
        </button>
      </div>
    </div>
  );
};

export default ItineraryReader;