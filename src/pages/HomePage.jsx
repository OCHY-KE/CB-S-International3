const stats = [
  { value: '4', label: 'Core operating modules' },
  { value: '24/7', label: 'Booking and support access' },
  { value: '100%', label: 'Responsive user experience' },
]

const modules = [
  {
    title: 'Admin Panel',
    items: [
      'Create new tour and safari packages',
      'Edit or delete existing packages',
      'Create, edit, or delete categories',
      'Add contents and images to packages',
      'Manage client bookings and newsletter',
      'Create and manage blogs, reviews, and team profiles',
    ],
  },
  {
    title: 'User Panel',
    items: [
      'Browse and search tour and safari packages',
      'Inquire and book packages',
      'Create personal tour packages',
      'Post reviews and comments on packages',
      'Browse blogs and chat via WhatsApp',
      'Like, share, and subscribe to updates',
    ],
  },
  {
    title: 'Main Website',
    items: [
      'User-friendly, interactive portal',
      'Fully responsive website experience',
      'Filter packages by price range',
      'Book packages and make enquiries',
      'Comment on blogs and review tours',
      'Newsletter subscription and WhatsApp live chat',
    ],
  },
  {
    title: 'API Integration',
    items: [
      'Social media API integration',
      'WhatsApp live chat API integration',
      'Tripadvisor API integration',
      'SafariBookings API integration',
      'Language converter API integration',
    ],
  },
]

function HomePage() {
  return (
    <>
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">Tour bookings • Safaris • Conferences</span>
            <h1>End-to-end travel and event booking solutions.</h1>
            <p>
              Conference Bookings & Safaris International brings together booking,
              customer management, content publishing, and digital engagement in one
              powerful platform for tour operators and safari businesses.
            </p>

            <div className="hero-actions">
              <a className="cta-button primary" href="#modules">
                Explore modules
              </a>
              <a className="cta-button light" href="#contact">
                Contact us
              </a>
            </div>

            <div className="stat-row" aria-label="Platform highlights">
              {stats.map((item) => (
                <div key={item.label} className="stat-item">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel" aria-label="Business overview">
            <div className="panel-card main-card">
              <p className="panel-label">Platform overview</p>
              <h2>Smart</h2>
              <p>
                Admin management, customer bookings, community engagement, and live
                travel integrations in one digital ecosystem.
              </p>
            </div>
            <div className="mini-grid">
              <div className="panel-card small-card">
                <span>Bookings</span>
                <strong>24/7</strong>
              </div>
              <div className="panel-card small-card highlight">
                <span>Support</span>
                <strong>Live</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="modules" className="info-section">
          <div className="section-heading">
            <span className="eyebrow">Main modules</span>
            <h2>Built for administrators, travelers, and growth.</h2>
          </div>

          <div className="card-grid modules-grid">
            {modules.map((module) => (
              <article key={module.title} className="service-card module-card">
                <div className="card-icon">◆</div>
                <h3>{module.title}</h3>
                <ul className="feature-list">
                  {module.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="process-section">
          <div className="section-heading left">
            <span className="eyebrow">Core experience</span>
            <h2>Everything travelers and admins need in one place.</h2>
          </div>

          <div className="process-list" aria-label="Core values">
            {[
              'Search and compare tour packages',
              'Book and enquire with ease',
              'Manage content and categories centrally',
              'Deliver live support through WhatsApp and social channels',
            ].map((step, index) => (
              <div key={step} className="process-step">
                <span className="step-number">0{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="footer">
        <div>
          <span className="eyebrow">Let's build your next travel experience</span>
          <h2>Ready to grow with smarter bookings?</h2>
        </div>
        <a className="cta-button primary" href="mailto:hello@conferencebookingsandsafaris.com">
          hello@conferencebookingsandsafaris.com
        </a>
      </footer>
    </>
  )
}

export default HomePage
