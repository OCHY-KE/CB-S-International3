import styles from './styles/AdminPage.module.css'

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

  const getStatusClass = (status) => {
    if (status.includes('Confirmed')) return styles.statusConfirmed
    if (status.includes('Pending')) return styles.statusPending
    if (status.includes('Awaiting')) return styles.statusAwaiting
    return ''
  }

  return (
    <div className={styles.adminShell}>
      <header className={styles.adminHeader}>
        <div>
          <p className={styles.eyebrow}>Admin dashboard</p>
          <h1>Conference Bookings & Safaris International</h1>
        </div>

        <button type="button" className={styles.ctaButton} onClick={onBack}>
          Back to website
        </button>
      </header>

      <section className={`${styles.adminGrid} ${styles.statsGrid}`}>
        {stats.map((item) => (
          <article key={item.label} className={styles.dashboardCard}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className={`${styles.adminGrid} ${styles.dashboardLayout}`}>
        <article className={`${styles.dashboardCard} ${styles.wideCard}`}>
          <div className={styles.cardHeaderRow}>
            <h2>Quick actions</h2>
          </div>

          <div className={styles.actionGrid}>
            <button type="button">Add package</button>
            <button type="button">Create category</button>
            <button type="button">Manage bookings</button>
            <button type="button">Newsletter</button>
          </div>
        </article>

        <article className={styles.dashboardCard}>
          <div className={styles.cardHeaderRow}>
            <h2>Package list</h2>
          </div>
          <ul className={styles.dashboardList}>
            {packages.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className={`${styles.adminGrid} ${styles.dashboardLayout}`}>
        <article className={`${styles.dashboardCard} ${styles.wideCard}`}>
          <div className={styles.cardHeaderRow}>
            <h2>Recent bookings</h2>
          </div>

          <table className={styles.bookingTable}>
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
                  <td><span className={getStatusClass(booking.status)}>{booking.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className={styles.dashboardCard}>
          <div className={styles.cardHeaderRow}>
            <h2>Site settings</h2>
          </div>
          <ul className={`${styles.dashboardList} ${styles.compactList}`}>
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
