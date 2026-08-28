import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, MapPin, MessageCircle, ArrowLeft, Share2, 
  Calendar, CheckCircle2, XCircle, 
  Users, Camera, Video, Play, Maximize2, X, Sparkles, Image as ImageIcon,
  ShieldCheck, Headphones, Send, Check
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import SEO from '../components/SEO';
import ItineraryGallery from '../components/ItineraryGallery';
import styles from '../styles/ItineraryReader.module.css';

const DEFAULT_SAMPLES = [
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
];

const ItineraryReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  const WHATSAPP_PHONE = '254722774952';

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  // Lock scroll when video modal is open
  useEffect(() => {
    if (activeVideoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeVideoModal]);

  const fetchPackageDetails = async () => {
    setLoading(true);
    try {
      // Check sample list first if id matches sample
      const sampleMatch = DEFAULT_SAMPLES.find((s) => s.id === id);
      if (sampleMatch) {
        setPkg(sampleMatch);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.warn('Could not fetch itinerary by ID from DB, checking sample defaults:', error?.message);
        if (DEFAULT_SAMPLES[0]) {
          setPkg(DEFAULT_SAMPLES[0]);
        } else {
          navigate('/itineraries');
        }
      } else {
        setPkg(data);
      }
    } catch (err) {
      console.error('Error fetching itinerary details:', err);
      navigate('/itineraries');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppBooking = () => {
    if (!pkg) return;
    const message = `Hello! I'm interested in the "${pkg.title}" (${pkg.duration}) safari. Please share current rates and availability.`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const heroImage =
    pkg?.image ||
    pkg?.days?.find((d) => d.media?.images?.length > 0)?.media?.images?.[0] ||
    pkg?.days?.[0]?.media?.images?.[0] ||
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80';

  const totalVideos = pkg?.days?.filter((d) => d.media?.video).length || (pkg?.video ? 1 : 0);

  // Extract all media items (photos & videos) for the comprehensive gallery
  const allMediaItems = useMemo(() => {
    if (!pkg) return [];
    const list = [];

    // 1. Cover/Hero photo
    if (pkg.image) {
      list.push({
        type: 'image',
        url: pkg.image,
        title: `${pkg.title} - Cover Experience`,
        location: pkg.route
      });
    }

    // 2. Direct package video
    if (pkg.video || pkg.video_url) {
      list.push({
        type: 'video',
        url: pkg.video || pkg.video_url,
        poster: pkg.image,
        title: `${pkg.title} - Safari Highlight Reel`,
        location: pkg.route
      });
    }

    // 3. Day-by-day media (photos and videos)
    if (Array.isArray(pkg.days)) {
      pkg.days.forEach((day) => {
        if (day.media?.video) {
          list.push({
            type: 'video',
            url: day.media.video,
            poster: day.media.images?.[0] || pkg.image,
            title: `Day ${day.day}: ${day.location || 'Safari Experience'} (Video Reel)`,
            location: day.location || `Day ${day.day}`
          });
        }

        if (Array.isArray(day.media?.images)) {
          day.media.images.forEach((imgUrl, idx) => {
            if (imgUrl && !list.some((it) => it.url === imgUrl)) {
              list.push({
                type: 'image',
                url: imgUrl,
                title: `Day ${day.day}: ${day.location || 'Wildlife Sighting'} (Photo ${idx + 1})`,
                location: day.location || `Day ${day.day}`
              });
            }
          });
        }
      });
    }

    // Fallback if empty
    if (list.length === 0) {
      list.push({
        type: 'image',
        url: heroImage,
        title: pkg.title,
        location: pkg.route
      });
    }

    return list;
  }, [pkg, heroImage]);

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
        <button onClick={() => navigate('/itineraries')} className={styles.iconCircle} title="Back to All Itineraries">
          <ArrowLeft size={20} />
        </button>
        <div className={styles.navActions}>
          <button 
            className={styles.iconCircle} 
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: pkg.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
            title="Share Itinerary"
          >
            <Share2 size={20} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <img src={heroImage} alt={pkg.title} className={styles.heroImg} />
        <div className={styles.heroOverlay}>
          <div className={styles.heroText}>
            <span className={styles.badge}>{pkg.category}</span>
            <h1>{pkg.title}</h1>
            <div className={styles.quickFacts}>
              <span><Clock size={18} /> {pkg.duration}</span>
              <span><MapPin size={18} /> {pkg.route}</span>
              <span><Users size={18} /> Private / Group</span>
              {totalVideos > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const firstVideo = pkg.days?.find((d) => d.media?.video)?.media?.video || pkg.video;
                    if (firstVideo) {
                      setActiveVideoModal({
                        url: firstVideo,
                        title: pkg.title,
                        location: pkg.route
                      });
                    }
                  }}
                  className={styles.videoQuickBadgeBtn}
                  title="Watch Video Footage"
                >
                  <Play size={14} fill="currentColor" /> {totalVideos} Video {totalVideos > 1 ? 'Clips' : 'Tour'} Available
                </button>
              )}
              {allMediaItems.length > 0 && (
                <a 
                  href="#safari-gallery" 
                  className={styles.galleryShortcutBtn}
                  title="Jump to Visual Gallery"
                >
                  <ImageIcon size={14} /> View Gallery ({allMediaItems.length})
                </a>
              )}
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
              <div className={styles.hCard}><CheckCircle2 size={16} /> Professional Safari Guide</div>
              <div className={styles.hCard}><CheckCircle2 size={16} /> Custom 4x4 Landcruiser</div>
              <div className={styles.hCard}><CheckCircle2 size={16} /> All National Park Entry Fees</div>
              <div className={styles.hCard}><CheckCircle2 size={16} /> Luxury Lodging & Meals</div>
              {totalVideos > 0 && (
                <div className={styles.hCard}><Video size={16} /> 4K Wildlife Video Footage</div>
              )}
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
                    <h3>{day.location || `Day ${day.day}`}</h3>
                    <p className={styles.activity}>{day.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dedicated Safari Gallery Section */}
          <ItineraryGallery 
            media={allMediaItems} 
            title={pkg.title} 
            onInquire={handleWhatsAppBooking} 
          />

          {/* Inclusions & Exclusions */}
          <section className={styles.dualSection}>
            <div className={styles.box}>
              <h3>Included</h3>
              <ul>
                <li><CheckCircle2 size={18} className={styles.check} /> Ground transport in 4x4 Land Cruiser</li>
                <li><CheckCircle2 size={18} className={styles.check} /> Professional English/multilingual guide</li>
                <li><CheckCircle2 size={18} className={styles.check} /> All park entry fees & conservation permits</li>
                <li><CheckCircle2 size={18} className={styles.check} /> Bottled drinking water on game drives</li>
              </ul>
            </div>
            <div className={styles.box}>
              <h3>Excluded</h3>
              <ul>
                <li><XCircle size={18} className={styles.uncheck} /> International Flights</li>
                <li><XCircle size={18} className={styles.uncheck} /> Tourist Visa & Passports</li>
                <li><XCircle size={18} className={styles.uncheck} /> Personal Travel & Medical Insurance</li>
                <li><XCircle size={18} className={styles.uncheck} /> Tips & Driver Gratitude</li>
              </ul>
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <div className={styles.bookingCardBadge}>
              <Sparkles size={13} className={styles.cardSparkle} />
              <span>Tailor-Made Experience</span>
            </div>

            <h3 className={styles.bookingCardTitle}>Ready for this Journey?</h3>
            <p className={styles.bookingCardDesc}>
              Connect directly with our safari directors for custom dates, lodge upgrades, and personalized packages.
            </p>

            <div className={styles.bookingCardHighlights}>
              <div className={styles.highlightRow}>
                <Check size={16} className={styles.highlightCheck} />
                <span>100% Bespoke & Flexible Itinerary</span>
              </div>
              <div className={styles.highlightRow}>
                <Check size={16} className={styles.highlightCheck} />
                <span>Expert Local 4x4 Driver Guides</span>
              </div>
              <div className={styles.highlightRow}>
                <Check size={16} className={styles.highlightCheck} />
                <span>Instant Direct Booking & Quotes</span>
              </div>
            </div>

            <div className={styles.bookingActions}>
              <button 
                type="button" 
                className={styles.bookWhatsappBtn} 
                onClick={handleWhatsAppBooking}
                aria-label="Book safari via WhatsApp"
              >
                <MessageCircle size={20} className={styles.btnIcon} />
                <span>Book via WhatsApp</span>
              </button>

              <button 
                type="button" 
                className={styles.inquireBtn} 
                onClick={() => navigate('/contact')}
                aria-label="Request custom safari quote"
              >
                <Send size={17} className={styles.btnIcon} />
                <span>Request Custom Quote</span>
              </button>
            </div>

            <div className={styles.bookingTrustFooter}>
              <div className={styles.trustItem}>
                <ShieldCheck size={15} className={styles.trustIcon} />
                <span>Verified Operators</span>
              </div>
              <div className={styles.trustDot}>•</div>
              <div className={styles.trustItem}>
                <Headphones size={15} className={styles.trustIcon} />
                <span>24/7 Safari Care</span>
              </div>
            </div>
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

      {/* Cinematic Responsive Video Modal */}
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
                <div className={styles.videoLiveBadge}>
                  <Play size={10} fill="currentColor" /> 4K Safari Reel
                </div>
                <h3>{activeVideoModal.title}</h3>
                <p><MapPin size={14} /> {activeVideoModal.location}</p>
              </div>
              <button 
                type="button"
                className={styles.closeVideoBtn}
                onClick={() => setActiveVideoModal(null)}
                aria-label="Close video player"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalVideoPlayer}>
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
                type="button"
                className={styles.modalInquireBtn}
                onClick={() => {
                  setActiveVideoModal(null);
                  handleWhatsAppBooking();
                }}
              >
                <MessageCircle size={18} />
                <span>Inquire About This Experience</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryReader;