import { computed, ref } from "vue";
import { searchPlaces, routeDistanceKm as googleRouteDistanceKm } from "../services/googleMaps";
import { routeDistanceKm as osrmRouteDistanceKm } from "../services/osrm";
import { haversineKm } from "../utils/distance";
import { fetchPlaceImage } from "../services/imageService";
import { fetchPlaceVideos } from "../services/videoService";

const places = ref([]);
const isSearching = ref(false);
const error = ref("");
const query = ref("");
const reviewFilter = ref("all");
const transportMode = ref("car");
const isRecalculating = ref(false);

function getTrafficLevel(durationSeconds, durationInTrafficSeconds) {
  if (!durationInTrafficSeconds || !durationSeconds) return null
  const ratio = durationInTrafficSeconds / durationSeconds
  if (ratio > 1.4) return "high"
  if (ratio > 1.15) return "moderate"
  return "low"
}

const modeToGoogleTravel = { car: "DRIVING", bike: "DRIVING", cycle: "BICYCLING" }
const modeToOsrmProfile = { car: "driving", bike: "driving", cycle: "cycling" }
const modeToDirectionsMode = { car: "driving", bike: "driving", cycle: "cycling" }

async function tryGoogle(origin, dest, travelMode, withTraffic) {
  const result = await googleRouteDistanceKm(origin, dest, travelMode).catch(() => null)
  if (!result) return null
  return {
    distanceKm: result.distanceKm,
    durationSeconds: result.durationSeconds,
    trafficLevel: withTraffic ? getTrafficLevel(result.durationSeconds, result.durationInTrafficSeconds) : null,
    durationInTrafficSeconds: withTraffic ? result.durationInTrafficSeconds : null,
  }
}

async function tryOsrm(origin, dest, profile) {
  const osrmResult = await osrmRouteDistanceKm(origin, dest, profile).catch(() => null)
  if (!osrmResult) return null
  return {
    distanceKm: osrmResult.distanceKm,
    durationSeconds: osrmResult.durationSeconds,
    trafficLevel: null,
    durationInTrafficSeconds: null,
  }
}

async function getRouteDistance(origin, dest, mode) {
  if (mode === "car") {
    return (await tryGoogle(origin, dest, "DRIVING", true))
        || (await tryOsrm(origin, dest, "driving"))
  }
  if (mode === "bike") {
    return (await tryGoogle(origin, dest, "DRIVING", false))
        || (await tryOsrm(origin, dest, "driving"))
  }
  if (mode === "cycle") {
    return (await tryGoogle(origin, dest, "BICYCLING", false))
        || (await tryOsrm(origin, dest, "cycling"))
  }
  return null
}

export function usePlaceStore() {
  const sortedPlaces = computed(() =>
    [...places.value].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)),
  )

  async function search(queryText, origin) {
    if (!queryText.trim()) return
    if (!origin) {
      error.value = "Save and select an address before searching places."
      return
    }

    isSearching.value = true
    error.value = ""
    query.value = queryText

    try {
      const found = await searchPlaces(queryText, { origin })
      places.value = await Promise.all(
        found.map(async (place) => {
          const routeData = await getRouteDistance(origin, place, transportMode.value).catch(() => null)
          return {
            ...place,
            distanceKm: routeData?.distanceKm ?? haversineKm(origin, place),
            durationSeconds: routeData?.durationSeconds ?? null,
            trafficLevel: routeData?.trafficLevel ?? null,
            durationInTrafficSeconds: routeData?.durationInTrafficSeconds ?? null,
          }
        }),
      )

      places.value.slice(0, 3).forEach((place, index) => {
        fetchPlaceImage(place).then((image) => {
          if (image && places.value[index]) {
            places.value[index].image = image
          }
        })
        fetchPlaceVideos(place).then((videos) => {
          if (videos.length && places.value[index]) {
            places.value[index].videos = videos
          }
        })
      })

      places.value.slice(3).forEach((place, index) => {
        setTimeout(() => {
          fetchPlaceImage(place).then((image) => {
            const actualIndex = index + 3
            if (image && places.value[actualIndex]) {
              places.value[actualIndex].image = image
            }
          })
          fetchPlaceVideos(place).then((videos) => {
            const actualIndex = index + 3
            if (videos.length && places.value[actualIndex]) {
              places.value[actualIndex].videos = videos
            }
          })
        }, 100 * (index + 1))
      })
    } catch (err) {
      error.value = err.message || "Search failed."
      places.value = []
    } finally {
      isSearching.value = false
    }
  }

  async function recalculateDistances(origin) {
    if (!origin || !places.value.length) return
    isRecalculating.value = true
    try {
      places.value = await Promise.all(
        places.value.map(async (place) => {
          const routeData = await getRouteDistance(origin, place, transportMode.value).catch(() => null)
          return {
            ...place,
            distanceKm: routeData?.distanceKm ?? haversineKm(origin, place),
            durationSeconds: routeData?.durationSeconds ?? null,
            trafficLevel: routeData?.trafficLevel ?? null,
            durationInTrafficSeconds: routeData?.durationInTrafficSeconds ?? null,
          }
        }),
      )
    } catch {
      // keep existing distances on failure
    } finally {
      isRecalculating.value = false
    }
  }

  function clearResults() {
    places.value = []
    query.value = ""
    error.value = ""
  }

  return {
    places,
    sortedPlaces,
    isSearching,
    isRecalculating,
    error,
    query,
    reviewFilter,
    transportMode,
    search,
    clearResults,
    recalculateDistances,
    modeToGoogleTravel,
    modeToOsrmProfile,
    modeToDirectionsMode,
  }
}
