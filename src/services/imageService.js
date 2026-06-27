/**
 * Fetch images for places using Wikipedia and other free sources
 */

/**
 * Fetch image from Wikipedia API
 * @param {string} query - Place name or query
 * @returns {Promise<string|null>} - Image URL or null
 */
async function fetchWikipediaImage(query) {
  try {
    const searchUrl = "https://en.wikipedia.org/w/api.php";
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      list: "search",
      srsearch: query,
      srprop: "snippet",
      origin: "*",
    });

    const searchResponse = await fetch(`${searchUrl}?${params.toString()}`);
    const searchData = await searchResponse.json();

    if (!searchData.query?.search?.length) return null;

    // Get first result title
    const firstResult = searchData.query.search[0].title;

    // Query images for that page
    const imageParams = new URLSearchParams({
      action: "query",
      format: "json",
      titles: firstResult,
      prop: "pageimages",
      pithumbsize: 500,
      origin: "*",
    });

    const imageResponse = await fetch(`${searchUrl}?${imageParams.toString()}`);
    const imageData = await imageResponse.json();

    const pages = imageData.query?.pages || {};
    const firstPage = Object.values(pages)[0];

    return firstPage?.thumbnail?.source || null;
  } catch (error) {
    console.error("Wikipedia image fetch failed:", error);
    return null;
  }
}

/**
 * Fetch image from Wikimedia Commons
 * @param {string} query - Place name or query
 * @returns {Promise<string|null>} - Image URL or null
 */
async function fetchWikimediaImage(query) {
  try {
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      list: "search",
      srsearch: query,
      srnamespace: 6, // File namespace
      origin: "*",
    });

    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?${params.toString()}`,
    );
    const data = await response.json();

    if (!data.query?.search?.length) return null;

    const fileName = data.query.search[0].title;

    // Get image info
    const imageInfoParams = new URLSearchParams({
      action: "query",
      format: "json",
      titles: fileName,
      prop: "imageinfo",
      iiprop: "url",
      origin: "*",
    });

    const imageInfoResponse = await fetch(
      `https://commons.wikimedia.org/w/api.php?${imageInfoParams.toString()}`,
    );
    const imageInfoData = await imageInfoResponse.json();

    const pages = imageInfoData.query?.pages || {};
    const firstPage = Object.values(pages)[0];

    return firstPage?.imageinfo?.[0]?.url || null;
  } catch (error) {
    console.error("Wikimedia image fetch failed:", error);
    return null;
  }
}

/**
 * Fetch image from Unsplash (no API key required for basic search)
 * @param {string} query - Place name or query
 * @returns {Promise<string|null>} - Image URL or null
 */
async function fetchUnsplashImage(query) {
  try {
    // Using Unsplash's public source API
    const imageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(query)},landmark,india`;
    // Verify the image exists by checking headers
    const response = await fetch(imageUrl, { method: "HEAD" });
    return response.ok ? imageUrl : null;
  } catch (error) {
    console.error("Unsplash image fetch failed:", error);
    return null;
  }
}

/**
 * Get the best available image for a place
 * @param {Object} place - Place object with name, displayName, lat, lon
 * @returns {Promise<string|null>} - Image URL or null
 */
export async function fetchPlaceImage(place) {
  if (!place) return null;

  // If image already exists and is valid, return it
  if (place.image && place.image.startsWith("http")) {
    return place.image;
  }

  const query = place.name || place.displayName || "";
  if (!query.trim()) return null;

  // Try sources in order of preference
  // 1. Try Wikipedia first (most likely to have good images)
  const wikipediaImage = await fetchWikipediaImage(query);
  if (wikipediaImage) return wikipediaImage;

  // 2. Try Wikimedia Commons
  const wikimediaImage = await fetchWikimediaImage(query);
  if (wikimediaImage) return wikimediaImage;

  // 3. Try Unsplash as fallback
  const unsplashImage = await fetchUnsplashImage(query);
  if (unsplashImage) return unsplashImage;

  return null;
}

/**
 * Batch fetch images for multiple places
 * @param {Array} places - Array of place objects
 * @returns {Promise<Array>} - Places with images populated
 */
export async function fetchPlacesImages(places) {
  return Promise.all(
    places.map(async (place) => ({
      ...place,
      image: await fetchPlaceImage(place),
    })),
  );
}
