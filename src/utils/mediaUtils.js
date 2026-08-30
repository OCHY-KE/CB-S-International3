/**
 * Media & Video URL Parser Utilities
 * Handles direct MP4/WebM videos, YouTube links (standard, shorts, embed), Vimeo, and Cloudinary.
 */

export const getVideoTypeAndEmbed = (url) => {
  if (!url || typeof url !== 'string') {
    return { type: 'unknown', embedUrl: null, isDirect: false };
  }

  const trimmed = url.trim();

  // 1. YouTube detection (standard, shorts, embed, youtu.be)
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch?.[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      isDirect: false
    };
  }

  // 2. Vimeo detection
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch?.[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&color=c5a059&title=0&byline=0&portrait=0`,
      isDirect: false
    };
  }

  // 3. Direct video detection (MP4, WebM, OGG, MOV, M4V, Cloudinary, blob, data URI)
  const isDirectVideo =
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed) ||
    trimmed.includes('/video/upload/') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:video/');

  return {
    type: isDirectVideo ? 'direct' : 'unknown',
    embedUrl: null,
    isDirect: isDirectVideo,
    directUrl: isDirectVideo ? trimmed : null
  };
};

/**
 * Format media counter label
 */
export const getMediaFormatLabel = (item) => {
  if (!item) return 'Media';

  if (item.type === 'video') {
    const videoInfo = getVideoTypeAndEmbed(item.url);
    switch (videoInfo.type) {
      case 'youtube':
        return 'YouTube 4K Reel';
      case 'vimeo':
        return 'Vimeo Safari Footage';
      case 'direct':
        return '4K Safari Video';
      default:
        return 'Video';
    }
  }

  return 'Wildlife Photograph';
};
