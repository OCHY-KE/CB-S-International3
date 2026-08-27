import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  LayoutDashboard,
  Film,
  ShieldCheck,
  Globe,
  Compass,
  LogOut,
  PlusCircle,
  Users,
  MessageSquare,
  ArrowLeft
} from 'lucide-react'
import { adminSignOut } from '../utils/auth'
import AdminGallery from './AdminGallery'
import ItinerariesAdmin from './ItinerariesAdmin'
import styles from '../styles/AdminPage.module.css'

function AdminPage({ onBack }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(initialTab)

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
    <div className={styles.adminShell}>
      {/* Top Console Header */}
      <header className={styles.adminHeader}>
        <div className={styles.brandInfo}>
          <div className={styles.eyebrow}>
            <ShieldCheck size={16} />
            <span>CBSI Management Console</span>
          </div>
          <h1>Conference Bookings & Safaris International</h1>
        </div>

        <div className={styles.headerActions}>
          <button 
            type="button" 
            className={styles.ctaButtonSecondary} 
            onClick={() => window.open('/', '_blank')}
          >
            <Globe size={16} /> 
            <span>View Live Site</span>
          </button>
          
          <button 
            type="button" 
            className={styles.ctaButtonSecondary} 
            onClick={handleBack}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
          
          <button 
            type="button" 
            className={styles.signOutButton} 
            onClick={async () => { 
              await adminSignOut(); 
              navigate('/admin-login'); 
            }}
          >
            <LogOut size={16} /> 
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={styles.tabBar}>
        <button
          type="button"
          onClick={() => handleTabChange('overview')}
          className={activeTab === 'overview' ? styles.activeTab : styles.inactiveTab}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('itineraries')}
          className={activeTab === 'itineraries' ? styles.activeTab : styles.inactiveTab}
        >
          <Compass size={18} />
          <span>Safari Itineraries</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('gallery')}
          className={activeTab === 'gallery' ? styles.activeTab : styles.inactiveTab}
        >
          <Film size={18} />
          <span>Gallery Studio</span>
        </button>
      </nav>

      {/* Tab 1: Overview Dashboard */}
      {activeTab === 'overview' && (
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
                <button type="button" className={styles.actionTile} onClick={() => handleTabChange('gallery')}>
                  <Film size={20} />
                  <span>Post to Gallery</span>
                </button>
                
                <button type="button" className={styles.actionTile} onClick={() => handleTabChange('itineraries')}>
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
      )}

      {/* Tab 2: Itineraries Admin */}
      {activeTab === 'itineraries' && (
        <div className={styles.contentArea}>
          <ItinerariesAdmin />
        </div>
      )}

      {/* Tab 3: Gallery Admin */}
      {activeTab === 'gallery' && (
        <div className={styles.contentArea}>
          <AdminGallery onBack={() => handleTabChange('overview')} />
        </div>
      )}
    </div>
  )
}

export default AdminPage