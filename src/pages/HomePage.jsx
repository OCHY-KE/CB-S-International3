import React from "react";
import styles from "../styles/HomePage.module.css";

const HomePage = ({ currentPage, onPageChange }) => {
  return (
    <div className={styles.pageWrapper}>
     

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1>Unforgettable Safaris. <br /><span>Seamless Conferences.</span></h1>
            <p>
              Experience the wild heart of Africa with world-class logistics and 
              bespoke travel experiences tailored for explorers and professionals.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.btnPrimary} onClick={() => onPageChange('about')}>
                Explore Safaris
              </button>
              <button className={styles.btnSecondary}>
                Plan a Conference
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services Section */}
      <section className={styles.services}>
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
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <strong>15+</strong>
          <span>Years Experience</span>
        </div>
        <div className={styles.statItem}>
          <strong>500+</strong>
          <span>Conferences Hosted</span>
        </div>
        <div className={styles.statItem}>
          <strong>10k+</strong>
          <span>Happy Explorers</span>
        </div>
      </section>

      
    </div>
  );
};

export default HomePage;