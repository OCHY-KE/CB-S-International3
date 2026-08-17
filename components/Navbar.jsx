import '../src/App.css'

const navItems = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
]

function Navbar({ currentPage, onPageChange }) {
  const handleNavClick = (e, page) => {
    e.preventDefault()
    onPageChange(page)
  }

  return (
    <header className="site-header">
      <div className="brand-wrap">
        <img src="https://res.cloudinary.com/cioghqt5/image/upload/v1786973128/cbsi1.ico" alt="CB SI Logo" className="brand-logo" />
        <div className="brand-copy">
          <p className="brand-name">Conference Bookings & Safaris International</p>
          <span className="brand-tag">defining safari frontiers</span>
        </div>
      </div>

      <nav className="nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            key={item.page}
            href="#"
            onClick={(e) => handleNavClick(e, item.page)}
            className={currentPage === item.page ? 'active' : ''}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        <button type="button" className="nav-link" onClick={(e) => { e.preventDefault(); onPageChange('user-login'); }}>
          User Login
        </button>
        <button type="button" className="nav-link" onClick={(e) => { e.preventDefault(); onPageChange('admin-login'); }}>
          Admin Login
        </button>
        <a className="cta-button secondary" href="#contact">
          Book a consultation
        </a>
      </div>
    </header>
  )
}

export default Navbar
