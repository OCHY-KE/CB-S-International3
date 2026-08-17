import styles from "../styles/AboutPage.module.css"
function About() {
  return (
    <section className="about-section">
      <div className="section-heading">
        <span className="eyebrow">About Conference Bookings & Safaris International</span>
        <h2>Defining safari frontiers through authentic African experiences.</h2>
      </div>

      <div className="about-grid">
        <div className="about-copy">
          <p>
            Born in Kenya from a deep-seated love for the country’s wildlife and natural wonders, 
            CB&SI has expanded across the continent to share the heart of Africa with the world. 
            We partner with the best suppliers to ensure every journey meets the highest standards 
            of expertise, enthusiasm, and drive.
          </p>
          <p>
            As experienced tour operators, we specialize in personalizing safaris that combine 
            luxury, style, and authenticity. From comfortable safari vehicles and internal 
            flights to expert-led climbs and tailor-made itineraries, we ensure your 
            adventure is as seamless as it is unforgettable.
          </p>
        </div>

        <div className="about-points">
          <div className="info-card">
            <strong>Our Mission</strong>
            <p>
              To provide quality tourism services that satisfy our customers while 
              committing to the social, cultural, and environmental beauty of our 
              country’s biodiversity.
            </p>
          </div>
          <div className="info-card">
            <strong>Our Vision</strong>
            <p>
              To be your travel champion and companion, wandering the world beside 
              you with innovative guides, competitive prices, and 24/7 customer service.
            </p>
          </div>
          <div className="info-card">
            <strong>Our Standard</strong>
            <p>
              We negotiate the best deals with local suppliers to enhance value for 
              money without ever compromising on product quality or service excellence.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About