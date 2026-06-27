import { computed, ref } from 'vue'
import { searchPlaces } from '../services/nominatim'
import { routeDistanceKm } from '../services/osrm'
import { haversineKm } from '../utils/distance'

const places = ref([])
const isSearching = ref(false)
const error = ref('')
const query = ref('')
const reviewFilter = ref('all')

export function usePlaceStore() {
  const sortedPlaces = computed(() =>
    [...places.value].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)),
  )

  async function search(queryText, origin) {
    if (!queryText.trim()) return
    if (!origin) {
      error.value = 'Save and select an address before searching places.'
      return
    }

    isSearching.value = true
    error.value = ''
    query.value = queryText

    try {
      const found = await searchPlaces(queryText, { origin })
      places.value = await Promise.all(
        found.map(async (place) => {
          const routeKm = await routeDistanceKm(origin, place).catch(() => null)
          return {
            ...place,
            distanceKm: routeKm ?? haversineKm(origin, place),
            distanceType: routeKm ? 'Driving route' : 'Straight-line estimate',
          }
        }),
      )
    } catch (err) {
      error.value = err.message || 'Search failed.'
      places.value = []
    } finally {
      isSearching.value = false
    }
  }

  function clearResults() {
    places.value = []
    query.value = ''
    error.value = ''
  }

  return { places, sortedPlaces, isSearching, error, query, reviewFilter, search, clearResults }
}
