/**
 * Media & Video URL Parser Utilities
 * Handles direct MP4/WebM videos, YouTube links (standard, shorts, embed), Vimeo, and Cloudinary.
 */

export const getVideoTypeAndEmbed = (url) => {
  if (!url || typeof url !== 'string') return { type: 'unknown', embedUrl: null, isDirect: false };

  const trimmed = url.trim();

  // 1. YouTube detection
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      videoId: ytMatch[1],
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      isDirect: false
    };
  }

  // 2. Vimeo detection
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      videoId: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&color=c5a059&title=0&byline=0&portrait=0`,
      isDirect: false
    };
  }

  // 3. Direct video (MP4, WebM, OGG, Cloudinary video stream, etc.)
  const isDirectVideo = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed) || 
    trimmed.includes('/video/upload/') ||
    trimmed.includes('blob:') ||
    trimmed.startsWith('data:video/');

  return {
    type: isDirectVideo ? 'direct' : 'direct', // default to direct video tag if not youtube/vimeo
    embedUrl: null,
    isDirect: true,
    directUrl: trimmed
  };
};

/**
 * Format media counter label
 */
export const getMediaFormatLabel = (item) => {
  if (!item) return 'Media';
  if (item.type === 'video') {
    const videoInfo = getVideoTypeAndEmbed(item.url);
    if (videoInfo.type === 'youtube') return 'YouTube 4K Reel';
    if (videoInfo.type === 'vimeo') return 'Vimeo Safari Footage';
    return '4K Safari Video';
  }
  return 'Wildlife Photograph';
};