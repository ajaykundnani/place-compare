import { fetchPetrolPrice, fetchLastUpdated } from './priceFetcher'

const AVERAGE_KM_PER_LITRE = 20

const COUNTRY_DATA = {
  India: { currency: '₹', code: 'INR', fuelPrice: 103 },
  'United States': { currency: '$', code: 'USD', fuelPrice: 0.90 },
  USA: { currency: '$', code: 'USD', fuelPrice: 0.90 },
  Canada: { currency: 'C$', code: 'CAD', fuelPrice: 1.60 },
  Mexico: { currency: 'MX$', code: 'MXN', fuelPrice: 22 },
  'United Kingdom': { currency: '£', code: 'GBP', fuelPrice: 1.50 },
  UK: { currency: '£', code: 'GBP', fuelPrice: 1.50 },
  Germany: { currency: '€', code: 'EUR', fuelPrice: 1.70 },
  France: { currency: '€', code: 'EUR', fuelPrice: 1.75 },
  Italy: { currency: '€', code: 'EUR', fuelPrice: 1.80 },
  Spain: { currency: '€', code: 'EUR', fuelPrice: 1.60 },
  Netherlands: { currency: '€', code: 'EUR', fuelPrice: 2.00 },
  Belgium: { currency: '€', code: 'EUR', fuelPrice: 1.70 },
  Switzerland: { currency: 'CHF', code: 'CHF', fuelPrice: 1.80 },
  Sweden: { currency: 'kr', code: 'SEK', fuelPrice: 18 },
  Norway: { currency: 'kr', code: 'NOK', fuelPrice: 20 },
  Denmark: { currency: 'kr', code: 'DKK', fuelPrice: 15 },
  Austria: { currency: '€', code: 'EUR', fuelPrice: 1.60 },
  Portugal: { currency: '€', code: 'EUR', fuelPrice: 1.65 },
  Greece: { currency: '€', code: 'EUR', fuelPrice: 1.75 },
  Ireland: { currency: '€', code: 'EUR', fuelPrice: 1.65 },
  Poland: { currency: 'zł', code: 'PLN', fuelPrice: 6.50 },
  'Czech Republic': { currency: 'Kč', code: 'CZK', fuelPrice: 38 },
  Czechia: { currency: 'Kč', code: 'CZK', fuelPrice: 38 },
  Hungary: { currency: 'Ft', code: 'HUF', fuelPrice: 600 },
  Romania: { currency: 'lei', code: 'RON', fuelPrice: 7 },
  Finland: { currency: '€', code: 'EUR', fuelPrice: 1.80 },
  Turkey: { currency: '₺', code: 'TRY', fuelPrice: 40 },
  China: { currency: '¥', code: 'CNY', fuelPrice: 8 },
  Japan: { currency: '¥', code: 'JPY', fuelPrice: 170 },
  'South Korea': { currency: '₩', code: 'KRW', fuelPrice: 1600 },
  Korea: { currency: '₩', code: 'KRW', fuelPrice: 1600 },
  Singapore: { currency: 'S$', code: 'SGD', fuelPrice: 2.80 },
  Malaysia: { currency: 'RM', code: 'MYR', fuelPrice: 2.00 },
  Indonesia: { currency: 'Rp', code: 'IDR', fuelPrice: 13000 },
  Thailand: { currency: '฿', code: 'THB', fuelPrice: 35 },
  Vietnam: { currency: '₫', code: 'VND', fuelPrice: 23000 },
  Philippines: { currency: '₱', code: 'PHP', fuelPrice: 55 },
  'Sri Lanka': { currency: 'Rs', code: 'LKR', fuelPrice: 350 },
  Bangladesh: { currency: '৳', code: 'BDT', fuelPrice: 130 },
  Pakistan: { currency: 'Rs', code: 'PKR', fuelPrice: 280 },
  Nepal: { currency: 'Rs', code: 'NPR', fuelPrice: 160 },
  'United Arab Emirates': { currency: 'د.إ', code: 'AED', fuelPrice: 3.00 },
  UAE: { currency: 'د.إ', code: 'AED', fuelPrice: 3.00 },
  'Saudi Arabia': { currency: '﷼', code: 'SAR', fuelPrice: 2.30 },
  Kuwait: { currency: 'د.ك', code: 'KWD', fuelPrice: 1.10 },
  Qatar: { currency: '﷼', code: 'QAR', fuelPrice: 2.10 },
  Oman: { currency: '﷼', code: 'OMR', fuelPrice: 0.60 },
  Israel: { currency: '₪', code: 'ILS', fuelPrice: 7.50 },
  'South Africa': { currency: 'R', code: 'ZAR', fuelPrice: 23 },
  Nigeria: { currency: '₦', code: 'NGN', fuelPrice: 700 },
  Kenya: { currency: 'KSh', code: 'KES', fuelPrice: 200 },
  Egypt: { currency: 'E£', code: 'EGP', fuelPrice: 30 },
  Morocco: { currency: 'MAD', code: 'MAD', fuelPrice: 15 },
  Australia: { currency: 'A$', code: 'AUD', fuelPrice: 1.80 },
  'New Zealand': { currency: 'NZ$', code: 'NZD', fuelPrice: 2.50 },
  Brazil: { currency: 'R$', code: 'BRL', fuelPrice: 6 },
  Argentina: { currency: 'AR$', code: 'ARS', fuelPrice: 800 },
  Chile: { currency: 'CLP$', code: 'CLP', fuelPrice: 1300 },
  Colombia: { currency: 'COL$', code: 'COP', fuelPrice: 4500 },
  Russia: { currency: '₽', code: 'RUB', fuelPrice: 55 },
}

const REGION_OVERRIDES = {
  'Gujarat': { countryKey: 'India', fuelPrice: 101 },
  'Ahmedabad': { countryKey: 'India', fuelPrice: 101 },
  'Maharashtra': { countryKey: 'India', fuelPrice: 106 },
  'Mumbai': { countryKey: 'India', fuelPrice: 107 },
  'Pune': { countryKey: 'India', fuelPrice: 106 },
  'Karnataka': { countryKey: 'India', fuelPrice: 103 },
  'Bengaluru': { countryKey: 'India', fuelPrice: 103 },
  'Bangalore': { countryKey: 'India', fuelPrice: 103 },
  'Delhi': { countryKey: 'India', fuelPrice: 95 },
  'New Delhi': { countryKey: 'India', fuelPrice: 95 },
  'Tamil Nadu': { countryKey: 'India', fuelPrice: 103 },
  'Chennai': { countryKey: 'India', fuelPrice: 103 },
  'Telangana': { countryKey: 'India', fuelPrice: 109 },
  'Hyderabad': { countryKey: 'India', fuelPrice: 109 },
  'West Bengal': { countryKey: 'India', fuelPrice: 105 },
  'Kolkata': { countryKey: 'India', fuelPrice: 105 },
  'Kerala': { countryKey: 'India', fuelPrice: 105 },
  'Rajasthan': { countryKey: 'India', fuelPrice: 105 },
  'Jaipur': { countryKey: 'India', fuelPrice: 105 },
  'Uttar Pradesh': { countryKey: 'India', fuelPrice: 97 },
  'Lucknow': { countryKey: 'India', fuelPrice: 97 },
  'Noida': { countryKey: 'India', fuelPrice: 97 },
  'Punjab': { countryKey: 'India', fuelPrice: 100 },
  'Chandigarh': { countryKey: 'India', fuelPrice: 97 },
  'Haryana': { countryKey: 'India', fuelPrice: 97 },
  'Gurgaon': { countryKey: 'India', fuelPrice: 97 },
  'Bihar': { countryKey: 'India', fuelPrice: 107 },
  'Madhya Pradesh': { countryKey: 'India', fuelPrice: 108 },
  'Odisha': { countryKey: 'India', fuelPrice: 104 },
  'Andhra Pradesh': { countryKey: 'India', fuelPrice: 110 },
  'Assam': { countryKey: 'India', fuelPrice: 97 },
  'Surat': { countryKey: 'India', fuelPrice: 101 },
  'Vadodara': { countryKey: 'India', fuelPrice: 101 },
  'Rajkot': { countryKey: 'India', fuelPrice: 101 },
  'Bhavnagar': { countryKey: 'India', fuelPrice: 101 },
  'Jamnagar': { countryKey: 'India', fuelPrice: 101 },
  'Indore': { countryKey: 'India', fuelPrice: 108 },
  'Bhopal': { countryKey: 'India', fuelPrice: 108 },
  'Nagpur': { countryKey: 'India', fuelPrice: 106 },
  'Thane': { countryKey: 'India', fuelPrice: 106 },
  'Nashik': { countryKey: 'India', fuelPrice: 106 },
  'Aurangabad': { countryKey: 'India', fuelPrice: 106 },
  'Visakhapatnam': { countryKey: 'India', fuelPrice: 110 },
  'Vijayawada': { countryKey: 'India', fuelPrice: 110 },
  'Coimbatore': { countryKey: 'India', fuelPrice: 103 },
  'Madurai': { countryKey: 'India', fuelPrice: 103 },
  'Mysore': { countryKey: 'India', fuelPrice: 103 },
  'California': { countryKey: 'USA', fuelPrice: 1.20 },
  'Texas': { countryKey: 'USA', fuelPrice: 0.80 },
  'New York': { countryKey: 'USA', fuelPrice: 1.10 },
  'Florida': { countryKey: 'USA', fuelPrice: 0.95 },
  'Illinois': { countryKey: 'USA', fuelPrice: 1.05 },
}

const COUNTRY_ALIASES = {
  'US': 'USA', 'U.S': 'USA', 'U.S.': 'USA', 'America': 'USA',
  'UK': 'UK', 'U.K': 'UK', 'Great Britain': 'UK', 'England': 'UK',
  'UAE': 'UAE', 'U.A.E': 'UAE',
  'Czech Republic': 'Czech Republic',
  'South Korea': 'South Korea',
  'Saudi': 'Saudi Arabia',
}

function extractCountry(addressStr) {
  if (!addressStr) return null
  const parts = addressStr.split(',').map(s => s.trim()).filter(Boolean)
  if (!parts.length) return null

  const last = parts[parts.length - 1]
  if (!last || last.length < 2) return null

  if (COUNTRY_DATA[last]) return last

  const normalized = last.toLowerCase()
  for (const name of Object.keys(COUNTRY_DATA)) {
    if (name.toLowerCase() === normalized) return name
  }

  for (const [alias, canonical] of Object.entries(COUNTRY_ALIASES)) {
    if (last === alias || last.toLowerCase() === alias.toLowerCase()) return canonical
  }

  for (const name of Object.keys(COUNTRY_DATA)) {
    if (normalized.includes(name.toLowerCase()) || name.toLowerCase().includes(normalized)) {
      return name
    }
  }

  return null
}

function extractCityState(addressStr) {
  if (!addressStr) return { city: null, state: null, country: null }
  const parts = addressStr.split(',').map(s => s.trim()).filter(Boolean)

  const country = extractCountry(addressStr)

  const countryIdx = country
    ? parts.findIndex(p => {
        const lower = p.toLowerCase()
        const cn = country.toLowerCase()
        return lower === cn || lower.endsWith(cn) || cn.endsWith(lower)
      })
    : -1

  let city = null
  let state = null

  if (countryIdx > 0) {
    const beforeCountry = parts.slice(0, countryIdx)
    for (const part of beforeCountry) {
      if (REGION_OVERRIDES[part]) {
        state = part
        break
      }
    }
    if (beforeCountry.length >= 2 && !state) {
      state = beforeCountry[beforeCountry.length - 1]
    }
    if (beforeCountry.length >= 2) {
      city = beforeCountry[beforeCountry.length - 2]
    } else if (beforeCountry.length === 1) {
      city = beforeCountry[0]
    }
  } else if (parts.length >= 2) {
    const filtered = parts.filter(p => {
      const l = p.toLowerCase()
      return !/^\d/.test(p) && p.length > 2
    })
    if (filtered.length >= 2) {
      city = filtered[0]
      state = filtered.length >= 3 ? filtered[1] : null
    }
  }

  if (city && city.length > 30) {
    city = city.split(/\s+/).slice(0, 3).join(' ')
  }

  return { city: city || null, state: state || null, country }
}

function resolveFuelPrice(address) {
  const { city, state, country } = extractCityState(address)

  let fuelPrice = null
  let source = null

  if (city && REGION_OVERRIDES[city]) {
    fuelPrice = REGION_OVERRIDES[city].fuelPrice
    source = city
  }

  if (fuelPrice == null && state && REGION_OVERRIDES[state]) {
    fuelPrice = REGION_OVERRIDES[state].fuelPrice
    source = state
  }

  if (fuelPrice == null && address) {
    const parts = address.split(',').map(s => s.trim()).filter(Boolean)
    for (const part of parts) {
      if (REGION_OVERRIDES[part]) {
        fuelPrice = REGION_OVERRIDES[part].fuelPrice
        source = part
        break
      }
    }
  }

  if (fuelPrice == null && country && COUNTRY_DATA[country]) {
    fuelPrice = COUNTRY_DATA[country].fuelPrice
    source = country
  }

  return { fuelPrice, source, country }
}

function getFuelPrice(address) {
  return resolveFuelPrice(address).fuelPrice ?? null
}

function getCurrency(address) {
  const { country } = extractCityState(address)
  if (country && COUNTRY_DATA[country]) {
    const data = COUNTRY_DATA[country]
    const { fuelPrice } = resolveFuelPrice(address)
    return { ...data, fuelPrice: fuelPrice ?? data.fuelPrice }
  }
  const fallback = resolveFuelPrice(address)
  if (fallback.country && COUNTRY_DATA[fallback.country]) {
    return { ...COUNTRY_DATA[fallback.country], fuelPrice: fallback.fuelPrice }
  }
  return null
}

function calcFuelCost(distanceKm, fuelPrice, kmPerLitre) {
  if (distanceKm == null || distanceKm <= 0 || fuelPrice == null) return null
  const avg = kmPerLitre || AVERAGE_KM_PER_LITRE
  return (distanceKm / avg) * fuelPrice
}

async function resolveFuelPriceLive(addressStr) {
  const { city, state, country } = extractCityState(addressStr)
  const fallback = resolveFuelPrice(addressStr)

  let lastUpdated = null
  let fuelPrice = null
  let source = 'static'

  if (city) {
    const live = await fetchPetrolPrice(city).catch(() => null)
    if (live?.price != null) {
      fuelPrice = live.price
      lastUpdated = live.lastUpdated
      source = 'live'
    }
  }

  if (fuelPrice == null && fallback.fuelPrice != null) {
    fuelPrice = fallback.fuelPrice
    source = 'static'
  }

  let currency = '₹'
  let code = 'INR'
  if (country && COUNTRY_DATA[country]) {
    currency = COUNTRY_DATA[country].currency
    code = COUNTRY_DATA[country].code
  }

  return { fuelPrice, lastUpdated, source, currency, code, country, city }
}

export { getFuelPrice, getCurrency, calcFuelCost, extractCityState, resolveFuelPrice, resolveFuelPriceLive, AVERAGE_KM_PER_LITRE, COUNTRY_DATA, REGION_OVERRIDES }
