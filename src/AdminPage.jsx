function AdminPage({ onBack }) {
  const stats = [
    { label: 'Total bookings', value: '184' },
    { label: 'Safari packages', value: '32' },
    { label: 'Categories', value: '09' },
    { label: 'Blog posts', value: '12' },
  ]

  const bookings = [
    { name: 'Maya Johnson', trip: 'Masai Mara Escape', status: 'Confirmed' },
    { name: 'David Smith', trip: 'Cape Town Adventure', status: 'Pending' },
    { name: 'Aisha Bello', trip: 'Kilimanjaro Trek', status: 'Awaiting payment' },
  ]

  const packages = [
    'Luxury Safari Retreat',
    'Conference Travel Bundle',
    'Weekend Kigali City Tour',
    'Wildlife & Beach Combo',
  ]

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Conference Bookings & Safaris International</h1>
        </div>

        <button type="button" className="cta-button primary" onClick={onBack}>
          Back to website
        </button>
      </header>

      <section className="admin-grid stats-grid">
        {stats.map((item) => (
          <article key={item.label} className="dashboard-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-grid dashboard-layout">
        <article className="dashboard-card wide-card">
          <div className="card-header-row">
            <h2>Quick actions</h2>
          </div>

          <div className="action-grid">
            <button type="button">Add package</button>
            <button type="button">Create category</button>
            <button type="button">Manage bookings</button>
            <button type="button">Newsletter</button>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="card-header-row">
            <h2>Package list</h2>
          </div>
          <ul className="dashboard-list">
            {packages.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="admin-grid dashboard-layout">
        <article className="dashboard-card wide-card">
          <div className="card-header-row">
            <h2>Recent bookings</h2>
          </div>

          <table className="booking-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Trip</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.name}>
                  <td>{booking.name}</td>
                  <td>{booking.trip}</td>
                  <td>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="dashboard-card">
          <div className="card-header-row">
            <h2>Site settings</h2>
          </div>
          <ul className="dashboard-list compact-list">
            <li>Manage blogs</li>
            <li>Client reviews</li>
            <li>Social media links</li>
            <li>Team profiles</li>
            <li>Approve comments</li>
          </ul>
        </article>
      </section>
    </div>
  )
}

export default AdminPage
