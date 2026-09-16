import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../supabaseClient'
import styles from '../styles/CA.module.css'

export default function Conferences() {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSpaceType, setFilterSpaceType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  // Booking Modal State
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [bookingSubmitted, setBookingSubmitted] = useState(false)

  // Fetch Public Conference & Space Listings
  const fetchConferences = useCallback(async () => {
    if (!supabase) {
      setError('Supabase client is not configured.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('conferences')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      const formatted = (data || []).map((item) => ({
        id: item.id,
        title: item.title || '',
        organizer: item.organizer || '',
        location: item.location || 'Nairobi, Kenya',
        spaceType: item.space_type || 'Meeting Room',
        pricingType: item.pricing_type || 'hourly',
        price: item.price ?? 25,
        currency: item.currency || 'USD',
        date: item.date || '',
        time: item.time || '',
        attendees: item.attendees || 0,
        room: item.room || '',
        status: item.status || 'Confirmed',
        notes: item.notes || '',
        features: item.features || '',
        attachmentUrl: item.attachment_url || '',
        attachmentName: item.attachment_name || ''
      }))

      setSpaces(formatted)
    } catch (err) {
      console.error('Error fetching public workspace listings:', err)
      setError('Unable to load available workspaces and meeting rooms.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Real-Time Subscription
  useEffect(() => {
    fetchConferences()

    if (!supabase) return

    const channel = supabase
      .channel('public-conferences-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conferences' },
        () => {
          fetchConferences()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchConferences])

  // Filter & Search Logic
  const filteredSpaces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return spaces.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.organizer.toLowerCase().includes(query) ||
        item.room.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)

      const matchesSpaceType =
        filterSpaceType === 'All' || item.spaceType === filterSpaceType
      const matchesStatus =
        filterStatus === 'All' || item.status === filterStatus

      return matchesSearch && matchesSpaceType && matchesStatus
    })
  }, [spaces, searchQuery, filterSpaceType, filterStatus])

  const handleOpenBookingModal = (space) => {
    setSelectedSpace(space)
    setBookingSubmitted(false)
  }

  const handleCloseBookingModal = () => {
    setSelectedSpace(null)
    setBookingSubmitted(false)
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    setBookingSubmitted(true)
  }

  return (
    <div className={styles.adminSection}>
      {/* Hero Header */}
      <div className={styles.sectionHeader}>
        <div>
          <h2>Flexible Workspaces, Meeting Rooms & Event Halls</h2>
          <p>Explore professional spaces equipped with high-speed internet, AV setups, and flexible booking options.</p>
        </div>
      </div>

      {/* Regus-Style Search & Filter Bar */}
      <div className={styles.toolbar}>
        <input
          type="text"
          aria-label="Search available spaces"
          placeholder="Search by city, center name, or space title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <select
          aria-label="Filter by space type"
          value={filterSpaceType}
          onChange={(e) => setFilterSpaceType(e.target.value)}
          className={styles.selectInput}
        >
          <option value="All">All Space Types</option>
          <option value="Meeting Room">Meeting Room</option>
          <option value="Private Office">Private Office</option>
          <option value="Coworking Desk">Coworking Desk</option>
          <option value="Event Space">Event Space</option>
        </select>
        <select
          aria-label="Filter by availability status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.selectInput}
        >
          <option value="All">All Statuses</option>
          <option value="Confirmed">Available / Confirmed</option>
          <option value="Pending">Reserved / Pending</option>
          <option value="Cancelled">Unavailable</option>
        </select>
      </div>

      {/* Card Grid Display */}
      {loading ? (
        <div className={styles.emptyState}>Loading available workspaces...</div>
      ) : error ? (
        <div className={styles.emptyState} style={{ color: '#e53e3e' }}>
          {error}
        </div>
      ) : (
        <div className={styles.gridContainer}>
          {filteredSpaces.length === 0 ? (
            <div className={styles.emptyState}>
              No matching workspace listings or event spaces found.
            </div>
          ) : (
            filteredSpaces.map((item) => (
              <div key={item.id} className={styles.card}>
                {/* Header Badge Row */}
                <div className={styles.cardHeader}>
                  <span className={styles.spaceTypeBadge}>{item.spaceType}</span>
                  <span
                    className={`${styles.badge} ${
                      styles[item.status.toLowerCase()] || ''
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3>{item.title}</h3>

                <p className={styles.locationText}>
                  📍 <strong>{item.room}</strong> — {item.location}
                </p>

                {/* Pricing Banner */}
                <div className={styles.priceContainer}>
                  <span className={styles.priceAmount}>
                    {item.currency} ${item.price}
                  </span>
                  <span className={styles.priceUnit}> / {item.pricingType}</span>
                </div>

                {/* Specs */}
                <div className={styles.cardDetails}>
                  <span>👥 Up to {item.attendees} people</span>
                  <span>🏢 Host: {item.organizer || 'Regus Partner'}</span>
                  {item.date && <span>📅 Available: {item.date}</span>}
                  {item.time && <span>⏰ {item.time}</span>}
                </div>

                {/* Amenities / Feature Tags */}
                {item.features && (
                  <div className={styles.featureTags}>
                    {item.features.split(',').map((feat, idx) => (
                      <span key={idx} className={styles.tag}>
                        ✓ {feat.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overview Notes */}
                {item.notes && (
                  <p className={styles.notes}>
                    {item.notes}
                  </p>
                )}

                {/* Attachment Link */}
                {item.attachmentUrl && (
                  <p className={styles.attachmentLink}>
                    <a
                      href={item.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📄 Floor Plan & Spec Sheet ({item.attachmentName || 'PDF'})
                    </a>
                  </p>
                )}

                {/* Call to Action */}
                <div className={styles.cardActions} style={{ marginTop: 'auto' }}>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    style={{ width: '100%' }}
                    onClick={() => handleOpenBookingModal(item)}
                    disabled={item.status === 'Cancelled'}
                  >
                    {item.status === 'Cancelled' ? 'Unavailable' : 'Book Space / Inquire'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Booking / Inquiry Modal */}
      {selectedSpace && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent}>
            <h3>Reserve {selectedSpace.title}</h3>
            <p style={{ marginBottom: '1rem', color: '#666', fontSize: '0.9rem' }}>
              📍 {selectedSpace.room}, {selectedSpace.location} • {selectedSpace.currency} ${selectedSpace.price} / {selectedSpace.pricingType}
            </p>

            {bookingSubmitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '0.5rem' }}>Reservation Request Received!</h4>
                <p style={{ fontSize: '0.95rem', color: '#444' }}>
                  A booking representative from <strong>{selectedSpace.organizer || 'our team'}</strong> will contact you shortly to confirm your schedule and payment details.
                </p>
                <button
                  type="button"
                  className={styles.primaryButton}
                  style={{ marginTop: '1.25rem' }}
                  onClick={handleCloseBookingModal}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className={styles.formGrid}>
                <label>
                  Full Name *
                  <input type="text" required placeholder="John Doe" />
                </label>

                <label>
                  Corporate Email *
                  <input type="email" required placeholder="john@company.com" />
                </label>

                <label>
                  Phone Number *
                  <input type="tel" required placeholder="+254 700 000000" />
                </label>

                <label>
                  Requested Date *
                  <input type="date" required defaultValue={selectedSpace.date} />
                </label>

                <label className={styles.fullWidth}>
                  Special Requirements / Notes
                  <textarea
                    rows={3}
                    placeholder="Provide details about catering needs, seating arrangements, or AV requirements..."
                  />
                </label>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={handleCloseBookingModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.primaryButton}>
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}