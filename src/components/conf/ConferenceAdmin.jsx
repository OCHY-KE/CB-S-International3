import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../../supabaseClient'
import Uploader from '../Uploader'
import styles from '../../styles/CA.module.css'

// Regus-inspired initial form state
const INITIAL_FORM_STATE = {
  title: '',
  organizer: '',
  location: 'Nairobi, Kenya',
  spaceType: 'Meeting Room', // Options: Meeting Room, Private Office, Coworking Desk, Event Space
  pricingType: 'hourly', // Options: hourly, daily
  price: 25,
  currency: 'USD',
  date: '',
  time: '',
  attendees: 10,
  room: 'Boardroom A',
  status: 'Confirmed',
  notes: '',
  features: 'High-speed Wi-Fi, AV Equipment, Whiteboard',
  attachmentUrl: '',
  attachmentName: ''
}

export default function ConferenceAdmin() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterSpaceType, setFilterSpaceType] = useState('All')

  // Fetch Conferences / Workspaces from Supabase
  const fetchConferences = useCallback(async () => {
    if (!supabase) {
      setError('Supabase credentials missing. Please check your environment variables.')
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

      setBookings(formatted)
    } catch (err) {
      console.error('Error fetching conference entries:', err)
      setError('Failed to load workspace and event listings.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial Fetch & Real-Time Subscription
  useEffect(() => {
    fetchConferences()

    if (!supabase) return

    const channel = supabase
      .channel('conferences-realtime')
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

  // Form Field Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUploadSuccess = (fileData) => {
    setFormData((prev) => ({
      ...prev,
      attachmentUrl: fileData.url || '',
      attachmentName: fileData.name || 'Uploaded File'
    }))
  }

  const handleRemoveAttachment = () => {
    setFormData((prev) => ({
      ...prev,
      attachmentUrl: '',
      attachmentName: ''
    }))
  }

  // Modal Controllers
  const handleOpenModal = (booking = null) => {
    if (booking) {
      setEditingId(booking.id)
      setFormData({ ...booking })
    } else {
      setEditingId(null)
      setFormData(INITIAL_FORM_STATE)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData(INITIAL_FORM_STATE)
    setEditingId(null)
  }

  // Double Booking Validation Check
  const checkConflict = async (room, date, currentId) => {
    if (!date || !room) return false
    let query = supabase
      .from('conferences')
      .select('id')
      .eq('room', room)
      .eq('date', date)
      .neq('status', 'Cancelled')

    if (currentId) {
      query = query.neq('id', currentId)
    }

    const { data, error: conflictError } = await query
    if (conflictError) throw conflictError
    return data && data.length > 0
  }

  // Submit Handler (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!supabase) {
      alert('Supabase client is not initialized.')
      return
    }

    setSubmitting(true)

    try {
      const hasConflict = await checkConflict(
        formData.room.trim(),
        formData.date,
        editingId
      )

      if (hasConflict) {
        alert(`Conflict Warning: "${formData.room}" is already reserved on ${formData.date}.`)
        setSubmitting(false)
        return
      }

      const payload = {
        title: formData.title.trim(),
        organizer: formData.organizer.trim(),
        location: formData.location.trim(),
        space_type: formData.spaceType,
        pricing_type: formData.pricingType,
        price: parseFloat(formData.price) || 0,
        currency: formData.currency,
        date: formData.date,
        time: formData.time.trim(),
        attendees: Math.max(1, parseInt(formData.attendees, 10) || 1),
        room: formData.room.trim(),
        status: formData.status,
        notes: formData.notes.trim(),
        features: formData.features.trim(),
        attachment_url: formData.attachmentUrl,
        attachment_name: formData.attachmentName
      }

      if (editingId) {
        const { error: updateError } = await supabase
          .from('conferences')
          .update(payload)
          .eq('id', editingId)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('conferences')
          .insert([payload])

        if (insertError) throw insertError
      }

      await fetchConferences()
      handleCloseModal()
    } catch (err) {
      console.error('Error saving workspace listing:', err)
      if (err.code === '42501') {
        alert('Permission Denied: Check Supabase Row Level Security (RLS) policies.')
      } else {
        alert(err.message || 'Failed to save workspace. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this space listing?')) return
    if (!supabase) return

    try {
      const { error: deleteError } = await supabase
        .from('conferences')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setBookings((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      console.error('Error deleting entry:', err)
      alert('Failed to delete the selected space.')
    }
  }

  // Search & Filter Logic
  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return bookings.filter((b) => {
      const matchesSearch =
        !query ||
        b.title.toLowerCase().includes(query) ||
        b.organizer.toLowerCase().includes(query) ||
        b.room.toLowerCase().includes(query) ||
        b.location.toLowerCase().includes(query)

      const matchesStatus = filterStatus === 'All' || b.status === filterStatus
      const matchesType = filterSpaceType === 'All' || b.spaceType === filterSpaceType

      return matchesSearch && matchesStatus && matchesType
    })
  }, [bookings, searchQuery, filterStatus, filterSpaceType])

  return (
    <div className={styles.adminSection}>
      {/* Regus Header */}
      <div className={styles.sectionHeader}>
        <div>
          <h2>Workspaces, Meeting Rooms & Event Halls</h2>
          <p>Manage office suites, hourly meeting rooms, and corporate event spaces.</p>
        </div>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => handleOpenModal()}
        >
          + Post Workspace / Listing
        </button>
      </div>

      {/* Regus Search & Filter Bar */}
      <div className={styles.toolbar}>
        <input
          type="text"
          aria-label="Search listings"
          placeholder="Search by center, city, or room name..."
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
          aria-label="Filter by status"
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

      {/* Card Grid */}
      {loading ? (
        <div className={styles.emptyState}>Loading workspaces...</div>
      ) : error ? (
        <div className={styles.emptyState} style={{ color: '#e53e3e' }}>{error}</div>
      ) : (
        <div className={styles.gridContainer}>
          {filteredBookings.length === 0 ? (
            <div className={styles.emptyState}>No matching workspace listings found.</div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className={styles.card}>
                {/* Header Tag & Status */}
                <div className={styles.cardHeader}>
                  <span className={styles.spaceTypeBadge}>{booking.spaceType}</span>
                  <span className={`${styles.badge} ${styles[booking.status.toLowerCase()] || ''}`}>
                    {booking.status}
                  </span>
                </div>

                <h3>{booking.title}</h3>

                <p className={styles.locationText}>
                  📍 <strong>{booking.room}</strong> — {booking.location}
                </p>

                {/* Regus Style Rate Display */}
                <div className={styles.priceContainer}>
                  <span className={styles.priceAmount}>
                    {booking.currency} ${booking.price}
                  </span>
                  <span className={styles.priceUnit}> / {booking.pricingType}</span>
                </div>

                {/* Spec Badges */}
                <div className={styles.cardDetails}>
                  <span>👥 Up to {booking.attendees} people</span>
                  <span>🏢 {booking.organizer || 'Regus Partner'}</span>
                  {booking.date && <span>📅 {booking.date}</span>}
                  {booking.time && <span>⏰ {booking.time}</span>}
                </div>

                {/* Amenities / Feature Tags */}
                {booking.features && (
                  <div className={styles.featureTags}>
                    {booking.features.split(',').map((feat, idx) => (
                      <span key={idx} className={styles.tag}>
                        ✓ {feat.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description / Notes */}
                {booking.notes && (
                  <p className={styles.notes}>
                    {booking.notes}
                  </p>
                )}

                {/* PDF Spec Sheet */}
                {booking.attachmentUrl && (
                  <p className={styles.attachmentLink}>
                    <a href={booking.attachmentUrl} target="_blank" rel="noopener noreferrer">
                      📄 View Floor Plan & Specs ({booking.attachmentName || 'PDF'})
                    </a>
                  </p>
                )}

                {/* Action Controls */}
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => handleOpenModal(booking)}
                  >
                    Edit Space
                  </button>
                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={() => handleDelete(booking.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Post/Edit Workspace Modal */}
      {isModalOpen && (
        <BookingModal
          editingId={editingId}
          formData={formData}
          submitting={submitting}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleCloseModal={handleCloseModal}
          handleUploadSuccess={handleUploadSuccess}
          handleRemoveAttachment={handleRemoveAttachment}
        />
      )}
    </div>
  )
}

function BookingModal({
  editingId,
  formData,
  submitting,
  handleInputChange,
  handleSubmit,
  handleCloseModal,
  handleUploadSuccess,
  handleRemoveAttachment
}) {
  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modalContent}>
        <h3>{editingId ? 'Edit Workspace Listing' : 'Post New Workspace / Event Space'}</h3>

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <label>
            Listing / Space Title *
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Executive Boardroom at Delta Corner"
              value={formData.title}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Center / Host Provider *
            <input
              type="text"
              name="organizer"
              required
              placeholder="e.g. Regus Westlands Center"
              value={formData.organizer}
              onChange={handleInputChange}
            />
          </label>

          <label>
            City / Address Location *
            <input
              type="text"
              name="location"
              required
              placeholder="e.g. Chiromo Road, Westlands, Nairobi"
              value={formData.location}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Space Category *
            <select
              name="spaceType"
              value={formData.spaceType}
              onChange={handleInputChange}
            >
              <option value="Meeting Room">Meeting Room</option>
              <option value="Private Office">Private Office</option>
              <option value="Coworking Desk">Coworking Desk</option>
              <option value="Event Space">Event Space</option>
            </select>
          </label>

          <label>
            Rate Price *
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              required
              placeholder="e.g. 35"
              value={formData.price}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Billing Unit
            <select
              name="pricingType"
              value={formData.pricingType}
              onChange={handleInputChange}
            >
              <option value="hourly">Per Hour</option>
              <option value="daily">Per Day</option>
              <option value="monthly">Per Month</option>
            </select>
          </label>

          <label>
            Room Name / Number *
            <input
              type="text"
              name="room"
              required
              placeholder="e.g. Suite 402 / Boardroom B"
              value={formData.room}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Max Seating Capacity
            <input
              type="number"
              name="attendees"
              min="1"
              value={formData.attendees}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Available Date (Optional)
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Operating Hours / Slot (Optional)
            <input
              type="text"
              name="time"
              placeholder="e.g. 08:00 AM - 06:00 PM"
              value={formData.time}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Confirmed">Confirmed / Available</option>
              <option value="Pending">Pending / Reserved</option>
              <option value="Cancelled">Unavailable</option>
            </select>
          </label>

          <label className={styles.fullWidth}>
            Key Included Features (Comma Separated)
            <input
              type="text"
              name="features"
              placeholder="e.g. High-speed Wi-Fi, AV Screen, Whiteboard, Coffee Service"
              value={formData.features}
              onChange={handleInputChange}
            />
          </label>

          <label className={styles.fullWidth}>
            Description & Space Notes
            <textarea
              name="notes"
              rows={3}
              placeholder="Describe access options, natural lighting, catering facilities..."
              value={formData.notes}
              onChange={handleInputChange}
            />
          </label>

          <div className={styles.fullWidth}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Floor Plan, PDF Spec Sheet, or Brochure
            </label>
            {formData.attachmentUrl ? (
              <div className={styles.attachmentPreview}>
                <span>📄 {formData.attachmentName || 'Uploaded File'}</span>
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className={styles.dangerButton}
                  style={{ marginLeft: '12px', padding: '4px 8px' }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <Uploader
                bucket="CBSI"
                folder="Conferences"
                label="Upload Spec Sheet or Floor Plan (PDF/Image)"
                allowedTypes={['image/jpeg', 'image/png', 'application/pdf']}
                maxSizeMB={25}
                onUploadSuccess={handleUploadSuccess}
              />
            )}
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={handleCloseModal}
              className={styles.secondaryButton}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Publish Space'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}