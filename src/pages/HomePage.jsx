import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronDown, Award, CalendarCheck, Compass, Users, 
  MapPin, ShieldCheck, Globe, ArrowRight, Heart, Mountain, Plane
} from "lucide-react";
import AcceleratingCounter from "../components/AcceleratingCounter";
import styles from "../styles/HomePage.module.css";
import ItineraryS from "../components/sections/ItineraryS";
import Hero from "../components/sections/Hero";

const HomePage = ({ currentPage, onPageChange }) => {
  const navigate = useNavigate();

  const handleAction = (path) => {
    if (typeof onPageChange === 'function') {
      onPageChange(path);
    } else {
      navigate(`/${path}`);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Hero Section - Updated with official tagline */}
      <Hero 
        title="Conference Bookings & Safaris International" 
        subtitle="Defining Safari Frontiers"
      />

      {/* 2. Philosophy/About Section - Integrated Page 2 Info */}
      <section id="philosophy" className={styles.philosophy}>
        <div className={styles.container}>
          <div className={styles.splitContent}>
            <div className={styles.textContent}>
              <span>About Us</span>
              <h2>Luxury, Style, and Authenticity <br />Born in Kenya.</h2>
              <p>
                Inspiration came from a deep-seated commitment to not only preserve 
                Kenya’s wildlife and natural wonders, but to share them with the rest of the world. 
                Strengthened by expertise in our home market, CB&SI has expanded into numerous 
                African destinations, partnering with suppliers who share our drive for excellence.
              </p>
              <ul className={styles.featureList}>
                <li><ShieldCheck size={20} /> Talented, responsible, and caring guides</li>
                <li><Plane size={20} /> Optimized travel with internal flights to maximize your time</li>
                <li><Award size={20} /> High-standard properties and hand-picked destinations</li>
              </ul>
            </div>
            <div className={styles.imageContent}>
              <div className={styles.experienceCard}>
                {/* Image of the elephant from Page 1 of the PDF */}
                <img src="https://res.cloudinary.com/cioghqt5/image/upload/v1788093014/Waterfalls-in-Kenya.jpg" alt="CB&SI Safari" />
                <div className={styles.floatingTag}>Defining Frontiers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision Section - New section from Page 2 */}
      <section className={styles.missionVision}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <Heart className={styles.cardIcon} />
              <h3>Our Mission</h3>
              <p>
                To serve our customers to their entire satisfaction and provide quality 
                tourism services, committing to the social, cultural and environmental 
                reality of our country’s beauty and biodiversity.
              </p>
            </div>
            <div className={styles.visionCard}>
              <Globe className={styles.cardIcon} />
              <h3>Our Vision</h3>
              <p>
                To be your travel champion and companion, making your experience 
                memorable with innovative guides, competitive prices, and 24/7 service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Services - Refined using "Our Product" info from Page 3 */}
      <section id="services" className={styles.services}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCentered}>
            <span>Our Product</span>
            <h2>Tailored To Your Dreams</h2>
            <p>"You dream it... CB&SI will make it happen!"</p>
          </div>

          <div className={styles.serviceGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.iconCircle}><Compass /></div>
              <h3>Tailor-Made Itineraries</h3>
              <p>Personalized packages for special occasions, off-the-beaten-track adventures, or well-needed breaks.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.iconCircle}><Mountain /></div>
              <h3>Safaris & Climbs</h3>
              <p>Expertly conducted expeditions with a focus on safety, responsibility, and unforgettable wildlife encounters.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.iconCircle}><Users /></div>
              <h3>Buying Power</h3>
              <p>Strong relationships with local suppliers ensure high value for money without compromising quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <ItineraryS />

      {/* 5. Stats Section - Modern Counter Layout */}
      <section id="stats" className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <strong><AcceleratingCounter start={0} end={15} suffix="+" duration={2000} /></strong>
            <span>Years in Kenya</span>
          </div>
          <div className={styles.statItem}>
            <strong>24/7</strong>
            <span>Customer Service</span>
          </div>
          <div className={styles.statItem}>
            <strong>100%</strong>
            <span>Personalized</span>
          </div>
          <div className={styles.statItem}>
            <strong><Award size={40} /></strong>
            <span>Quality Guaranteed</span>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default HomePage;