import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, MapPin, MessageCircle, ArrowLeft, Share2, 
  Calendar, CheckCircle2, XCircle, 
  Users, Camera, Video, Play, X, Sparkles, Image as ImageIcon,
  ShieldCheck, Headphones, Send, Check
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import SEO from '../components/SEO';
import ItineraryGallery from '../components/ItineraryGallery';
import MarkdownContent from '../components/MarkdownContent';
import styles from '../styles/ItineraryReader.module.css';

const DEFAULT_SAMPLES = [
  // ... (keeping your samples as provided)
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
  }
];

const ItineraryReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  const WHATSAPP_PHONE = '254722774952';

  useEffect(() => {
    const fetchPackageDetails = async () => {
      setLoading(true);
      try {
        const sampleMatch = DEFAULT_SAMPLES.find((s) => s.id === id);
        if (sampleMatch) {
          setPkg(sampleMatch);
          return;
        }

        const { data, error } = await supabase
          .from('itineraries')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          setPkg(DEFAULT_SAMPLES[0]); 
        } else {
          setPkg(data);
        }
      } catch (err) {
        navigate('/itineraries');
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id, navigate]);

  useEffect(() => {
    document.body.style.overflow = activeVideoModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeVideoModal]);

  const handleWhatsAppBooking = () => {
    if (!pkg) return;
    const message = `Hello! I'm interested in the "${pkg.title}" (${pkg.duration}) safari. Please share rates and availability.`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = async () => {
    const shareData = { title: pkg.title, url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard?.writeText(window.location.href);
  };

  const allMediaItems = useMemo(() => {
    if (!pkg) return [];
    const list = [];
    if (pkg.image) list.push({ type: 'image', url: pkg.image, title: 'Cover', location: pkg.route });
    
    pkg.days?.forEach(day => {
      if (day.media?.video) list.push({ type: 'video', url: day.media.video, title: `Day ${day.day} Reel`, location: day.location });
      day.media?.images?.forEach((img, i) => list.push({ type: 'image', url: img, title: `Day ${day.day} - View ${i+1}`, location: day.location }));
    });
    return list;
  }, [pkg]);

  if (loading) return (
    <div className={styles.loaderPage}>
      <div className={styles.spinner}></div>
      <p>Curating your journey...</p>
    </div>
  );

  if (!pkg) return null;

  return (
    <div className={styles.container}>
      <SEO title={`${pkg.title} | Safari Itinerary`} description={pkg.route} />

      <nav className={styles.floatingNav}>
        <button aria-label="Back to itineraries" onClick={() => navigate('/itineraries')} className={styles.iconCircle}><ArrowLeft size={20} /></button>
        <div className={styles.navActions}>
          <button aria-label="Share itinerary" className={styles.iconCircle} onClick={handleShare}><Share2 size={20} /></button>
        </div>
      </nav>

      <header className={styles.hero}>
        <img src={pkg.image || allMediaItems[0]?.url} alt="" className={styles.heroImg} />
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>{pkg.category}</span>
            <h1>{pkg.title}</h1>
            <div className={styles.quickFacts}>
              <span><Clock size={18} /> {pkg.duration}</span>
              <span className={styles.routeFact}><MapPin size={18} /> {pkg.route}</span>
              <span><Users size={18} /> Private Safari</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.contentLayout}>
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Sparkles size={20} className={styles.accent} />
              <h2>Experience Highlights</h2>
            </div>
            <p className={styles.sectionIntro}>Everything arranged for a smooth, unhurried safari experience.</p>
            <div className={styles.highlightsGrid}>
              {['Professional Guide', '4x4 Landcruiser', 'All Park Fees', 'Luxury Lodging'].map((h, i) => (
                <div key={i} className={styles.hCard}><CheckCircle2 size={16} /> {h}</div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Calendar size={20} className={styles.accent} />
              <h2>Your Journey</h2>
            </div>
            <p className={styles.sectionIntro}>A day-by-day view of the places, wildlife, and moments ahead.</p>
            <div className={styles.timeline}>
              {pkg.days?.map((day, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>
                    <div className={styles.dayCircle}>{day.day}</div>
                    <div className={styles.line}></div>
                  </div>
                  <div className={styles.timelineContent}>
                    <h3>{day.location}</h3>
                    <MarkdownContent>{day.activity}</MarkdownContent>
                    {day.media?.video && (
                      <button className={styles.inlineVideoBtn} onClick={() => setActiveVideoModal({url: day.media.video, title: day.location})}>
                        <Play size={14} fill="currentColor" /> Watch Day {day.day} Footage
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <ItineraryGallery media={allMediaItems} title="Safari Gallery" onInquire={handleWhatsAppBooking} />

          <div className={styles.inclusionExclusion}>
            <div className={styles.incBox}>
              <h3>What's Included</h3>
              <ul>
                <li><CheckCircle2 size={18} /> Full board accommodation</li>
                <li><CheckCircle2 size={18} /> Professional English speaking guide</li>
                <li><CheckCircle2 size={18} /> All game drives in 4x4 vehicles</li>
              </ul>
            </div>
            <div className={styles.excBox}>
              <h3>Not Included</h3>
              <ul>
                <li><XCircle size={18} /> International flight tickets</li>
                <li><XCircle size={18} /> Visas and personal insurance</li>
              </ul>
            </div>
          </div>
        </main>

        <aside className={styles.sidebar}>
          <div className={styles.stickyCard}>
            <div className={styles.cardHeader}>
              <ShieldCheck size={20} />
              <span>Tailor-Made Available</span>
            </div>
            <h3>Interested in this Safari?</h3>
            <p>Our experts are ready to customize this itinerary to your preference and budget.</p>
            
            <div className={styles.actionGroup}>
              <button onClick={handleWhatsAppBooking} className={styles.whatsappBtn}>
                <MessageCircle size={20} /> Book via WhatsApp
              </button>
              <button onClick={() => navigate('/contact')} className={styles.emailBtn}>
                <Send size={18} /> Request Custom Quote
              </button>
            </div>

            <div className={styles.trustFooter}>
              <div className={styles.trustItem}><Headphones size={14} /> 24/7 Support</div>
              <div className={styles.trustItem}><Check size={14} /> Best Price Guarantee</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Video Modal */}
      {activeVideoModal && (
        <div className={styles.modalBackdrop} onClick={() => setActiveVideoModal(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setActiveVideoModal(null)}><X /></button>
            <video src={activeVideoModal.url} controls autoPlay className={styles.videoPlayer} />
            <div className={styles.modalInfo}>
              <h4>{activeVideoModal.title}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Footer */}
      <div className={styles.mobileCTA}>
          <div>
            <span className={styles.mPrice}>Custom Pricing</span>
            <span className={styles.mDuration}>{pkg.duration}</span>
          </div>
          <button onClick={handleWhatsAppBooking} className={styles.mBtn}>Inquire Now</button>
      </div>
    </div>
  );
};

export default ItineraryReader;