import { fetchPetrolPrice, fetchLastUpdated } from './priceFetcher'

const AVERAGE_KM_PER_LITRE = 20

const FUEL_TYPES = ['petrol', 'diesel', 'cng']

function fuelPrice(p) {
  return { petrol: p, diesel: Math.round(p * 0.88 * 100) / 100, cng: Math.round(p * 0.52 * 100) / 100 }
}

const COUNTRY_DATA = {
  India: { currency: '₹', code: 'INR', ...fuelPrice(103) },
  'United States': { currency: '$', code: 'USD', ...fuelPrice(0.90) },
  USA: { currency: '$', code: 'USD', ...fuelPrice(0.90) },
  Canada: { currency: 'C$', code: 'CAD', ...fuelPrice(1.60) },
  Mexico: { currency: 'MX$', code: 'MXN', ...fuelPrice(22) },
  'United Kingdom': { currency: '£', code: 'GBP', ...fuelPrice(1.50) },
  UK: { currency: '£', code: 'GBP', ...fuelPrice(1.50) },
  Germany: { currency: '€', code: 'EUR', ...fuelPrice(1.70) },
  France: { currency: '€', code: 'EUR', ...fuelPrice(1.75) },
  Italy: { currency: '€', code: 'EUR', ...fuelPrice(1.80) },
  Spain: { currency: '€', code: 'EUR', ...fuelPrice(1.60) },
  Netherlands: { currency: '€', code: 'EUR', ...fuelPrice(2.00) },
  Belgium: { currency: '€', code: 'EUR', ...fuelPrice(1.70) },
  Switzerland: { currency: 'CHF', code: 'CHF', ...fuelPrice(1.80) },
  Sweden: { currency: 'kr', code: 'SEK', ...fuelPrice(18) },
  Norway: { currency: 'kr', code: 'NOK', ...fuelPrice(20) },
  Denmark: { currency: 'kr', code: 'DKK', ...fuelPrice(15) },
  Austria: { currency: '€', code: 'EUR', ...fuelPrice(1.60) },
  Portugal: { currency: '€', code: 'EUR', ...fuelPrice(1.65) },
  Greece: { currency: '€', code: 'EUR', ...fuelPrice(1.75) },
  Ireland: { currency: '€', code: 'EUR', ...fuelPrice(1.65) },
  Poland: { currency: 'zł', code: 'PLN', ...fuelPrice(6.50) },
  'Czech Republic': { currency: 'Kč', code: 'CZK', ...fuelPrice(38) },
  Czechia: { currency: 'Kč', code: 'CZK', ...fuelPrice(38) },
  Hungary: { currency: 'Ft', code: 'HUF', ...fuelPrice(600) },
  Romania: { currency: 'lei', code: 'RON', ...fuelPrice(7) },
  Finland: { currency: '€', code: 'EUR', ...fuelPrice(1.80) },
  Turkey: { currency: '₺', code: 'TRY', ...fuelPrice(40) },
  China: { currency: '¥', code: 'CNY', ...fuelPrice(8) },
  Japan: { currency: '¥', code: 'JPY', ...fuelPrice(170) },
  'South Korea': { currency: '₩', code: 'KRW', ...fuelPrice(1600) },
  Korea: { currency: '₩', code: 'KRW', ...fuelPrice(1600) },
  Singapore: { currency: 'S$', code: 'SGD', ...fuelPrice(2.80) },
  Malaysia: { currency: 'RM', code: 'MYR', ...fuelPrice(2.00) },
  Indonesia: { currency: 'Rp', code: 'IDR', ...fuelPrice(13000) },
  Thailand: { currency: '฿', code: 'THB', ...fuelPrice(35) },
  Vietnam: { currency: '₫', code: 'VND', ...fuelPrice(23000) },
  Philippines: { currency: '₱', code: 'PHP', ...fuelPrice(55) },
  'Sri Lanka': { currency: 'Rs', code: 'LKR', ...fuelPrice(350) },
  Bangladesh: { currency: '৳', code: 'BDT', ...fuelPrice(130) },
  Pakistan: { currency: 'Rs', code: 'PKR', ...fuelPrice(280) },
  Nepal: { currency: 'Rs', code: 'NPR', ...fuelPrice(160) },
  'United Arab Emirates': { currency: 'د.إ', code: 'AED', ...fuelPrice(3.00) },
  UAE: { currency: 'د.إ', code: 'AED', ...fuelPrice(3.00) },
  'Saudi Arabia': { currency: '﷼', code: 'SAR', ...fuelPrice(2.30) },
  Kuwait: { currency: 'د.ك', code: 'KWD', ...fuelPrice(1.10) },
  Qatar: { currency: '﷼', code: 'QAR', ...fuelPrice(2.10) },
  Oman: { currency: '﷼', code: 'OMR', ...fuelPrice(0.60) },
  Israel: { currency: '₪', code: 'ILS', ...fuelPrice(7.50) },
  'South Africa': { currency: 'R', code: 'ZAR', ...fuelPrice(23) },
  Nigeria: { currency: '₦', code: 'NGN', ...fuelPrice(700) },
  Kenya: { currency: 'KSh', code: 'KES', ...fuelPrice(200) },
  Egypt: { currency: 'E£', code: 'EGP', ...fuelPrice(30) },
  Morocco: { currency: 'MAD', code: 'MAD', ...fuelPrice(15) },
  Australia: { currency: 'A$', code: 'AUD', ...fuelPrice(1.80) },
  'New Zealand': { currency: 'NZ$', code: 'NZD', ...fuelPrice(2.50) },
  Brazil: { currency: 'R$', code: 'BRL', ...fuelPrice(6) },
  Argentina: { currency: 'AR$', code: 'ARS', ...fuelPrice(800) },
  Chile: { currency: 'CLP$', code: 'CLP', ...fuelPrice(1300) },
  Colombia: { currency: 'COL$', code: 'COP', ...fuelPrice(4500) },
  Russia: { currency: '₽', code: 'RUB', ...fuelPrice(55) },
}

function r(p, d, c) {
  return { petrol: p, diesel: d, cng: c }
}

const REGION_OVERRIDES = {
  'Gujarat': { countryKey: 'India', ...r(101, 97.92, 88.02) },
  'Ahmedabad': { countryKey: 'India', ...r(101, 97.92, 88.02) },
  'Surat': { countryKey: 'India', ...r(101, 97.92, 88.02) },
  'Vadodara': { countryKey: 'India', ...r(101, 97.92, 88.02) },
  'Rajkot': { countryKey: 'India', ...r(101, 97.92, 88.02) },
  'Bhavnagar': { countryKey: 'India', ...r(101, 97.92, 88.02) },
  'Jamnagar': { countryKey: 'India', ...r(101, 97.92, 88.02) },
  'Maharashtra': { countryKey: 'India', ...r(106, 93, 75) },
  'Mumbai': { countryKey: 'India', ...r(107, 94, 76) },
  'Pune': { countryKey: 'India', ...r(106, 93, 75) },
  'Nagpur': { countryKey: 'India', ...r(106, 93, 75) },
  'Thane': { countryKey: 'India', ...r(106, 93, 75) },
  'Nashik': { countryKey: 'India', ...r(106, 93, 75) },
  'Aurangabad': { countryKey: 'India', ...r(106, 93, 75) },
  'Karnataka': { countryKey: 'India', ...r(103, 90, 78) },
  'Bengaluru': { countryKey: 'India', ...r(103, 90, 78) },
  'Bangalore': { countryKey: 'India', ...r(103, 90, 78) },
  'Mysore': { countryKey: 'India', ...r(103, 90, 78) },
  'Delhi': { countryKey: 'India', ...r(95, 87, 54) },
  'New Delhi': { countryKey: 'India', ...r(95, 87, 54) },
  'Tamil Nadu': { countryKey: 'India', ...r(103, 91, 78) },
  'Chennai': { countryKey: 'India', ...r(103, 91, 78) },
  'Coimbatore': { countryKey: 'India', ...r(103, 91, 78) },
  'Madurai': { countryKey: 'India', ...r(103, 91, 78) },
  'Telangana': { countryKey: 'India', ...r(109, 96, 82) },
  'Hyderabad': { countryKey: 'India', ...r(109, 96, 82) },
  'West Bengal': { countryKey: 'India', ...r(105, 93, 78) },
  'Kolkata': { countryKey: 'India', ...r(105, 92, 78) },
  'Kerala': { countryKey: 'India', ...r(105, 93, 78) },
  'Rajasthan': { countryKey: 'India', ...r(105, 93, 78) },
  'Jaipur': { countryKey: 'India', ...r(105, 93, 78) },
  'Uttar Pradesh': { countryKey: 'India', ...r(97, 88, 55) },
  'Lucknow': { countryKey: 'India', ...r(97, 88, 55) },
  'Noida': { countryKey: 'India', ...r(97, 88, 55) },
  'Punjab': { countryKey: 'India', ...r(100, 88, 56) },
  'Chandigarh': { countryKey: 'India', ...r(97, 87, 54) },
  'Haryana': { countryKey: 'India', ...r(97, 88, 55) },
  'Gurgaon': { countryKey: 'India', ...r(97, 88, 55) },
  'Faridabad': { countryKey: 'India', ...r(97, 88, 55) },
  'Ghaziabad': { countryKey: 'India', ...r(97, 88, 55) },
  'Bihar': { countryKey: 'India', ...r(107, 95, 80) },
  'Patna': { countryKey: 'India', ...r(107, 95, 80) },
  'Madhya Pradesh': { countryKey: 'India', ...r(108, 95, 82) },
  'Indore': { countryKey: 'India', ...r(108, 95, 82) },
  'Bhopal': { countryKey: 'India', ...r(108, 95, 82) },
  'Odisha': { countryKey: 'India', ...r(104, 92, 78) },
  'Andhra Pradesh': { countryKey: 'India', ...r(110, 97, 83) },
  'Visakhapatnam': { countryKey: 'India', ...r(110, 97, 83) },
  'Vijayawada': { countryKey: 'India', ...r(110, 97, 83) },
  'Assam': { countryKey: 'India', ...r(97, 90, 74) },
  'Guwahati': { countryKey: 'India', ...r(97, 90, 74) },
  'Ranchi': { countryKey: 'India', ...r(104, 92, 78) },
  'Raipur': { countryKey: 'India', ...r(104, 92, 78) },
  'Bhubaneswar': { countryKey: 'India', ...r(104, 92, 78) },
  'Dehradun': { countryKey: 'India', ...r(97, 88, 55) },
  'Jammu': { countryKey: 'India', ...r(105, 93, 78) },
  'Srinagar': { countryKey: 'India', ...r(105, 93, 78) },
  'Varanasi': { countryKey: 'India', ...r(97, 88, 55) },
  'Agra': { countryKey: 'India', ...r(97, 88, 55) },
  'Prayagraj': { countryKey: 'India', ...r(97, 88, 55) },
  'Kanpur': { countryKey: 'India', ...r(97, 88, 55) },
  'Amritsar': { countryKey: 'India', ...r(100, 88, 56) },
  'Ludhiana': { countryKey: 'India', ...r(100, 88, 56) },
  'Jalandhar': { countryKey: 'India', ...r(100, 88, 56) },
  'California': { countryKey: 'USA', ...r(1.20, 1.08, 0.72) },
  'Texas': { countryKey: 'USA', ...r(0.80, 0.70, 0.48) },
  'New York': { countryKey: 'USA', ...r(1.10, 0.98, 0.66) },
  'Florida': { countryKey: 'USA', ...r(0.95, 0.85, 0.57) },
  'Illinois': { countryKey: 'USA', ...r(1.05, 0.94, 0.63) },
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
    if (normalized.includes(name.toLowerCase()) || name.toLowerCase().includes(normalized)) return name
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
      if (REGION_OVERRIDES[part]) { state = part; break }
    }
    if (beforeCountry.length >= 2 && !state) state = beforeCountry[beforeCountry.length - 1]
    if (beforeCountry.length >= 2) city = beforeCountry[beforeCountry.length - 2]
    else if (beforeCountry.length === 1) city = beforeCountry[0]
  } else if (parts.length >= 2) {
    const filtered = parts.filter(p => {
      const l = p.toLowerCase()
      return !/^\d/.test(p) && p.length > 2
    })
    if (filtered.length >= 2) { city = filtered[0]; state = filtered.length >= 3 ? filtered[1] : null }
  }
  if (city && city.length > 30) city = city.split(/\s+/).slice(0, 3).join(' ')
  return { city: city || null, state: state || null, country }
}

function resolveFuelPrices(address) {
  const { city, state, country } = extractCityState(address)
  let prices = null
  let source = null
  if (city && REGION_OVERRIDES[city]) { prices = REGION_OVERRIDES[city]; source = city }
  if (prices == null && state && REGION_OVERRIDES[state]) { prices = REGION_OVERRIDES[state]; source = state }
  if (prices == null && address) {
    const parts = address.split(',').map(s => s.trim()).filter(Boolean)
    for (const part of parts) {
      if (REGION_OVERRIDES[part]) { prices = REGION_OVERRIDES[part]; source = part; break }
    }
  }
  if (prices == null && country && COUNTRY_DATA[country]) { prices = COUNTRY_DATA[country]; source = country }
  return { prices, source, country }
}

function getFuelTypePrice(address, fuelType = 'petrol') {
  const result = resolveFuelPrices(address)
  if (!result.prices) return null
  return result.prices[fuelType] ?? null
}

function getFuelPrice(address) { return getFuelTypePrice(address, 'petrol') }

function getCurrency(address) {
  const { country } = extractCityState(address)
  if (country && COUNTRY_DATA[country]) {
    const data = COUNTRY_DATA[country]
    const { prices } = resolveFuelPrices(address)
    return { ...data, petrol: prices?.petrol ?? data.petrol, diesel: prices?.diesel ?? data.diesel, cng: prices?.cng ?? data.cng }
  }
  const fallback = resolveFuelPrices(address)
  if (fallback.country && COUNTRY_DATA[fallback.country]) return { ...COUNTRY_DATA[fallback.country], ...fallback.prices }
  return null
}

function calcFuelCost(distanceKm, fuelPrice, kmPerLitre) {
  if (distanceKm == null || distanceKm <= 0 || fuelPrice == null) return null
  const avg = kmPerLitre || AVERAGE_KM_PER_LITRE
  return (distanceKm / avg) * fuelPrice
}

async function resolveFuelPriceLive(addressStr) {
  const { city, state, country } = extractCityState(addressStr)
  const override = resolveFuelPrices(addressStr)

  let lastUpdated = null
  let petrol = null
  let diesel = null
  let cng = null
  let source = 'static'

  if (city) {
    const live = await fetchPetrolPrice(city).catch(() => null)
    if (live?.price != null) {
      petrol = Math.round(live.price * 100) / 100
      lastUpdated = live.lastUpdated
      source = 'live'
      if (override.prices) {
        const ratio = override.prices.petrol
        if (ratio && ratio > 0) {
          diesel = Math.round((petrol / ratio) * override.prices.diesel * 100) / 100
          cng = Math.round((petrol / ratio) * override.prices.cng * 100) / 100
        }
      }
    }
  }

  if (petrol == null && override.prices) {
    petrol = override.prices.petrol
    diesel = override.prices.diesel
    cng = override.prices.cng
  }

  let currency = '₹'
  let code = 'INR'
  if (country && COUNTRY_DATA[country]) {
    currency = COUNTRY_DATA[country].currency
    code = COUNTRY_DATA[country].code
  }

  return { petrol, diesel, cng, lastUpdated, source, currency, code, country, city }
}

export {
  getFuelPrice, getFuelTypePrice, getCurrency, calcFuelCost,
  extractCityState, resolveFuelPrices, resolveFuelPriceLive,
  AVERAGE_KM_PER_LITRE, COUNTRY_DATA, REGION_OVERRIDES, FUEL_TYPES,
}
