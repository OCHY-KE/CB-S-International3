import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Plus, Loader, Sparkles, Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../supabaseClient'
import ItineraryCard from '../components/it/IC'
import ItineraryModal from '../components/it/IM'
import styles from '../styles/ItinerariesAdmin.module.css'

const CATEGORIES = [
  'All',
  'Safari & Adventure',
  'Luxury Safari',
  'Mid-Range Safari',
  'Corporate Retreat'
]

const DEFAULT_FORM_STATE = {
  title: '',
  duration: '',
  category: 'Safari & Adventure',
  route: '',
  featured_image: '',
  days: [{ day: 1, location: '', activity: '', media: { images: [], video: '' } }]
}

const ItinerariesAdmin = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedPkg, setExpandedPkg] = useState(null)
  
  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Touch handling for mobile lightbox swipe
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Slideshow State
  const [activeSlideshow, setActiveSlideshow] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0
  })

  const [formData, setFormData] = useState(DEFAULT_FORM_STATE)

  // Fetch packages from Supabase
  const fetchPackages = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching packages:', error.message)
    } else {
      setPackages(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  // Lock body scroll when overlay modals or slideshows are open
  useEffect(() => {
    if (isModalOpen || activeSlideshow.isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [isModalOpen, activeSlideshow.isOpen])

  // Filtered packages pipeline
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesCategory = selectedCategory === 'All' || pkg.category === selectedCategory
      const matchesSearch = pkg.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pkg.route?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [packages, selectedCategory, searchQuery])

  // Slideshow Actions
  const openSlideshow = (images, startIndex = 0) => {
    setActiveSlideshow({ isOpen: true, images, currentIndex: startIndex })
  }

  const closeSlideshow = useCallback(() => {
    setActiveSlideshow({ isOpen: false, images: [], currentIndex: 0 })
  }, [])

  const nextSlide = useCallback(() => {
    setActiveSlideshow((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }))
  }, [])

  const prevSlide = useCallback(() => {
    setActiveSlideshow((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }))
  }, [])

  // Mobile Swipe Gesture Handlers for Slideshow
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 40
    const isRightSwipe = distance < -40

    if (isLeftSwipe && activeSlideshow.images.length > 1) {
      nextSlide()
    } else if (isRightSwipe && activeSlideshow.images.length > 1) {
      prevSlide()
    }

    touchStartX.current = 0
    touchEndX.current = 0
  }

  // Keyboard Navigation for Slideshow
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeSlideshow.isOpen) return
      if (e.key === 'Escape') closeSlideshow()
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSlideshow.isOpen, closeSlideshow, nextSlide, prevSlide])

  const toggleExpand = (id) => {
    setExpandedPkg((prev) => (prev === id ? null : id))
  }

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setEditingId(pkg.id)
      setFormData({
        title: pkg.title || '',
        duration: pkg.duration || '',
        category: pkg.category || 'Safari & Adventure',
        route: pkg.route || '',
        featured_image: pkg.featured_image || '',
        days: pkg.days && pkg.days.length > 0 
          ? (typeof structuredClone === 'function' ? structuredClone(pkg.days) : JSON.parse(JSON.stringify(pkg.days)))
          : DEFAULT_FORM_STATE.days
      })
    } else {
      setEditingId(null)
      setFormData(DEFAULT_FORM_STATE)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData(DEFAULT_FORM_STATE)
  }

  const handleSavePackage = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.duration) return

    setIsSaving(true)
    let result

    if (editingId) {
      result = await supabase
        .from('itineraries')
        .update(formData)
        .eq('id', editingId)
    } else {
      result = await supabase
        .from('itineraries')
        .insert([formData])
    }

    setIsSaving(false)

    if (result.error) {
      console.error('Error saving itinerary:', result.error.message)
      alert('Failed to save itinerary. Check console for details.')
    } else {
      handleCloseModal()
      fetchPackages()
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this itinerary package?')) return

    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting package:', error.message)
      alert('Failed to delete itinerary.')
    } else {
      fetchPackages()
    }
  }

  return (
    <div className={styles.sectionContainer}>
      {/* Header Area */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.liveTag}>
            <Sparkles size={13} />
            <span>Itinerary Portal</span>
          </div>
          <h2>Safari Packages & Timelines</h2>
          <p>Curate featured expeditions, upload travel media, and publish interactive itineraries.</p>
        </div>
        <button className={styles.addButton} onClick={() => handleOpenModal()}>
          <Plus size={18} />
          <span>New Expedition</span>
        </button>
      </header>

      {/* Responsive Filter & Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.categoryTabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.tabBtn} ${selectedCategory === cat ? styles.activeTab : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search itineraries or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search itineraries"
          />
          {searchQuery && (
            <button 
              className={styles.clearSearch} 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid / States Container */}
      {loading ? (
        <div className={styles.loadingState}>
          <Loader className={styles.spinner} size={32} />
          <p>Loading featured itineraries...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <SlidersHorizontal size={28} />
          </div>
          <h3>No Itineraries Found</h3>
          <p>Try adjusting your search query or switching active filters.</p>
        </div>
      ) : (
        <div className={styles.packageGrid}>
          {filteredPackages.map((pkg) => (
            <ItineraryCard
              key={pkg.id}
              pkg={pkg}
              isExpanded={expandedPkg === pkg.id}
              onToggleExpand={() => toggleExpand(pkg.id)}
              onEdit={() => handleOpenModal(pkg)}
              onDelete={() => handleDelete(pkg.id)}
              onOpenSlideshow={openSlideshow}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <ItineraryModal
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          isSaving={isSaving}
          onClose={handleCloseModal}
          onSave={handleSavePackage}
        />
      )}

      {/* Lightbox / Slideshow Modal */}
      {activeSlideshow.isOpen && (
        <div className={styles.slideshowOverlay} onClick={closeSlideshow}>
          <button 
            className={styles.slideshowClose} 
            onClick={closeSlideshow}
            aria-label="Close slideshow"
          >
            <X size={24} />
          </button>
          
          {activeSlideshow.images.length > 1 && (
            <>
              <button 
                className={`${styles.slideNavBtn} ${styles.prev}`} 
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
              <button 
                className={`${styles.slideNavBtn} ${styles.next}`} 
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div 
            className={styles.slideshowContainer} 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img 
              src={activeSlideshow.images[activeSlideshow.currentIndex]} 
              alt={`Slide ${activeSlideshow.currentIndex + 1} of ${activeSlideshow.images.length}`} 
            />
            <span className={styles.slideCounter}>
              {activeSlideshow.currentIndex + 1} / {activeSlideshow.images.length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItinerariesAdmin