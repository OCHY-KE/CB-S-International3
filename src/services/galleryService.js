import { supabase } from '../supabaseClient';

const SUPABASE_PROJECT_ID = 'cccevikzhxeyxsjvomzg';
const SUPABASE_STORAGE_BASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public`;

const STORAGE_KEY = 'cbs_international_gallery_items_v2';
const DELETED_DEFAULTS_KEY = 'cbs_deleted_default_ids';
const LIKES_KEY = 'cbs_gallery_user_likes';

export const GALLERY_CATEGORIES = [
  'All',
  'Wildlife',
  'Landscapes',
  'Lodges',
  'Conferences',
  'Cultural',
  'Aerial'
];

/**
 * Normalizes relative paths into complete Supabase Storage Public URLs.
 */
export const formatStorageUrl = (url, bucket = 'CBSI') => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanPath = url.replace(/^\/+/, '');
  if (cleanPath.startsWith(`${bucket}/`)) {
    return `${SUPABASE_STORAGE_BASE_URL}/${cleanPath}`;
  }
  return `${SUPABASE_STORAGE_BASE_URL}/${bucket}/${cleanPath}`;
};

export const INITIAL_GALLERY_ITEMS = [
  {
    id: 'safari-vid-1',
    type: 'video',
    title: 'Wildebeest River Crossing - Serengeti & Mara',
    category: 'Wildlife',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
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
];

function parseTags(rawTags) {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) return rawTags;
  
  if (typeof rawTags === 'string') {
    try {
      const parsed = JSON.parse(rawTags);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return rawTags.split(',').map(t => t.replace(/[\[\]"']/g, '').trim()).filter(Boolean);
    }
  }
  return [];
}

const formatRow = (row) => {
  const rawMedia = row.media_url || row.image_url || row.mediaUrl || '';
  const rawPoster = row.poster_url || row.posterUrl || rawMedia;

  return {
    id: row.id,
    type: row.type || 'image',
    title: row.title || 'Untitled',
    category: row.category || 'Wildlife',
    mediaUrl: formatStorageUrl(rawMedia),
    posterUrl: formatStorageUrl(rawPoster),
    videoEmbedUrl: row.video_embed_url || row.videoEmbedUrl || '',
    location: row.location || 'East Africa',
    description: row.description || '',
    tags: parseTags(row.tags),
    featured: Boolean(row.featured),
    likes: Number(row.likes) || 0,
    dateAdded: row.date_added || (row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
    author: row.author || 'CBSI Admin'
  };
};

// Helper: Get blacklisted/deleted default item IDs
function getDeletedDefaultIds() {
  try {
    const raw = localStorage.getItem(DELETED_DEFAULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function getGalleryItems() {
  const deletedIds = getDeletedDefaultIds();

  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const dbItems = data.map(formatRow);
      
      const combinedMap = new Map();
      // Filter out deleted initial defaults before inserting into map
      INITIAL_GALLERY_ITEMS.forEach(item => {
        if (!deletedIds.includes(String(item.id))) {
          combinedMap.set(String(item.id), item);
        }
      });

      dbItems.forEach(item => {
        if (!deletedIds.includes(String(item.id))) {
          combinedMap.set(String(item.id), item);
        }
      });

      const mergedList = Array.from(combinedMap.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList));
      return mergedList;
    }
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to local cache:', err);
  }

  // Local storage fallback
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed.filter(item => !deletedIds.includes(String(item.id))).map(formatRow);
      }
    }
  } catch (err) {
    console.warn('Failed to parse local gallery cache:', err);
  }

  // Default initial items filtered by blacklisted deleted items
  const activeDefaults = INITIAL_GALLERY_ITEMS.filter(item => !deletedIds.includes(String(item.id)));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activeDefaults));
  return activeDefaults;
}

export async function saveGalleryItem(item) {
  const formattedMediaUrl = formatStorageUrl(item.mediaUrl);
  const formattedPosterUrl = formatStorageUrl(item.posterUrl);

  const dbPayload = {
    type: item.type || 'image',
    title: item.title,
    category: item.category || 'Wildlife',
    media_url: formattedMediaUrl,
    image_url: formattedMediaUrl,
    poster_url: formattedPosterUrl || null,
    video_embed_url: item.videoEmbedUrl || null,
    location: item.location || '',
    description: item.description || '',
    tags: Array.isArray(item.tags) ? item.tags : parseTags(item.tags),
    featured: Boolean(item.featured),
    likes: Number(item.likes) || 0,
    author: item.author || 'CBSI Admin',
    date_added: item.dateAdded || new Date().toISOString().split('T')[0]
  };

  if (item.id && !String(item.id).startsWith('safari-')) {
    dbPayload.id = item.id;
  }

  const { data, error } = await supabase
    .from('gallery_items')
    .upsert([dbPayload])
    .select();

  if (error) {
    console.error('Supabase Upsert Error:', error);
    throw new Error(error.details || error.message || 'Failed to save item to database');
  }

  const savedItem = formatRow(data[0]);
  const freshItems = await getGalleryItems();
  window.dispatchEvent(new CustomEvent('cbs-gallery-updated', { detail: freshItems }));

  return savedItem;
}

export async function deleteGalleryItem(id) {
  const strId = String(id);

  // 1. If it's a default item ('safari-1'), add to deleted tracking list
  if (strId.startsWith('safari-')) {
    const deletedIds = getDeletedDefaultIds();
    if (!deletedIds.includes(strId)) {
      deletedIds.push(strId);
      localStorage.setItem(DELETED_DEFAULTS_KEY, JSON.stringify(deletedIds));
    }
  } else {
    // 2. If it's a Supabase DB row, execute database delete query
    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete row from Supabase:', error);
      throw new Error(error.message || 'Database deletion rejected.');
    }
  }

  // 3. Update cached state and dispatch update event
  const currentItems = await getGalleryItems();
  const filtered = currentItems.filter(item => String(item.id) !== strId);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('cbs-gallery-updated', { detail: filtered }));

  return filtered;
}

export function toggleLikeItem(id) {
  try {
    const rawLikes = localStorage.getItem(LIKES_KEY);
    const userLikes = rawLikes ? JSON.parse(rawLikes) : {};
    const isLiked = !!userLikes[id];

    userLikes[id] = !isLiked;
    localStorage.setItem(LIKES_KEY, JSON.stringify(userLikes));

    const rawItems = localStorage.getItem(STORAGE_KEY);
    if (rawItems) {
      const items = JSON.parse(rawItems);
      const target = items.find(it => String(it.id) === String(id));
      if (target) {
        target.likes = Math.max(0, (target.likes || 0) + (isLiked ? -1 : 1));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        window.dispatchEvent(new CustomEvent('cbs-gallery-updated', { detail: items }));
      }
    }

    return !isLiked;
  } catch (err) {
    console.error('Error toggling like:', err);
    return false;
  }
}

export function getUserLikes() {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function resetGalleryToDefaults() {
  localStorage.removeItem(DELETED_DEFAULTS_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GALLERY_ITEMS));
  window.dispatchEvent(new CustomEvent('cbs-gallery-updated', { detail: INITIAL_GALLERY_ITEMS }));
  return INITIAL_GALLERY_ITEMS;
}