const LIVE_URL = 'https://raw.githubusercontent.com/SHN2004/OpenFuel/main/prices.json'
const CACHE_TTL = 3600000

let cached = null
let cacheTime = 0
let inflight = null

function normalizeCity(name) {
  if (!name) return ''
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

const CITY_ALIASES = {
  'bangalore': 'Bengaluru',
  'bengaluru': 'Bengaluru',
  'new delhi': 'New Delhi',
  'delhi': 'New Delhi',
  'mumbai': 'Mumbai',
  'bombay': 'Mumbai',
  'kolkata': 'Kolkata',
  'calcutta': 'Kolkata',
  'chennai': 'Chennai',
  'madras': 'Chennai',
  'hyderabad': 'Hyderabad',
  'ahmedabad': 'Ahmedabad',
  'pune': 'Pune',
  'jaipur': 'Jaipur',
  'lucknow': 'Lucknow',
  'surat': 'Surat',
  'indore': 'Indore',
  'bhopal': 'Bhopal',
  'nagpur': 'Nagpur',
  'coimbatore': 'Coimbatore',
  'kochi': 'Kochi',
  'kozhikode': 'Kozhikode',
  'thiruvananthapuram': 'Thiruvananthapuram',
  'visakhapatnam': 'Visakhapatnam',
  'vijayawada': 'Vijayawada',
  'patna': 'Patna',
  'chandigarh': 'Chandigarh',
  'noida': 'Noida',
  'gurgaon': 'Gurgaon',
  'gurugram': 'Gurgaon',
  'faridabad': 'Faridabad',
  'ghaziabad': 'Ghaziabad',
  'thane': 'Thane',
  'nashik': 'Nashik',
  'aurangabad': 'Aurangabad',
  'ranchi': 'Ranchi',
  'raipur': 'Raipur',
  'bhubaneswar': 'Bhubaneswar',
  'guwahati': 'Guwahati',
  'dehradun': 'Dehradun',
  'shimla': 'Shimla',
  'gangtok': 'Gangtok',
  'itanagar': 'Itanagar',
  'dibrugarh': 'Dibrugarh',
  'jammu': 'Jammu',
  'srinagar': 'Srinagar',
  'varanasi': 'Varanasi',
  'agra': 'Agra',
  'mathura': 'Mathura',
  'allahabad': 'Prayagraj',
  'prayagraj': 'Prayagraj',
  'kanpur': 'Kanpur',
  'amritsar': 'Amritsar',
  'ludhiana': 'Ludhiana',
  'jalandhar': 'Jalandhar',
}

async function fetchLivePrices() {
  const now = Date.now()
  if (cached && now - cacheTime < CACHE_TTL) return cached
  if (inflight) return inflight

  inflight = (async () => {
    try {
      const res = await fetch(LIVE_URL)
      if (!res.ok) throw new Error(`OpenFuel returned ${res.status}`)
      const data = await res.json()
      cached = data
      cacheTime = Date.now()
      return data
    } catch (e) {
      console.warn('OpenFuel fetch failed:', e.message)
      if (cached) return cached
      return null
    } finally {
      inflight = null
    }
  })()

  return inflight
}

async function fetchPetrolPrice(city) {
  if (!city) return null
  const data = await fetchLivePrices()
  if (!data?.petrol) return null

  const normalized = normalizeCity(city)
  const alias = CITY_ALIASES[normalized]
  const targets = [normalized, alias].filter(Boolean)

  for (const target of targets) {
    const match = data.petrol.find(p => normalizeCity(p.city) === target)
    if (match) {
      return { price: match.price, lastUpdated: data.last_updated_ist || null }
    }
  }

  for (const target of targets) {
    const match = data.petrol.find(p => normalizeCity(p.city).includes(target) || target.includes(normalizeCity(p.city)))
    if (match) {
      return { price: match.price, lastUpdated: data.last_updated_ist || null }
    }
  }

  return null
}

async function fetchLastUpdated() {
  const data = await fetchLivePrices()
  return data?.last_updated_ist || null
}

export { fetchPetrolPrice, fetchLastUpdated, fetchLivePrices }
