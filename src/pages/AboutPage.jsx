import React, { useState, useEffect, useRef } from 'react';
import { Compass, Eye, Target, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import styles from '../styles/AboutPage.module.css';

const BIG_FIVE_ANIMALS = [
  {
    "id": "lion",
    "name": "African Lion",
    "swahili": "Simba",
    "scientific": "Panthera leo",
    "role": "Apex Sovereign of the Savannah",
    "habitat": "Masai Mara & Serengeti",
    "image": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=1600",
    "description": "Renowned for commanding roars resonating over 8km across open grasslands and matriarchal pride coordination."
  },
  {
    id: 'elephant',
    name: 'African Elephant',
    swahili: 'Ndovu / Tembo',
    scientific: 'Loxodonta africana',
    role: 'Gentle Giant of Mount Kilimanjaro',
    habitat: 'Amboseli & Tsavo Ecosystems',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=1600',
    description: 'Earth’s largest terrestrial mammal, navigating ancient ancestral migration corridors with immense wisdom.'
  },
 {
  "id": "buffalo",
  "name": "Cape Buffalo",
  "swahili": "Nyati / Mbogo",
  "scientific": "Syncerus caffer",
  "role": "Indomitable Sentinel of the Plains",
  "habitat": "Ngorongoro & Lake Nakuru",
  "image": "https://res.cloudinary.com/cioghqt5/image/upload/v1787301558/BUFFALO.webp? auto=format&fit=crop&q=80&w=1600",
  "description": "Unflinchingly protective with continuous fused horn bosses, thriving in formidable savannah herds."
},
  {
    "id": "leopard",
    "name": "African Leopard",
    "swahili": "Chui",
    "scientific": "Panthera pardus",
    "role": "The Elusive Solitary Ghost",
    "habitat": "Samburu & Great Rift Valley",
    "image": "https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&q=80&w=1600",
    "description": "Master of stealth with rosette camouflage, hauling prey into high acacia branches with unmatched power."
  },
  {
    "id": "rhino",
    "name": "Black Rhino",
    "swahili": "Kifaru",
    "scientific": "Diceros bicornis",
    "role": "Prehistoric Armored Icon",
    "habitat": "Ol Pejeta & Lewa Conservancy",
    "image": "https://res.cloudinary.com/cioghqt5/image/upload/v1787300298/Bufallo.jpg?auto=format&fit=crop&q=80&w=1600",
    "description": "A living relic of evolutionary endurance, zealously protected in Kenya’s premier high-security sanctuaries."
  }
]

function About() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const touchStartX = useRef(null);

  // Auto-slide timer
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

  const currentAnimal = BIG_FIVE_ANIMALS[currentIndex];

  return (
    <main className={styles.aboutPage}>
      {/* Hero Header with Sliding Big Five Showcase & 2-Color Giraffe Palette */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        
        <div className={styles.heroContent}>
          <div className={styles.giraffeBadge}>
            <Sparkles size={14} />
            <span>Savannah Heritage</span>
          </div>
          <h1>Defining Safari Frontiers</h1>
          <p className={styles.tagline}>Conference Bookings & Safaris International</p>
        </div>

        {/* Big Five Sliding Showcase */}
        <div className={styles.sliderContainer}>
          <div className={styles.sliderHeader}>
            <span className={styles.sliderBadge}>The African Big Five Expeditions</span>
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
                  <div className={styles.slideCard}>
                    <div className={styles.animalTitleRow}>
                      <div>
                        <span className={styles.swahiliTag}>{animal.swahili}</span>
                        <h3>{animal.name}</h3>
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

      {/* About Us Content with Giraffe Ivory & Earthy Tones */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <div className={styles.textSide}>
              <div className={styles.sectionLabel}>
                <Compass size={18} />
                <span>Our Heritage</span>
              </div>
              <h2>Pioneering East African Safaris</h2>
              <p>
                <strong>Conference Bookings & Safaris International (CB&SI)</strong> is rooted in Kenya, where our expedition journey began. 
                Our inspiration stems from our founders and field rangers who carry an unwavering love for the African wild—dedicated to 
                preserving Kenya’s magnificent wildlife habitats, from majestic giraffes on the open savannahs to the Great Migration.
              </p>
              <p>
                Backed by decades of field expertise, CB&SI has expanded across premier East African conservancies, partnering exclusively 
                with eco-conscious lodges and master safari guides who share our passion for authentic wildlife encounters.
              </p>
            </div>
            <div className={styles.imageSide}>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=900" 
                  alt="East African Reticulated Giraffes at Sunrise" 
                  className={styles.roundedImage} 
                />
                <div className={styles.imageFloatingBadge}>
                  <strong>15+</strong>
                  <span>Years in Conservation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section with Giraffe Pattern & Warm Tawny Cards */}
      <section className={styles.visionMission}>
        <div className={styles.giraffePatternOverlay}></div>
        <div className={styles.container}>
          <div className={styles.cardGrid}>
            <div className={`${styles.card} ${styles.creamGiraffeCard}`}>
              <div className={styles.cardIconBox}>
                <Target size={26} />
              </div>
              <h3>Our Mission</h3>
              <p>
                To deliver bespoke, world-class tourism and conference expeditions that exceed expectations while actively championing 
                environmental stewardship, community conservation, and the preservation of Africa’s rich biodiversity.
              </p>
            </div>
            <div className={`${styles.card} ${styles.chestnutGiraffeCard}`}>
              <div className={styles.cardIconBox}>
                <Eye size={26} />
              </div>
              <h3>Our Vision</h3>
              <p>
                To be Africa's leading safari architect—inspiring global travelers, fostering unforgettable wildlife connections, 
                and setting the gold standard for sustainable luxury expeditions and international summits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Product Section with Giraffe Ochre Accents */}
      <section className={styles.products}>
        <div className={styles.container}>
          <div className={styles.productContent}>
            <h2>Bespoke Journeys & Conferences</h2>
            <p>
              We handcraft seamless itineraries across iconic national reserves and private sanctuaries. From high-altitude mountain retreats 
              to 4x4 game drives amidst towering giraffe herds, we guarantee unbeatable hospitality, safety, and luxury value.
            </p>
            <div className={styles.serviceHighlights}>
              <span><CheckCircle2 size={16} /> Tailor-Made Itineraries</span>
              <span><CheckCircle2 size={16} /> 24/7 Concierge Support</span>
              <span><CheckCircle2 size={16} /> Eco-Certified Safari Lodges</span>
              <span><CheckCircle2 size={16} /> Expert Local Wildlife Rangers</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;