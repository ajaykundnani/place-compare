import { computed, ref } from "vue";
import { searchPlaces, routeDistanceKm } from "../services/googleMaps";
import { haversineKm } from "../utils/distance";
import { fetchPlaceImage } from "../services/imageService";
import { fetchPlaceVideos } from "../services/videoService";

const places = ref([]);
const isSearching = ref(false);
const error = ref("");
const query = ref("");
const reviewFilter = ref("all");

export function usePlaceStore() {
  const sortedPlaces = computed(() =>
    [...places.value].sort(
      (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
    ),
  );

  async function search(queryText, origin) {
    if (!queryText.trim()) return;
    if (!origin) {
      error.value = "Save and select an address before searching places.";
      return;
    }

    isSearching.value = true;
    error.value = "";
    query.value = queryText;

    try {
      const found = await searchPlaces(queryText, { origin });
      places.value = await Promise.all(
        found.map(async (place) => {
          const routeKm = await routeDistanceKm(origin, place).catch(
            () => null,
          );
          return {
            ...place,
            distanceKm: routeKm ?? haversineKm(origin, place),
            distanceType: routeKm ? "Driving route" : "Straight-line estimate",
          };
        }),
      );

      // Fetch media in the background
      places.value.slice(0, 3).forEach((place, index) => {
        fetchPlaceImage(place).then((image) => {
          if (image && places.value[index]) {
            places.value[index].image = image;
          }
        });

        fetchPlaceVideos(place).then((videos) => {
          if (videos.length && places.value[index]) {
            places.value[index].videos = videos;
          }
        });
      });

      places.value.slice(3).forEach((place, index) => {
        setTimeout(
          () => {
            fetchPlaceImage(place).then((image) => {
              const actualIndex = index + 3;
              if (image && places.value[actualIndex]) {
                places.value[actualIndex].image = image;
              }
            });

            fetchPlaceVideos(place).then((videos) => {
              const actualIndex = index + 3;
              if (videos.length && places.value[actualIndex]) {
                places.value[actualIndex].videos = videos;
              }
            });
          },
          100 * (index + 1),
        );
      });
    } catch (err) {
      error.value = err.message || "Search failed.";
      places.value = [];
    } finally {
      isSearching.value = false;
    }
  }

  function clearResults() {
    places.value = [];
    query.value = "";
    error.value = "";
  }

  return {
    places,
    sortedPlaces,
    isSearching,
    error,
    query,
    reviewFilter,
    search,
    clearResults,
  };
}
