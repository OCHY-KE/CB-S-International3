import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Award, CalendarCheck, Compass, Users } from "lucide-react";
import AcceleratingCounter from "../components/AcceleratingCounter";
import styles from "../styles/HomePage.module.css";

const HomePage = ({ currentPage, onPageChange }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      const headerOffset = 85;
      const elementPosition = servicesSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else if (typeof onPageChange === 'function') {
      onPageChange('about');
    } else {
      navigate('/about');
    }
  };

  const handlePlan = () => {
    if (typeof onPageChange === 'function') {
      onPageChange('about');
    } else {
      navigate('/about');
    }
  };

  const scrollToServices = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      const headerOffset = 85;
      const elementPosition = servicesSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1>Unforgettable Safaris. <br /><span>Seamless Conferences.</span></h1>
            <p>
              Experience the wild heart of Africa with world-class logistics and 
              bespoke travel experiences tailored for explorers and professionals.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.btnPrimary} onClick={handleExplore}>
                Explore Safaris
              </button>
              <button className={styles.btnSecondary} onClick={handlePlan}>
                Plan a Conference
              </button>
            </div>
          </div>
        </div>

        {/* Floating smooth scroll down indicator */}
        <button
          type="button"
          onClick={scrollToServices}
          className={styles.scrollDownIndicator}
          aria-label="Scroll to services"
        >
          <span>Discover More</span>
          <ChevronDown className={styles.scrollChevron} size={22} />
        </button>
      </section>

      {/* Quick Services Section */}
      <section id="services" className={styles.services}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span>Our Expertise</span>
            <h2>Why Choose CB&SI?</h2>
          </div>

          <div className={styles.serviceGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.icon}>🦒</div>
              <h3>Bespoke Safaris</h3>
              <p>Custom-tailored wildlife journeys through the most iconic parks in East Africa.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.icon}>🤝</div>
              <h3>Corporate Events</h3>
              <p>End-to-end conference management, from venue booking to professional logistics.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.icon}>✈️</div>
              <h3>Travel Logistics</h3>
              <p>Seamless airport transfers, local flight bookings, and 24/7 travel support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statIconBadge}>
            <Award size={24} />
          </div>
          <strong>
            <AcceleratingCounter start={0} end={15} suffix="+" duration={2000} />
          </strong>
          <span>Years Experience</span>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIconBadge}>
            <CalendarCheck size={24} />
          </div>
          <strong>
            <AcceleratingCounter start={0} end={500} suffix="+" duration={2400} />
          </strong>
          <span>Conferences Hosted</span>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIconBadge}>
            <Users size={24} />
          </div>
          <strong>
            <AcceleratingCounter start={0} end={10000} suffix="+" duration={2600} />
          </strong>
          <span>Happy Explorers</span>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIconBadge}>
            <Compass size={24} />
          </div>
          <strong>
            <AcceleratingCounter start={0} end={99.8} decimals={1} suffix="%" duration={2200} />
          </strong>
          <span>Satisfaction Rate</span>
        </div>
      </section>
    </div>
  );
};

export default HomePage;