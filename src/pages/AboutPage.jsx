import React from 'react';
import styles from '../styles/AboutPage.module.css';

function About() {
  return (
    <main className={styles.aboutPage}>
      {/* Hero Header */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Our Story</span>
          <h1>Defining Safari Frontiers</h1>
          <p className={styles.tagline}>Conference Bookings & Safaris International</p>
        </div>
      </section>

      {/* About Us Content */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <div className={styles.textSide}>
              <h2>About Us</h2>
              <p>
                <strong>Conference Bookings & Safaris International (CB&SI)</strong> lies in Kenya, where the business began. 
                Inspiration came from the owners and staff, who have a true love for the country and a deep-seated commitment 
                to not only preserve Kenya’s wildlife and natural wonders, but to share them with the rest of the world.
              </p>
              <p>
                Strengthened by valuable experience gained to date in its home market, CB&SI has recently expanded 
                into numerous other African destinations, partnering with the best suppliers who share the same 
                level of expertise, enthusiasm, and drive.
              </p>
            </div>
            <div className={styles.imageSide}>
              <img 
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800" 
                alt="Kenyan Savanna" 
                className={styles.roundedImage} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section (Styled like the PDF cards) */}
      <section className={styles.visionMission}>
        <div className={styles.container}>
          <div className={styles.cardGrid}>
            <div className={`${styles.card} ${styles.blueCard}`}>
              <h3>Mission</h3>
              <p>
                To serve our customers to their entire satisfaction and to provide tourism services of quality, 
                committing to the social, cultural and environmental reality of our country’s beauty and biodiversity.
              </p>
            </div>
            <div className={`${styles.card} ${styles.lightCard}`}>
              <h3>Vision</h3>
              <p>
                We commit to inspire you, and are dedicated to being your travel champion, a companion and instigator, 
                wandering the world beside you while helping make your traveling experience memorable with innovative tour guides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Product Section */}
      <section className={styles.products}>
        <div className={styles.container}>
          <div className={styles.productContent}>
            <h2>Our Product</h2>
            <p>
              We select attractive holiday destinations and activities, combining them into an easy-to-follow 
              creative itinerary. We negotiate the best deals with a broad spectrum of local suppliers 
              to enhance value for money, without compromising on product and service quality.
            </p>
            <div className={styles.serviceHighlights}>
              <span>✓ Tailor-made itineraries</span>
              <span>✓ 24/7 Customer Service</span>
              <span>✓ Competitive Prices</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;