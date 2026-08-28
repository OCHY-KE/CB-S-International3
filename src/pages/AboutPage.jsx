import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Eye, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  ShieldCheck, 
  Users, 
  Award, 
  Globe2, 
  MessageCircle, 
  ArrowRight,
  HeartHandshake
} from 'lucide-react';
import SEO from '../components/SEO';
import styles from '../styles/AboutPage.module.css';

const WHATSAPP_PHONE = '254722774952';

const BIG_FIVE_ANIMALS = [
  {
    id: 'lion',
    name: 'African Lion',
    swahili: 'Simba',
    scientific: 'Panthera leo',
    role: 'Apex Sovereign of the Savannah',
    habitat: 'Masai Mara & Serengeti Ecosystem',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=1600',
    description: 'Renowned for commanding roars resonating over 8km across open grasslands and matriarchal pride coordination in legendary Mara hunts.'
  },
  {
    id: 'elephant',
    name: 'African Elephant',
    swahili: 'Ndovu / Tembo',
    scientific: 'Loxodonta africana',
    role: 'Gentle Giant of Mount Kilimanjaro',
    habitat: 'Amboseli & Tsavo National Parks',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=1600',
    description: 'Earth’s largest terrestrial mammal, navigating ancient ancestral migration corridors beneath snow-capped Kilimanjaro with immense wisdom.'
  },
  {
    id: 'buffalo',
    name: 'Cape Buffalo',
    swahili: 'Nyati / Mbogo',
    scientific: 'Syncerus caffer',
    role: 'Indomitable Sentinel of the Plains',
    habitat: 'Ngorongoro Crater & Lake Nakuru',
    image: 'https://res.cloudinary.com/cioghqt5/image/upload/v1787301558/BUFFALO.webp?auto=format&fit=crop&q=80&w=1600',
    description: 'Unflinchingly protective with continuous fused horn bosses, thriving in formidable savannah herds that deter the fiercest predators.'
  },
  {
    id: 'leopard',
    name: 'African Leopard',
    swahili: 'Chui',
    scientific: 'Panthera pardus',
    role: 'The Elusive Solitary Ghost',
    habitat: 'Samburu & Great Rift Valley',
    image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&q=80&w=1600',
    description: 'Master of stealth with rosette camouflage, hauling prey into high acacia branches with unmatched agility and strength.'
  },
  {
    id: 'rhino',
    name: 'Black Rhino',
    swahili: 'Kifaru',
    scientific: 'Diceros bicornis',
    role: 'Prehistoric Armored Icon',
    habitat: 'Ol Pejeta & Lewa Wildlife Conservancy',
    image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&q=80&w=1600',
    description: 'A living relic of evolutionary endurance, zealously protected in Kenya’s premier high-security conservation sanctuaries.'
  }
];

const IMPACT_METRICS = [
  {
    icon: Award,
    value: '15+',
    label: 'Years of Safari Excellence'
  },
  {
    icon: Users,
    value: '8,500+',
    label: 'Satisfied Global Explorers'
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'KATO Bonded & Certified'
  },
  {
    icon: Globe2,
    value: '45+',
    label: 'National Parks & Sanctuaries'
  }
];

function About() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const touchStartX = useRef(null);

  // Auto-slide timer for Big Five showcase
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BIG_FIVE_ANIMALS.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BIG_FIVE_ANIMALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + BIG_FIVE_ANIMALS.length) % BIG_FIVE_ANIMALS.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 50) handleNext();
    if (diffX < -50) handlePrev();
    touchStartX.current = null;
  };

  const handleOpenWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello CBSI Safaris! I am interested in learning more about your heritage and booking an expedition.')}`, '_blank');
  };

  return (
    <main className={styles.aboutPage}>
      <SEO 
        title="About Us | CBSI Safaris - East Africa's Premier Tour Architect" 
        description="Learn about Conference Bookings & Safaris International (CBSI). 15+ years crafting bespoke Kenyan and Tanzanian luxury wildlife safaris, conference summits, and conservation expeditions."
      />

      {/* Hero Header with Sliding Big Five Showcase */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        
        <div className={styles.heroContent}>
          <div className={styles.badgePill}>
            <Sparkles size={14} />
            <span>Savannah Heritage & Luxury Logistics</span>
          </div>
          <h1 className={styles.heroTitle}>
            Defining the Frontiers of <span className={styles.heroTitleGold}>African Safari Craft</span>
          </h1>
          <p className={styles.heroTagline}>
            Conference Bookings & Safaris International (CBSI) unites bespoke luxury wildlife adventures, high-level summit logistics, and grassroots conservation across East Africa.
          </p>
        </div>

        {/* Big Five Sliding Showcase */}
        <div className={styles.sliderContainer}>
          <div className={styles.sliderHeader}>
            <div className={styles.sliderHeaderLeft}>
              <Compass size={18} color="#c5a059" />
              <span className={styles.sliderBadge}>The African Big Five Expeditions</span>
            </div>
            <div className={styles.sliderControls}>
              <button 
                className={styles.controlBtn} 
                onClick={handlePrev}
                aria-label="Previous animal"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className={styles.controlBtn} 
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button 
                className={styles.controlBtn} 
                onClick={handleNext}
                aria-label="Next animal"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div 
            className={styles.slideStage}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {BIG_FIVE_ANIMALS.map((animal, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={animal.id}
                  className={`${styles.slideItem} ${isActive ? styles.slideActive : ''}`}
                  style={{
                    transform: `translateX(${(idx - currentIndex) * 100}%)`,
                    opacity: isActive ? 1 : 0,
                    pointerEvents: isActive ? 'auto' : 'none'
                  }}
                >
                  <img 
                    src={animal.image} 
                    alt={`${animal.name} - Big Five Safari`} 
                    className={styles.slideImage} 
                  />
                  <div className={styles.slideImageOverlay}></div>
                  <div className={styles.slideCard}>
                    <div className={styles.animalTitleRow}>
                      <div>
                        <span className={styles.swahiliTag}>{animal.swahili}</span>
                        <h3 className={styles.animalName}>{animal.name}</h3>
                        <p className={styles.scientificName}>{animal.scientific}</p>
                      </div>
                      <span className={styles.orderNumber}>0{idx + 1} / 05</span>
                    </div>

                    <p className={styles.animalRole}>{animal.role}</p>
                    <p className={styles.animalDesc}>{animal.description}</p>
                    
                    <div className={styles.habitatRow}>
                      <Compass size={16} />
                      <span>{animal.habitat}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Selectors for each Big Five Animal */}
          <div className={styles.thumbnailNav}>
            {BIG_FIVE_ANIMALS.map((animal, idx) => (
              <button
                key={animal.id}
                onClick={() => setCurrentIndex(idx)}
                className={`${styles.thumbBtn} ${idx === currentIndex ? styles.thumbActive : ''}`}
              >
                <span className={styles.thumbNum}>0{idx + 1}</span>
                <span className={styles.thumbName}>{animal.name.split(' ')[1] || animal.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Strip */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          {IMPACT_METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className={styles.statBlock}>
                <div className={styles.statIconBox}>
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className={styles.statNumber}>{metric.value}</h4>
                  <p className={styles.statLabel}>{metric.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Heritage & Brand Story */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <div className={styles.textSide}>
              <div className={styles.sectionLabel}>
                <Compass size={18} />
                <span>Our Heritage & Vision</span>
              </div>
              <h2 className={styles.sectionTitle}>Pioneering East African Luxury & Expedition Safaris</h2>
              <p className={styles.storyParagraph}>
                <strong>Conference Bookings & Safaris International (CB&SI)</strong> was founded in Nairobi with a singular mission: to provide discerning global travelers and corporate delegations with deeply authentic, flawless East African travel experiences.
              </p>
              <p className={styles.storyParagraph}>
                From the thunderous river crossings of the Masai Mara to the serene elephant corridors of Amboseli and the volcanic vistas of the Great Rift Valley, our custom 4x4 expedition fleet and seasoned multilingual guides unlock the continent's most breathtaking wilderness.
              </p>
              <div className={styles.highlightList}>
                <div className={styles.highlightItem}>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>Licensed KATO Category 'A' Tour Operator</span>
                </div>
                <div className={styles.highlightItem}>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>Custom Extended 4x4 Safari Land Cruisers</span>
                </div>
                <div className={styles.highlightItem}>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>Certified Gold & Silver Field Guides</span>
                </div>
                <div className={styles.highlightItem}>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>24/7 Ground Ops & Emergency Flying Doctors</span>
                </div>
              </div>
            </div>

            <div className={styles.imageSide}>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=900" 
                  alt="CBSI Safari Land Cruiser in Masai Mara" 
                  className={styles.roundedImage} 
                />
                <div className={styles.imageFloatingBadge}>
                  <strong>15+</strong>
                  <span>Years of Wildlife Conservation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className={styles.visionMission}>
        <div className={styles.container}>
          <div className={styles.cardGrid}>
            <div className={styles.pillarCard}>
              <div className={styles.cardIconBox}>
                <Target size={28} />
              </div>
              <h3 className={styles.cardTitle}>Our Mission</h3>
              <p className={styles.cardText}>
                To engineer bespoke, world-class tourism and conference summits that exceed expectations while actively championing environmental stewardship, community empowerment, and the preservation of Africa’s rich biodiversity for generations to come.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.cardIconBox}>
                <Eye size={28} />
              </div>
              <h3 className={styles.cardTitle}>Our Vision</h3>
              <p className={styles.cardText}>
                To stand as East Africa's benchmark safari architect—inspiring global travelers, fostering life-changing wildlife connections, and setting the gold standard for sustainable luxury expeditions and high-impact international corporate summits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation & Accreditation Banner */}
      <section className={styles.accreditationSection}>
        <div className={styles.container}>
          <div className={styles.trustBanner}>
            <div className={styles.trustText}>
              <div className={styles.sectionLabel}>
                <HeartHandshake size={18} />
                <span>Ethical Travel</span>
              </div>
              <h3>Responsible Tourism & Community Partnerships</h3>
              <p>
                Every journey booked with CBSI directly contributes to indigenous community conservancies, anti-poaching patrol equipment, and sustainable tree reforestation around the Mau and Aberdare water towers.
              </p>
              <div className={styles.trustPoints}>
                <div className={styles.trustPointItem}>
                  <ShieldCheck size={16} color="#c5a059" />
                  <span>Fair wages & training for local Maasai and Samburu scouts</span>
                </div>
                <div className={styles.trustPointItem}>
                  <ShieldCheck size={16} color="#c5a059" />
                  <span>Plastic-free and solar-powered partner safari camps</span>
                </div>
              </div>
            </div>

            <div className={styles.ctaBox}>
              <h4>Ready to Plan Your Safari?</h4>
              <p>Speak directly with our safari directors or design your custom itinerary in minutes.</p>
              
              <button 
                className={styles.ctaButtonPrimary}
                onClick={() => navigate('/itineraries')}
              >
                <span>Browse All Itineraries</span>
                <ArrowRight size={18} />
              </button>

              <button 
                className={styles.ctaButtonWA}
                onClick={handleOpenWhatsApp}
              >
                <MessageCircle size={18} />
                <span>WhatsApp Safari Desk</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;