const baseUrl = 'https://nominatim.openstreetmap.org/search'
const photonUrl = 'https://photon.komoot.io/api/'
const indiaViewbox = '68.1113787,6.5546079,97.395561,35.6745457'

const buildingWords = [
  'apartment',
  'apartments',
  'block',
  'building',
  'flat',
  'house',
  'residence',
  'residency',
  'society',
  'tower',
  'towers',
]

const commonLocationWords = [
  'ahmedabad',
  'city',
  'gujarat',
  'india',
  'near',
  'opp',
  'opposite',
  'road',
  'state',
]

function normalizePlace(item) {
  const extratags = item.extratags || {}
  const address = item.address || {}
  const name = item.name || item.namedetails?.name || item.display_name?.split(',')[0] || 'Unnamed place'

  return {
    id: `${item.osm_type}-${item.osm_id}`,
    name,
    displayName: item.display_name,
    lat: Number(item.lat),
    lon: Number(item.lon),
    category: item.category,
    type: item.type,
    address,
    phone: extratags.phone || extratags['contact:phone'] || extratags['contact:mobile'] || '',
    website: extratags.website || extratags['contact:website'] || '',
    image: extratags.image || extratags.wikimedia_commons || '',
    openingHours: extratags.opening_hours || '',
    rating: null,
    reviews: [],
    videos: [],
  }
}

function normalizePhoton(feature) {
  const props = feature.properties || {}
  const [lon, lat] = feature.geometry?.coordinates || []
  const displayParts = [
    props.name,
    props.street,
    props.locality,
    props.district,
    props.city,
    props.state,
    props.country,
    props.postcode,
  ].filter(Boolean)

  return {
    id: `photon-${props.osm_type || 'place'}-${props.osm_id || `${lat}-${lon}`}`,
    name: props.name || 'Unnamed place',
    displayName: [...new Set(displayParts)].join(', '),
    lat: Number(lat),
    lon: Number(lon),
    category: props.osm_key,
    type: props.osm_value || props.type,
    address: props,
    phone: '',
    website: '',
    image: '',
    openingHours: '',
    rating: null,
    reviews: [],
    videos: [],
    source: 'Photon',
  }
}

function isIndiaPlace(place) {
  const address = place.address || {}
  const country = `${address.country || place.displayName || ''}`.toLowerCase()
  const countryCode = `${address.countrycode || address.country_code || ''}`.toLowerCase()

  return countryCode === 'in' || country.includes('india')
}

function isInsideIndia({ lat, lon }) {
  return lat >= 6.5546079 && lat <= 35.6745457 && lon >= 68.1113787 && lon <= 97.395561
}

function nearbyViewbox(origin, radiusDegrees = 0.45) {
  if (!origin?.lat || !origin?.lon) return indiaViewbox

  const minLon = Math.max(68.1113787, Number(origin.lon) - radiusDegrees)
  const minLat = Math.max(6.5546079, Number(origin.lat) - radiusDegrees)
  const maxLon = Math.min(97.395561, Number(origin.lon) + radiusDegrees)
  const maxLat = Math.min(35.6745457, Number(origin.lat) + radiusDegrees)

  return `${minLon},${minLat},${maxLon},${maxLat}`
}

function uniqueByCoordinate(places) {
  const seen = new Set()
  return places.filter((place) => {
    const key = `${place.lat.toFixed(5)},${place.lon.toFixed(5)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function editDistance(left, right) {
  const dp = Array.from({ length: left.length + 1 }, (_, row) => [row])
  for (let col = 1; col <= right.length; col += 1) dp[0][col] = col

  for (let row = 1; row <= left.length; row += 1) {
    for (let col = 1; col <= right.length; col += 1) {
      dp[row][col] =
        left[row - 1] === right[col - 1]
          ? dp[row - 1][col - 1]
          : Math.min(dp[row - 1][col], dp[row][col - 1], dp[row - 1][col - 1]) + 1
    }
  }

  return dp[left.length][right.length]
}

function tokenize(value) {
  return value
    .toLowerCase()
    .split(/\W+/)
    .filter((token) => token.length > 2)
}

function tokenMatches(token, candidateTokens) {
  return candidateTokens.some((candidateToken) => {
    if (candidateToken.includes(token) || token.includes(candidateToken)) return true
    if (token.length < 5 || candidateToken.length < 5) return false
    return editDistance(token, candidateToken) <= 1
  })
}

function scoreCandidate(place, rawQuery, context = '') {
  const query = rawQuery.toLowerCase()
  const name = `${place.name} ${place.displayName}`.toLowerCase()
  const candidateTokens = tokenize(name)
  const queryTokens = tokenize(query)
  const contextTokens = tokenize(context)
  const importantTokens = [...new Set([...queryTokens, ...contextTokens])].filter(
    (token) => !buildingWords.includes(token) && !commonLocationWords.includes(token),
  )
  const matchedTokens = queryTokens.filter((token) => tokenMatches(token, candidateTokens)).length
  const matchedContextTokens = contextTokens.filter((token) => tokenMatches(token, candidateTokens)).length
  const matchedImportantTokens = importantTokens.filter((token) => tokenMatches(token, candidateTokens)).length
  const tokenScore = queryTokens.length ? matchedTokens / queryTokens.length : 0
  const contextScore = contextTokens.length >= 2 ? matchedContextTokens / contextTokens.length : 0
  const importantScore = importantTokens.length ? matchedImportantTokens / importantTokens.length : 0
  const exactScore = name.includes(query) ? 0.35 : 0
  const buildingPenalty =
    buildingWords.some((word) => query.includes(word)) && !buildingWords.some((word) => name.includes(word))
      ? 0.18
      : 0

  if (importantTokens.length && matchedImportantTokens === 0) return 0.05
  if (contextTokens.length && matchedContextTokens === 0) return 0.05

  return Math.max(
    0.05,
    Math.min(
      0.98,
      Math.max(
        tokenScore * 0.63 + exactScore + 0.18 - buildingPenalty,
        contextScore * 0.62 + 0.12,
        importantScore * 0.76 + 0.12,
      ),
    ),
  )
}

function buildQueryVariants(query, context = '') {
  const cleaned = query.replace(/\s+/g, ' ').trim()
  const contextText = context.replace(/\s+/g, ' ').trim()
  const joined = [cleaned, contextText].filter(Boolean).join(', ')
  const commaParts = joined
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  const suffixes = commaParts
    .map((_, index) => commaParts.slice(index).join(', '))
    .filter((part) => part.length > 4)

  const withoutBuildingWords = cleaned
    .split(/\s+/)
    .filter((word) => !buildingWords.includes(word.toLowerCase()))
    .join(' ')

  return [
    joined,
    `${joined}, India`,
    cleaned,
    `${cleaned}, India`,
    withoutBuildingWords,
    `${withoutBuildingWords}, ${contextText || 'India'}`,
    ...suffixes,
    ...suffixes.map((suffix) => `${suffix}, India`),
  ]
    .map((item) => item.replace(/\s+/g, ' ').replace(/^,\s*/, '').trim())
    .filter((item, index, list) => item.length > 2 && list.indexOf(item) === index)
    .slice(0, 12)
}

async function searchNominatim(query, limit, options = {}) {
  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    addressdetails: '1',
    extratags: '1',
    namedetails: '1',
    countrycodes: 'in',
    viewbox: options.origin ? nearbyViewbox(options.origin, options.radiusDegrees) : indiaViewbox,
    bounded: options.bounded === false ? '0' : '1',
    limit: String(limit),
  })

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Place search failed. Please try again in a moment.')
  }

  const data = await response.json()
  return data.map((place) => ({ ...normalizePlace(place), source: 'OpenStreetMap' })).filter((place) => place.lat && place.lon)
}

async function searchPhoton(query, limit, options = {}) {
  const center = options.origin || { lat: 20.5937, lon: 78.9629 }
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    lang: 'en',
    lon: String(center.lon),
    lat: String(center.lat),
  })

  const response = await fetch(`${photonUrl}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) return []

  const data = await response.json()
  return (data.features || []).map(normalizePhoton).filter((place) => place.lat && place.lon && isIndiaPlace(place))
}

export async function searchPlaces(query, { limit = 12, origin = null } = {}) {
  const [nominatimResults, photonResults] = await Promise.all([
    searchNominatim(query, limit, { origin, radiusDegrees: 0.45 }).catch(() => []),
    searchPhoton(query, limit, { origin }).catch(() => []),
  ])

  const results = uniqueByCoordinate([...nominatimResults, ...photonResults].filter(isIndiaPlace)).slice(0, limit)
  if (!results.length) {
    const fallbackResults = await searchNominatim(query, limit, { bounded: false }).catch(() => [])
    const fallbackIndiaResults = uniqueByCoordinate(fallbackResults.filter(isIndiaPlace)).slice(0, limit)
    if (fallbackIndiaResults.length) return fallbackIndiaResults

    throw new Error('No India results found. Try a nearby landmark, business name, or broader place type.')
  }
  return results
}

export async function findAddressCandidates(query, { context = '', limit = 8 } = {}) {
  const variants = buildQueryVariants(query, context)
  const batches = []

  for (const variant of variants) {
    const [nominatimResults, photonResults] = await Promise.all([
      searchNominatim(variant, 4).catch(() => []),
      searchPhoton(variant, 4).catch(() => []),
    ])

    batches.push(
      ...nominatimResults.map((place) => ({ ...place, matchedQuery: variant })),
      ...photonResults.map((place) => ({ ...place, matchedQuery: variant })),
    )

  }

  return uniqueByCoordinate(batches.filter(isIndiaPlace))
    .map((place) => ({
      ...place,
      confidence: scoreCandidate(place, query, context),
      isApproximate: scoreCandidate(place, query, context) < 0.78,
    }))
    .filter((place) => place.confidence >= 0.35)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit)
}

export async function geocodeAddress(query, options = {}) {
  const results = await findAddressCandidates(query, { ...options, limit: 1 })
  if (!results.length) throw new Error('Could not find that address. Try adding area/city, use current location, or paste coordinates.')
  return results[0]
}

export { isInsideIndia }
