import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  LayoutDashboard,
  Film,
  Image as ImageIcon,
  PlusCircle,
  CalendarCheck,
  Globe,
  Settings,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Users,
  Compass,
  LogOut
} from 'lucide-react'
import { adminSignOut } from '../utils/auth'
import AdminGallery from './AdminGallery'
import styles from '../styles/AdminPage.module.css'

function AdminPage({ onBack }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(initialTab) // 'overview' | 'gallery'

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchParams({ tab })
  }

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack()
    } else {
      navigate('/')
    }
  }

  const stats = [
    { label: 'Total bookings', value: '184' },
    { label: 'Safari packages', value: '32' },
    { label: 'Gallery Media', value: '4K Live' },
    { label: 'Client Satisfaction', value: '99.4%' },
  ]

  const bookings = [
    { name: 'Maya Johnson', trip: 'Masai Mara Escape', status: 'Confirmed' },
    { name: 'David Smith', trip: 'Cape Town Adventure', status: 'Pending' },
    { name: 'Aisha Bello', trip: 'Kilimanjaro Trek', status: 'Awaiting payment' },
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
    <div className={styles.adminShell}>
      {/* Top Header Card */}
      <header className={styles.adminHeader}>
        <div>
          <p className={styles.eyebrow}>
            <ShieldCheck size={16} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
            CBSI Management Console
          </p>
          <h1>Conference Bookings & Safaris International</h1>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className={styles.ctaButton}
            style={{ background: '#ffffff', color: 'var(--navy-blue)', border: '1px solid var(--border-color)' }}
            onClick={() => window.open('/gallery', '_blank')}
          >
            <Globe size={16} style={{ verticalAlign: '-2px', marginRight: '6px' }} />
            View Live Site
          </button>

          <button type="button" className={styles.ctaButton} onClick={handleBack}>
            Back to Home
          </button>

          <button
            type="button"
            className={styles.ctaButton}
            style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            onClick={async () => {
              await adminSignOut();
              navigate('/admin-login');
            }}
            title="Sign out of Admin Session"
          >
            <LogOut size={16} style={{ verticalAlign: '-2px', marginRight: '6px' }} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div style={{ maxWidth: '1300px', margin: '0 auto 2rem', display: 'flex', gap: '10px', borderBottom: '2px solid #e2e8f0', paddingBottom: '4px' }}>
        <button
          type="button"
          onClick={() => handleTabChange('overview')}
          style={{
            padding: '10px 24px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            background: activeTab === 'overview' ? 'var(--navy-blue)' : 'transparent',
            color: activeTab === 'overview' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard Overview</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('gallery')}
          style={{
            padding: '10px 24px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            background: activeTab === 'gallery' ? 'var(--navy-blue)' : 'transparent',
            color: activeTab === 'gallery' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Film size={18} />
          <span>Gallery & Media Studio</span>
          <span style={{
            background: activeTab === 'gallery' ? 'var(--primary-gold)' : '#e2e8f0',
            color: activeTab === 'gallery' ? '#071321' : '#475569',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            Post Videos / Photos
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <>
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
                <h2>Quick Management Hub</h2>
              </div>

              <div className={styles.actionGrid}>
                <button
                  type="button"
                  onClick={() => handleTabChange('gallery')}
                  style={{ background: 'linear-gradient(135deg, #0b1d4d, #1e3a8a)' }}
                >
                  🎬 Post to Gallery
                </button>
                <button type="button">Add Package</button>
                <button type="button">Manage Bookings</button>
                <button type="button">Client Inquiries</button>
              </div>
            </article>

            <article className={styles.dashboardCard}>
              <div className={styles.cardHeaderRow}>
                <h2>Featured Safari Packages</h2>
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
                <h2>Recent Client Bookings & Inquiries</h2>
              </div>

              <table className={styles.bookingTable}>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Trip / Itinerary</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.name}>
                      <td><strong>{booking.name}</strong></td>
                      <td>{booking.trip}</td>
                      <td><span className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>{booking.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>

            <article className={styles.dashboardCard}>
              <div className={styles.cardHeaderRow}>
                <h2>Site Operations</h2>
              </div>
              <ul className={`${styles.dashboardList} ${styles.compactList}`}>
                <li onClick={() => handleTabChange('gallery')} style={{ cursor: 'pointer', color: 'var(--primary-gold)', fontWeight: 600 }}>
                  📸 Gallery Media & Video Studio →
                </li>
                <li>Conference Hall Bookings</li>
                <li>Vehicle Fleet Scheduling</li>
                <li>Review Moderation</li>
                <li>MICE Delegation Lists</li>
              </ul>
            </article>
          </section>
        </>
      )}

      {/* TAB 2: GALLERY & VIDEO/IMAGE POSTING STUDIO */}
      {activeTab === 'gallery' && (
        <AdminGallery onBack={() => handleTabChange('overview')} />
      )}
    </div>
  )
}

export default AdminPage