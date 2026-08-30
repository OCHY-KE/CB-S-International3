import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Award, 
  Globe2, 
  MessageCircle, 
  ArrowRight,
  HeartHandshake,
  Briefcase,
  CalendarCheck,
  Binoculars,
  MapPin
} from 'lucide-react';
import SEO from '../components/SEO';
import styles from '../styles/AboutPage.module.css';


const WHATSAPP_PHONE = '254722774952';

const CBSI_PILLARS = [
  {
    letter: 'C',
    title: 'Conference & Summits',
    subtitle: 'MICE Excellence',
    description: 'We orchestrate high-level international summits and corporate retreats, blending professional logistics with the serene backdrop of the African wild.',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800'
  },
  {
  letter: 'B',
  title: 'Bookings & Logistics',
  subtitle: 'Seamless Concierge',
  description: 'Tailor-made itineraries, luxury accommodation procurement, and private charter coordination. We handle the complexity so you experience the harmony.',
  icon: CalendarCheck,
  image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800'
  },
  {
    letter: 'S',
    title: 'Safaris & Expeditions',
    subtitle: 'The Heart of Adventure',
    description: 'From the Great Migration to hidden conservancies, our gold-level guides lead deep-immersion wildlife encounters in customized 4x4 fleets.',
    icon: Binoculars,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800'
  },
 {
    letter: 'I',
    title: 'International Reach',
    subtitle: 'Kenya to the World',
    description: 'Rooted in Kenyan heritage with a growing footprint across Africa. We bridge the gap between local expertise and global expectations, sharing our commitment to biodiversity with travelers from every corner of the globe.',
    icon: Globe2,
    // Using a high-quality, relevant image of a professional safari traveler or a global travel theme
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'
  }
];

const IMPACT_METRICS = [
  { icon: Award, value: '15+', label: 'Years of Excellence' },
  { icon: Users, value: '8,500+', label: 'Global Explorers' },
  { icon: ShieldCheck, value: '100%', label: 'KATO Bonded' },
  { icon: Globe2, value: '45+', label: 'Destinations' }
];

function About() {
  const navigate = useNavigate();

  const handleOpenWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello CBSI Safaris! I want to learn more about your services.')}`, '_blank');
  };

  return (
    <main className={styles.aboutPage}>
      <SEO 
        title="Our Identity | CB&SI Safaris - East Africa's Premier Tour Architect" 
        description="Discover the core pillars of Conference Bookings & Safaris International. 15+ years of luxury safaris and professional summit logistics."
      />

      {/* Hero Header with "Alive" Background */}
    

      {/* The CB&SI Identity Diagram */}
      <section className={styles.identitySection}>
        <div className={styles.container}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionSub}>Our Core Pillars</span>
                <h2 className={styles.mainHeading}>What <span className={styles.goldText}>CB & SI</span> Stands For</h2>
            </div>

            <div className={styles.diagramFlow}>
                {/* Vertical Connector Line */}
                <div className={styles.flowLine}></div>

                {CBSI_PILLARS.map((pillar, index) => {
                    const Icon = pillar.icon;
                    return (
                        <div key={pillar.letter} className={`${styles.pillarStep} ${index % 2 !== 0 ? styles.reverse : ''}`}>
                            <div className={styles.pillarContent}>
                                <div className={styles.letterAnchor}>{pillar.letter}</div>
                                <div className={styles.pillarTextCard}>
                                    <div className={styles.pillarIconHeader}>
                                        <Icon size={24} className={styles.pillarIcon} />
                                        <span className={styles.pillarSubtitle}>{pillar.subtitle}</span>
                                    </div>
                                    <h3>{pillar.title}</h3>
                                    <p>{pillar.description}</p>
                                </div>
                            </div>
                            
                            <div className={styles.pillarVisual}>
                                <div className={styles.pillarImageWrapper}>
                                    <img src={pillar.image} alt={pillar.title} className={styles.pillarImage} />
                                    <div className={styles.imageDecor}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          {IMPACT_METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className={styles.statBlock}>
                <Icon size={28} className={styles.statIcon} />
                <h4 className={styles.statNumber}>{metric.value}</h4>
                <p className={styles.statLabel}>{metric.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & CTA Section */}
      <section className={styles.trustSection}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <div className={styles.trustInfo}>
                <div className={styles.badgePillSmall}>
                    <HeartHandshake size={14} />
                    <span>Ethical Commitment</span>
                </div>
                <h2>Conservation & Community</h2>
                <p>
                    Every CB&SI expedition supports the <strong>Maasai Mara Wildlife Conservancies</strong> and local reforestation projects. We believe luxury travel should be a force for environmental protection.
                </p>
                <div className={styles.featureGrid}>
                    <div className={styles.featureItem}>
                        <CheckCircle2 size={18} />
                        <span>KATO Category 'A' Licensed</span>
                    </div>
                    <div className={styles.featureItem}>
                        <CheckCircle2 size={18} />
                        <span>Silver-Level Certified Guides</span>
                    </div>
                </div>
            </div>
            
            <div className={styles.ctaCard}>
                <h3>Plan Your Legacy Journey</h3>
                <p>Join over 8,000 travelers who have experienced the CBSI difference.</p>
                <div className={styles.ctaButtons}>
                    <button onClick={() => navigate('/itineraries')} className={styles.btnPrimary}>
                        View Itineraries <ArrowRight size={18} />
                    </button>
                    <button onClick={handleOpenWhatsApp} className={styles.btnWA}>
                        <MessageCircle size={18} /> WhatsApp Experts
                    </button>
                </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;