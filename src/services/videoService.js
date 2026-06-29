const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_API =
  "https://www.googleapis.com/youtube/v3/search";

const videoCache = new Map();

function extractYouTubeId(value) {
  if (!value) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/i,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

function normalizeVideoUrl(url) {
  if (!url) return null;

  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed.startsWith("http")) return null;

  const youtubeId = extractYouTubeId(trimmed);
  if (youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
  }

  if (trimmed.includes("vimeo.com")) {
    const match = trimmed.match(/vimeo\.com\/(\d+)/i);
    if (match?.[1]) return `https://player.vimeo.com/video/${match[1]}`;
  }

  return trimmed;
}

async function searchYouTubeAPI(query) {
  if (!API_KEY) return null;

  const cacheKey = `yt:${query.toLowerCase().trim()}`;
  if (videoCache.has(cacheKey)) return videoCache.get(cacheKey);

  try {
    const params = new URLSearchParams({
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 4,
      key: API_KEY,
      videoEmbeddable: "true",
      videoSyndicated: "true",
      relevanceLanguage: "en",
    });

    const response = await fetch(`${YOUTUBE_SEARCH_API}?${params.toString()}`);

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      if (response.status === 403) {
        console.warn("YouTube API 403:", body?.error?.message || "quota exceeded or invalid key");
        videoCache.set(cacheKey, []);
        return [];
      }
      console.error("YouTube API error:", response.status, body?.error?.message || "");
      throw new Error(`YouTube API returned ${response.status}`);
    }

    const data = await response.json();

    const videos = (data.items || []).map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      embedUrl: `https://www.youtube-nocookie.com/embed/${item.id.videoId}`,
    }));

    videoCache.set(cacheKey, videos);
    return videos;
  } catch (error) {
    console.error("YouTube API search failed:", error);
    videoCache.set(cacheKey, []);
    return [];
  }
}

function buildYouTubeSearchEmbed(query) {
  const safeQuery = encodeURIComponent(query);
  return {
    id: null,
    title: `Search: ${query}`,
    thumbnail: null,
    embedUrl: `https://www.youtube.com/embed?listType=search&list=${safeQuery}`,
  };
}

export async function fetchPlaceVideos(place) {
  if (!place) return [];

  const existingVideos = Array.isArray(place.videos)
    ? place.videos
        .filter(Boolean)
        .map(normalizeVideoUrl)
        .filter(Boolean)
        .map((url) => ({
          id: extractYouTubeId(url),
          title: "Video",
          thumbnail: null,
          embedUrl: url,
        }))
    : [];

  if (existingVideos.length) return existingVideos;

  const query = [place.name, place.displayName, place.category, place.type]
    .filter(Boolean)
    .join(" ")
    .trim()
    .replace(/\s+/g, " ");

  if (!query) return [];

  if (API_KEY) {
    const videos = await searchYouTubeAPI(query);
    if (videos.length) return videos;
  }

  return [buildYouTubeSearchEmbed(query)];
}

export async function fetchPlacesVideos(places) {
  return Promise.all(
    places.map(async (place) => ({
      ...place,
      videos: await fetchPlaceVideos(place),
    })),
  );
}
