import React from "react";
import { Link } from "react-router-dom";
import { Award, Globe, ArrowRight, Heart, Plane, ShieldCheck } from "lucide-react";
import AcceleratingCounter from "../components/AcceleratingCounter";
import styles from "../styles/HomePage.module.css";
import ItineraryS from "../components/sections/ItineraryS";
import Hero from "../components/sections/Hero";

const HomePage = () => {
  return (
    <div className={styles.pageWrapper}>
      <Hero title="Conference Bookings & Safaris International" subtitle="Defining Safari Frontiers" />

      <section className={styles.trustBar} aria-label="Why travel with CB&SI">
        <div className={styles.trustItem}>
          <ShieldCheck size={22} />
          <span><strong>Local expertise</strong> rooted in Kenya</span>
        </div>
        <div className={styles.trustItem}>
          <Plane size={22} />
          <span><strong>Seamless journeys</strong> across East Africa</span>
        </div>
        <div className={styles.trustItem}>
          <Heart size={22} />
          <span><strong>Thoughtful travel</strong> that gives back</span>
        </div>
      </section>

      <section id="philosophy" className={styles.philosophy}>
        <div className={styles.container}>
          <div className={styles.splitContent}>
            <div className={styles.textContent}>
              <span className={styles.eyebrow}>The CB&SI way</span>
              <h2>Luxury, style, and authenticity born in Kenya.</h2>
              <p>
              Conference Bookings & Safaris International (CB&SI) was founded in Kenya, inspired by the passion of its owners and team, who share a deep love for the country and a strong commitment to protecting its wildlife and natural treasures while showcasing them to the world. Building on extensive experience in its home market, CB&SI has recently broadened its reach across Africa, collaborating with leading partners who bring the same expertise, enthusiasm, and dedication to delivering exceptional safari experiences.
              </p>
              <ul className={styles.featureList}>
                <li><ShieldCheck size={20} /> Talented, responsible, and caring guides</li>
                <li><Plane size={20} /> Optimized travel with internal flights to maximize your time</li>
                <li><Award size={20} /> High-standard properties and hand-picked destinations</li>
              </ul>
              <Link to="/about" className={styles.textLink}>
                Discover our story <ArrowRight size={17} />
              </Link>
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

      <section className={styles.missionVision}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <span className={styles.eyebrow}>Travel with meaning</span>
            <h2>Every journey should leave something beautiful behind.</h2>
          </div>
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

      
      <ItineraryS />

      <section id="stats" className={styles.stats}>
        <div className={styles.statsIntro}>
          <span className={styles.eyebrow}>The difference is in the details</span>
          <h2>Made for the way you want to travel.</h2>
        </div>
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
        <Link to="/contact" className={styles.statsCta}>
          Start planning your journey <ArrowRight size={17} />
        </Link>
      </section>

      
    </div>
  );
};

export default HomePage;