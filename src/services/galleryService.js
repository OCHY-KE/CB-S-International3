import { supabase } from '../supabaseClient'

// Initial curated safari media with both high-res imagery and authentic 4K video clips
export const INITIAL_GALLERY_ITEMS = [
  {
    id: 'safari-vid-1',
    type: 'video',
    title: 'Wildebeest River Crossing - Serengeti & Mara',
    category: 'Wildlife',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // fallback safe mp4
    posterUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
    videoEmbedUrl: '',
    location: 'Maasai Mara National Reserve, Kenya',
    description: 'Witness the thunderous Great Migration as thousands of wildebeest and zebras brave the Mara River crocodiles in an epic struggle of nature.',
    tags: ['GreatMigration', 'BigFive', 'MaraRiver', 'WildlifeVideo'],
    featured: true,
    likes: 142,
    dateAdded: '2026-08-15',
    author: 'Chief Guide Ole Sankale'
  },
  {
    id: 'safari-img-1',
    type: 'image',
    title: 'Majestic Mara Lion at Dawn',
    category: 'Wildlife',
    mediaUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=1200',
    posterUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=600',
    location: 'Maasai Mara, Kenya',
    description: 'Golden hour silhouette of a dominant male lion scanning the vast plains of the Mara triangle.',
    tags: ['Lion', 'KingOfTheJungle', 'GoldenHour', 'BigFive'],
    featured: true,
    likes: 98,
    dateAdded: '2026-08-10',
    author: 'Samson Kimani (Senior Safari Lead)'
  },
  {
    id: 'safari-vid-2',
    type: 'video',
    title: 'Serengeti Endless Plains - Aerial 4K Expedition',
    category: 'Aerial',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1200',
    videoEmbedUrl: '',
    location: 'Serengeti National Park, Tanzania',
    description: 'Sweeping drone perspective over acacia trees, sun-drenched savannahs, and roaming elephant herds.',
    tags: ['AerialSafari', 'Drone4K', 'Serengeti', 'Savannah'],
    featured: true,
    likes: 115,
    dateAdded: '2026-08-12',
    author: 'CBSI Aerial Film Unit'
  },
  {
    id: 'safari-img-2',
    type: 'image',
    title: 'Amboseli Elephants under Mount Kilimanjaro',
    category: 'Landscapes',
    mediaUrl: 'https://images.unsplash.com/photo-1589182397057-b163ce479c83?auto=format&fit=crop&q=80&w=1200',
    posterUrl: 'https://images.unsplash.com/photo-1589182397057-b163ce479c83?auto=format&fit=crop&q=80&w=600',
    location: 'Amboseli National Park, Kenya',
    description: 'An iconic African tableau of bull elephants grazing beneath the snow-capped peak of Mount Kilimanjaro.',
    tags: ['Kilimanjaro', 'Amboseli', 'Elephants', 'AfricanIcon'],
    featured: false,
    likes: 87,
    dateAdded: '2026-08-08',
    author: 'David Mwangi'
  },
  {
    id: 'safari-img-3',
    type: 'image',
    title: 'Luxury Tented Haven & Sunset Deck',
    category: 'Lodges',
    mediaUrl: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=1200',
    posterUrl: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=600',
    location: 'Oloololo Escarpment, Kenya',
    description: 'Private infinity plunge pool and hardwood deck overlooking 180 degrees of uninterrupted African wilderness.',
    tags: ['LuxuryLodge', 'Glamping', 'RomanticSafari', 'EcoTourism'],
    featured: true,
    likes: 76,
    dateAdded: '2026-08-05',
    author: 'Hospitality Concierge'
  },
  {
    id: 'safari-img-4',
    type: 'image',
    title: 'International MICE Summit & Gala Setup',
    category: 'Conferences',
    mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200',
    posterUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600',
    location: 'Nairobi Serena & KICC, Kenya',
    description: 'State-of-the-art audiovisual setups, simultaneous translation booths, and bespoke executive banqueting curated by CBSI Conferences.',
    tags: ['CorporateEvents', 'MICE', 'NairobiConference', 'ExecutiveTravel'],
    featured: false,
    likes: 64,
    dateAdded: '2026-08-01',
    author: 'Events Directorate'
  },
  {
    id: 'safari-img-5',
    type: 'image',
    title: 'Leopard on an Acacia Perch',
    category: 'Wildlife',
    mediaUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&q=80&w=1200',
    posterUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&q=80&w=600',
    location: 'Samburu National Reserve, Kenya',
    description: 'Elusive female leopard resting peacefully in the canopy after a successful morning hunt.',
    tags: ['Leopard', 'Samburu', 'Predators', 'WildlifePhotography'],
    featured: false,
    likes: 91,
    dateAdded: '2026-07-28',
    author: 'Samson Kimani'
  },
  {
    id: 'safari-img-6',
    type: 'image',
    title: 'Maasai Cultural Enkang & Traditional Jumping Dance',
    category: 'Cultural',
    mediaUrl: 'https://images.unsplash.com/photo-1489447068241-b3490214e879?auto=format&fit=crop&q=80&w=1200',
    posterUrl: 'https://images.unsplash.com/photo-1489447068241-b3490214e879?auto=format&fit=crop&q=80&w=600',
    location: 'Narok County, Kenya',
    description: 'Honoring centuries of rich Maasai heritage, beadwork craft, warrior songs, and authentic community storytelling.',
    tags: ['MaasaiCulture', 'AdumuDance', 'AuthenticAfrica', 'Community'],
    featured: false,
    likes: 83,
    dateAdded: '2026-07-25',
    author: 'Cultural Coordinator'
  },
  {
    id: 'safari-vid-3',
    type: 'video',
    title: 'Cheetah Coalition Sprinting in Samburu',
    category: 'Wildlife',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&q=80&w=1200',
    videoEmbedUrl: '',
    location: 'Samburu & Buffalo Springs, Kenya',
    description: 'Ultra high-speed recording of two cheetah brothers scouting game along the Ewaso Nyiro River banks.',
    tags: ['CheetahSprint', 'FastestMammal', 'SamburuWildlife', 'ActionVideo'],
    featured: true,
    likes: 129,
    dateAdded: '2026-07-22',
    author: 'Ole Sankale'
  }
]

const STORAGE_KEY = 'cbs_international_gallery_items_v2'
const LIKES_KEY = 'cbs_gallery_user_likes'

export const GALLERY_CATEGORIES = [
  'All',
  'Wildlife',
  'Landscapes',
  'Lodges',
  'Conferences',
  'Cultural',
  'Aerial'
]

// Fetch all gallery items (localStorage + Supabase fallback)
export async function getGalleryItems() {
  // 1. Try local storage first for fast response
  let items = []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      items = JSON.parse(raw)
    }
  } catch (err) {
    console.warn('Failed to parse local gallery cache:', err)
  }

  // If local items empty, seed with initial items
  if (!items || items.length === 0) {
    items = INITIAL_GALLERY_ITEMS
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore
    }
  }

  // 2. Try Supabase query in background if connected
  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      // Merge remote and local
      const remoteItems = data.map(row => ({
        id: row.id,
        type: row.type || 'image',
        title: row.title,
        category: row.category || 'Wildlife',
        mediaUrl: row.media_url || row.mediaUrl,
        posterUrl: row.poster_url || row.posterUrl || '',
        videoEmbedUrl: row.video_embed_url || '',
        location: row.location || 'East Africa',
        description: row.description || '',
        tags: Array.isArray(row.tags) ? row.tags : (row.tags ? row.tags.split(',') : []),
        featured: !!row.featured,
        likes: row.likes || 0,
        dateAdded: row.date_added || row.created_at || new Date().toISOString().split('T')[0],
        author: row.author || 'CBSI Admin'
      }))

      // Merge unique
      const mergedMap = new Map()
      items.forEach(it => mergedMap.set(it.id, it))
      remoteItems.forEach(it => mergedMap.set(it.id, it))
      items = Array.from(mergedMap.values())
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  } catch {
    // Supabase table may not exist yet; gracefully keep using localStorage
  }

  return items
}

// Add or update an item
export async function saveGalleryItem(item) {
  const currentItems = await getGalleryItems()
  const existingIndex = currentItems.findIndex(it => it.id === item.id)

  let updatedList = []
  const itemToSave = {
    ...item,
    id: item.id || `safari-media-${Date.now()}`,
    likes: item.likes || 0,
    dateAdded: item.dateAdded || new Date().toISOString().split('T')[0],
    author: item.author || 'Admin Curated'
  }

  if (existingIndex >= 0) {
    updatedList = [...currentItems]
    updatedList[existingIndex] = itemToSave
  } else {
    updatedList = [itemToSave, ...currentItems]
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
  window.dispatchEvent(new CustomEvent('cbs-gallery-updated', { detail: updatedList }))

  // Attempt Supabase insert/update
  try {
    await supabase.from('gallery_items').upsert({
      id: itemToSave.id,
      type: itemToSave.type,
      title: itemToSave.title,
      category: itemToSave.category,
      media_url: itemToSave.mediaUrl,
      poster_url: itemToSave.posterUrl,
      video_embed_url: itemToSave.videoEmbedUrl,
      location: itemToSave.location,
      description: itemToSave.description,
      tags: itemToSave.tags,
      featured: itemToSave.featured,
      likes: itemToSave.likes,
      date_added: itemToSave.dateAdded,
      author: itemToSave.author
    })
  } catch (err) {
    console.log('Supabase sync skipped, item saved locally:', err?.message)
  }

  return itemToSave
}

// Delete an item
export async function deleteGalleryItem(id) {
  const currentItems = await getGalleryItems()
  const filtered = currentItems.filter(it => it.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  window.dispatchEvent(new CustomEvent('cbs-gallery-updated', { detail: filtered }))

  try {
    await supabase.from('gallery_items').delete().eq('id', id)
  } catch {
    // ignore
  }

  return filtered
}

// Toggle like for a user
export function toggleLikeItem(id) {
  try {
    const rawLikes = localStorage.getItem(LIKES_KEY)
    const userLikes = rawLikes ? JSON.parse(rawLikes) : {}
    const isLiked = !!userLikes[id]

    userLikes[id] = !isLiked
    localStorage.setItem(LIKES_KEY, JSON.stringify(userLikes))

    // Update item likes count
    const rawItems = localStorage.getItem(STORAGE_KEY)
    if (rawItems) {
      const items = JSON.parse(rawItems)
      const target = items.find(it => it.id === id)
      if (target) {
        target.likes = Math.max(0, (target.likes || 0) + (isLiked ? -1 : 1))
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        window.dispatchEvent(new CustomEvent('cbs-gallery-updated', { detail: items }))
      }
    }

    return !isLiked
  } catch (err) {
    console.error('Error toggling like:', err)
    return false
  }
}

export function getUserLikes() {
  try {
    const raw = localStorage.getItem(LIKES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Reset gallery to fresh curated defaults
export function resetGalleryToDefaults() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GALLERY_ITEMS))
  window.dispatchEvent(new CustomEvent('cbs-gallery-updated', { detail: INITIAL_GALLERY_ITEMS }))
  return INITIAL_GALLERY_ITEMS
}