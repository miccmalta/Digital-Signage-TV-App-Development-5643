// RSS Parser utility for handling real RSS feeds
export const parseRSSFeed = async (url) => {
  try {
    // Use RSS2JSON service to parse RSS feeds and handle CORS
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (data.status === 'ok') {
      return data.items.map(item => ({
        title: item.title,
        description: item.description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        link: item.link,
        pubDate: item.pubDate,
        image: item.enclosure?.link || item.thumbnail || extractImageFromContent(item.content) || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
        content: item.content
      }));
    } else {
      throw new Error('Failed to parse RSS feed');
    }
  } catch (error) {
    console.error('RSS parsing error:', error);
    // Return fallback data
    return [
      {
        title: "RSS Feed Error",
        description: "Unable to load RSS feed. Please check the URL and try again.",
        link: "#",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop",
        pubDate: new Date().toISOString()
      }
    ];
  }
};

const extractImageFromContent = (content) => {
  if (!content) return null;
  
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
};

export const getYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

export const validateYouTubeUrl = (url) => {
  return getYouTubeVideoId(url) !== null;
};

export const getYouTubeEmbedUrl = (videoId, options = {}) => {
  const params = new URLSearchParams({
    autoplay: options.autoplay || '1',
    mute: options.mute || '1',
    controls: options.controls || '0',
    loop: options.loop || '1',
    playlist: videoId,
    rel: '0',
    showinfo: '0',
    modestbranding: '1',
    ...options.params
  });
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};