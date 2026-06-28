const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

let mapsLoading = null

function loadMaps() {
  if (window.google?.maps) return Promise.resolve(window.google.maps)
  if (mapsLoading) return mapsLoading

  mapsLoading = new Promise((resolve, reject) => {
    const cb = `__gmcb_${Date.now()}`
    window[cb] = () => {
      resolve(window.google.maps)
      delete window[cb]
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=${cb}`
    script.async = true
    script.defer = true
    script.onerror = () => {
      reject(new Error('Google Maps script failed to load. Check your API key and network.'))
      delete window[cb]
    }
    document.head.appendChild(script)
  })

  return mapsLoading
}

function requireKey() {
  if (!API_KEY) throw new Error('Set VITE_GOOGLE_MAPS_API_KEY in .env')
}

function normalizePlace(result) {
  const photo = result.photos?.[0]
  const hours = result.opening_hours
  return {
    id: `google-${result.place_id}`,
    name: result.name || 'Unnamed place',
    displayName: result.formatted_address || result.vicinity || '',
    lat: result.geometry?.location?.lat() ?? 0,
    lon: result.geometry?.location?.lng() ?? 0,
    type: (result.types || []).find(t => !t.includes('_')) || result.types?.[0] || '',
    category: (result.types || []).slice(0, 3).join(', '),
    phone: result.formatted_phone_number || '',
    website: result.website || '',
    googleMapsUrl: result.url || '',
    image: photo ? photo.getUrl({ maxWidth: 400 }) : '',
    openNow: hours?.open_now ?? null,
    openingHours: hours || null,
    rating: result.rating || null,
    reviews: [],
    videos: [],
    businessStatus: result.business_status || '',
  }
}

const autocompleteCache = new Map()

const placesDiv = document.createElement('div')

export async function autocompletePlaces(input, limit = 5) {
  requireKey()
  if (!input.trim()) return []

  const cacheKey = `ac:${input.toLowerCase().trim()}`
  if (autocompleteCache.has(cacheKey)) return autocompleteCache.get(cacheKey)

  const maps = await loadMaps()
  const service = new maps.places.AutocompleteService()

  return new Promise((resolve) => {
    service.getPlacePredictions(
      {
        input,
        types: ['geocode', 'establishment'],
      },
      (predictions, status) => {
        if (status !== 'OK' && status !== 'ZERO_RESULTS') {
          resolve([])
          return
        }

        const results = (predictions || []).slice(0, limit).map(p => ({
          id: `google-ac-${p.place_id}`,
          name: p.structured_formatting?.main_text || p.description.split(',')[0],
          displayName: p.description,
          placeId: p.place_id,
          lat: null,
          lon: null,
          type: p.types?.[0] || '',
          category: '',
        }))

        autocompleteCache.set(cacheKey, results)
        resolve(results)
      },
    )
  })
}

export async function searchPlaces(query, { limit = 12, origin = null } = {}) {
  requireKey()
  if (!query.trim()) return []

  const maps = await loadMaps()
  const service = new maps.places.PlacesService(placesDiv)

  const request = {
    query,
  }

  if (origin) {
    request.location = new maps.LatLng(origin.lat, origin.lon)
    request.radius = 50000
  }

  const results = await new Promise((resolve, reject) => {
    service.textSearch(request, (res, status) => {
      if (status === 'ZERO_RESULTS') resolve([])
      else if (status !== 'OK') reject(new Error(`Places API error: ${status}`))
      else resolve(res || [])
    })
  })

  const places = results.slice(0, limit).map(normalizePlace)

  const enriched = await Promise.all(
    places.map(async (place) => {
      const placeId = place.id.replace('google-', '')
      try {
        const details = await new Promise((resolve, reject) => {
          service.getDetails(
            { placeId, fields: ['formatted_phone_number', 'website', 'url', 'opening_hours'] },
            (result, status) => {
              if (status === 'OK' && result) resolve(result)
              else resolve(null)
            },
          )
        })
        if (details) {
          place.phone = details.formatted_phone_number || ''
          place.website = details.website || ''
          place.googleMapsUrl = details.url || ''
          if (details.opening_hours) {
            place.openNow = details.opening_hours.open_now ?? null
            place.openingHours = details.opening_hours
          }
        }
      } catch (_) {}
      return place
    }),
  )

  return enriched
}

export async function findAddressCandidates(query, { context = '', limit = 8 } = {}) {
  requireKey()
  const maps = await loadMaps()
  const geocoder = new maps.Geocoder()

  const fullQuery = [query, context].filter(Boolean).join(', ')

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: fullQuery }, (results, status) => {
      if (status === 'ZERO_RESULTS') resolve([])
      else if (status !== 'OK') reject(new Error(`Geocoding error: ${status}`))
      else {
        resolve(
          (results || []).slice(0, limit).map(item => {
            const name = item.address_components?.[0]?.long_name || item.formatted_address.split(',')[0]
            return {
              id: `geo-${item.place_id}`,
              name,
              displayName: item.formatted_address,
              lat: item.geometry.location.lat(),
              lon: item.geometry.location.lng(),
              type: item.types?.[0] || '',
              category: (item.types || []).slice(0, 3).join(', '),
              phone: '',
              website: '',
              image: '',
              openingHours: '',
              rating: null,
              reviews: [],
              videos: [],
              isApproximate: item.geometry.location_type === 'APPROXIMATE',
              source: 'Google Geocoding',
              confidence: item.geometry.location_type === 'ROOFTOP' ? 0.95 : 0.7,
            }
          }),
        )
      }
    })
  })
}

export async function geocodeAddress(query, options = {}) {
  const results = await findAddressCandidates(query, { ...options, limit: 1 })
  if (!results.length) throw new Error('Could not find that address.')
  return results[0]
}

export async function routeDistanceKm(start, end, travelMode = 'DRIVING') {
  requireKey()
  const maps = await loadMaps()
  const service = new maps.DistanceMatrixService()

  const params = {
    origins: [new maps.LatLng(start.lat, start.lon)],
    destinations: [new maps.LatLng(end.lat, end.lon)],
    travelMode,
  }

  if (travelMode === 'DRIVING') {
    params.drivingOptions = {
      departureTime: new Date(),
    }
  }

  return new Promise((resolve) => {
    service.getDistanceMatrix(params, (response, status) => {
      if (status !== 'OK') {
        resolve(null)
        return
      }
      const element = response.rows?.[0]?.elements?.[0]
      if (element?.status === 'OK' && element.distance?.value != null) {
        const result = {
          distanceKm: element.distance.value / 1000,
          durationSeconds: element.duration?.value ?? null,
        }
        if (element.duration_in_traffic?.value != null) {
          result.durationInTrafficSeconds = element.duration_in_traffic.value
        }
        resolve(result)
      } else {
        resolve(null)
      }
    })
  })
}

export async function fetchPlacePhotos(placeId) {
  requireKey()
  const maps = await loadMaps()
  const service = new maps.places.PlacesService(placesDiv)
  const id = placeId.replace('google-', '')

  return new Promise((resolve) => {
    service.getDetails(
      { placeId: id, fields: ['photos'] },
      (result, status) => {
        if (status === 'OK' && result?.photos?.length) {
          resolve(result.photos.map(p => p.getUrl({ maxWidth: 800 })))
        } else {
          resolve([])
        }
      },
    )
  })
}

export function isInsideIndia({ lat, lon }) {
  return lat >= 6.5546079 && lat <= 35.6745457 && lon >= 68.1113787 && lon <= 97.395561
}
