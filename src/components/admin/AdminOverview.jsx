import React from 'react'
import { Film, PlusCircle, Users, MessageSquare, Compass } from 'lucide-react'
import styles from '../../styles/AV.module.css'

export default function AdminOverview({ onTabChange }) {
  const stats = [
    { label: 'Total Bookings', value: '184', change: '+12% this month' },
    { label: 'Safari Packages', value: '32', change: '4 Featured' },
    { label: 'Gallery Media', value: '4K Live', change: 'High resolution' },
    { label: 'Client Satisfaction', value: '99.4%', change: 'Based on 500+ reviews' },
  ]

  const bookings = [
    { name: 'Maya Johnson', trip: 'Masai Mara Escape', date: 'Oct 14, 2026', status: 'Confirmed' },
    { name: 'David Smith', trip: 'Cape Town Adventure', date: 'Oct 18, 2026', status: 'Pending' },
    { name: 'Aisha Bello', trip: 'Kilimanjaro Trek', date: 'Nov 02, 2026', status: 'Awaiting Payment' },
  ]

  const packages = [
    'Luxury Safari Retreat (Mara & Serengeti)',
    'UN & Corporate Conference Travel Bundle',
    'Weekend Kigali Gorilla Trekking Tour',
    'Diani Beach & Tsavo Wildlife Combo',
  ]

  const getStatusClass = (status) => {
    if (status.includes('Confirmed')) return styles.statusConfirmed
    if (status.includes('Pending')) return styles.statusPending
    if (status.includes('Awaiting')) return styles.statusAwaiting
    return ''
  }

  return (
    <div className={styles.contentArea}>
      {/* Stats Bar */}
      <section className={styles.statsGrid}>
        {stats.map((item) => (
          <article key={item.label} className={styles.statCard}>
            <span className={styles.statLabel}>{item.label}</span>
            <strong className={styles.statValue}>{item.value}</strong>
            <span className={styles.statChange}>{item.change}</span>
          </article>
        ))}
      </section>

      {/* Management Hub & Packages */}
      <section className={styles.dashboardLayout}>
        <article className={styles.dashboardCard}>
          <div className={styles.cardHeaderRow}>
            <h2>Quick Management Hub</h2>
          </div>
          <div className={styles.actionGrid}>
            <button type="button" className={styles.actionTile} onClick={() => onTabChange('gallery')}>
              <Film size={20} />
              <span>Post to Gallery</span>
            </button>
            
            <button type="button" className={styles.actionTile} onClick={() => onTabChange('itineraries')}>
              <PlusCircle size={20} />
              <span>Add Safari Package</span>
            </button>
            
            <button type="button" className={styles.actionTile}>
              <Users size={20} />
              <span>Manage Bookings</span>
            </button>
            
            <button type="button" className={styles.actionTile}>
              <MessageSquare size={20} />
              <span>Client Inquiries</span>
            </button>
          </div>
        </article>

        <article className={styles.dashboardCard}>
          <div className={styles.cardHeaderRow}>
            <h2>Featured Safari Packages</h2>
          </div>
          <ul className={styles.packageList}>
            {packages.map((item) => (
              <li key={item} className={styles.packageItem}>
                <Compass size={16} className={styles.itemIcon} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {/* Recent Bookings Section */}
      <section className={styles.tableCard}>
        <div className={styles.cardHeaderRow}>
          <h2>Recent Reservations</h2>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.bookingsTable}>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Selected Trip</th>
                <th>Booking Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.name}>
                  <td className={styles.clientName}>{booking.name}</td>
                  <td>{booking.trip}</td>
                  <td>{booking.date}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}