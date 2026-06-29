<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { Bike, Car, Clock, Image, Loader2, MapPin, Motorbike, Navigation, Pencil, Play, Search, Share2, Star, User, X } from 'lucide-vue-next'
import AddressForm from '../components/address/AddressForm.vue'
import AddressList from '../components/address/AddressList.vue'
import FilterPanel from '../components/filters/FilterPanel.vue'
import SearchBar from '../components/search/SearchBar.vue'
import { useAddressStore } from '../stores/addressStore'
import { usePlaceStore } from '../stores/placeStore'
import { fetchPlacePhotos } from '../services/googleMaps'
import { formatKm, formatDuration } from '../utils/distance'
import { directionsUrl } from '../utils/maps'
import { getWeatherInfo } from '../services/weather'


const {
  addresses,
  selectedAddress,
  selectedAddressId,
  addAddress,
  removeAddress,
  selectAddress,
} = useAddressStore()
const {
  sortedPlaces,
  isSearching,
  isRecalculating,
  error,
  query,
  transportMode,
  weather,
  isFetchingWeather,
  fuelCurrency,
  fuelFetchedAt,
  vehicleAvg,
  promptedModes,
  setVehicleAvg,
  search,
  clearResults,
  recalculateDistances,
  modeToDirectionsMode,
} = usePlaceStore()
const hasQuery = computed(() => !!query.value)

const showForm = ref(false)
const activeCategory = ref('All')

const categories = computed(() => {
  const types = new Set(sortedPlaces.value.map(p => p.type).filter(Boolean))
  return ['All', ...types]
})

const filteredPlaces = computed(() => {
  if (activeCategory.value === 'All') return sortedPlaces.value
  return sortedPlaces.value.filter(p => p.type === activeCategory.value)
})

const hasSelectedAddress = computed(() => !!selectedAddress.value)
const hasResults = computed(() => sortedPlaces.value.length > 0)
const selectedAddressLabel = computed(() => {
  const address = selectedAddress.value
  if (!address) return ''
  return address.label || address.address || address.tag || 'your selected address'
})

function handleSave(address) {
  addAddress(address)
  showForm.value = false
}

const recentSearches = ref(loadRecentSearches())

function loadRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem('pc-recent-searches') || '[]')
  } catch { return [] }
}

function saveRecentSearch(query) {
  const list = [query, ...recentSearches.value.filter(s => s !== query)].slice(0, 3)
  recentSearches.value = list
  localStorage.setItem('pc-recent-searches', JSON.stringify(list))
}

function handleSearch(queryText) {
  if (!selectedAddress.value || !queryText.trim()) return
  saveRecentSearch(queryText.trim())
  search(queryText, selectedAddress.value)
}

const activeVideo = ref(null)
const cardVideoIdx = reactive({})

function openVideo(video) {
  activeVideo.value = video
}

function closeVideo() {
  activeVideo.value = null
}

function getVidIdx(place) {
  return cardVideoIdx[place.id] || 0
}

function prevVid(place) {
  const v = place.videos
  if (!v?.length) return
  cardVideoIdx[place.id] = (getVidIdx(place) - 1 + v.length) % v.length
}

function nextVid(place) {
  const v = place.videos
  if (!v?.length) return
  cardVideoIdx[place.id] = (getVidIdx(place) + 1) % v.length
}

function cardBgStyle(place) {
  const v = place.videos
  if (v?.length) {
    const thumb = v[getVidIdx(place)]?.thumbnail
    if (thumb) return { backgroundImage: `url(${thumb})` }
  }
  if (place.image) return { backgroundImage: `url(${place.image})` }
  return {}
}

const showMenuGallery = ref(false)
const menuPhotos = ref([])
const activeMenuPhotoIndex = ref(0)
let menuLoadingPlaceId = null

async function openMenu(place) {
  if (menuLoadingPlaceId === place.id) return
  menuLoadingPlaceId = place.id
  try {
    menuPhotos.value = await fetchPlacePhotos(place.id)
    if (menuPhotos.value.length) {
      activeMenuPhotoIndex.value = 0
      showMenuGallery.value = true
    }
  } catch (_) {}
  menuLoadingPlaceId = null
}

function closeMenu() {
  showMenuGallery.value = false
  menuPhotos.value = []
  activeMenuPhotoIndex.value = 0
}

function prevMenuPhoto() {
  if (menuPhotos.value.length < 2) return
  activeMenuPhotoIndex.value = (activeMenuPhotoIndex.value - 1 + menuPhotos.value.length) % menuPhotos.value.length
}

function nextMenuPhoto() {
  if (menuPhotos.value.length < 2) return
  activeMenuPhotoIndex.value = (activeMenuPhotoIndex.value + 1) % menuPhotos.value.length
}



function trafficLabel(place) {
  if (place.trafficLevel === 'high') return 'Heavy traffic'
  if (place.trafficLevel === 'moderate') return 'Moderate traffic'
  if (place.trafficLevel === 'low') return 'Light traffic'
  return 'No traffic data'
}

function formatOpenTime(time) {
  if (!time || time.length < 4) return ''
  const hours = parseInt(time.substring(0, 2), 10)
  const minutes = time.substring(2)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const display = hours % 12 || 12
  return `${display}:${minutes} ${ampm}`
}

function openStatus(place) {
  const hours = place.openingHours
  if (!hours) return null
  const today = new Date().getDay()
  const todayPeriod = hours.periods?.find(p => p.open?.day === today)
  if (!todayPeriod) return null

  let isOpen = place.openNow
  if (isOpen == null && todayPeriod) {
    const now = new Date()
    const totalMinutes = now.getHours() * 60 + now.getMinutes()
    const openTime = parseInt(todayPeriod.open.time.substring(0, 2)) * 60 + parseInt(todayPeriod.open.time.substring(2))
    if (todayPeriod.close) {
      const closeTime = parseInt(todayPeriod.close.time.substring(0, 2)) * 60 + parseInt(todayPeriod.close.time.substring(2))
      isOpen = closeTime > openTime
        ? totalMinutes >= openTime && totalMinutes < closeTime
        : totalMinutes >= openTime || totalMinutes < closeTime
    } else {
      isOpen = totalMinutes >= openTime
    }
  }
  if (isOpen == null) return null

  if (isOpen) {
    if (todayPeriod.close) {
      return { label: `Open till ${formatOpenTime(todayPeriod.close.time)}`, cls: 'open-now' }
    }
    return null
  }
  if (todayPeriod.close) {
    return { label: 'Closed now', cls: 'closed-now' }
  }
  if (hours.periods?.length) {
    return { label: 'Closed today', cls: 'closed-now' }
  }
  return null
}

function handleClear() {
  clearResults()
  activeCategory.value = 'All'
}

const transportModes = [
  { key: 'car', icon: Car, label: 'Car' },
  { key: 'bike', icon: Motorbike, label: 'Bike' },
  { key: 'cycle', icon: Bike, label: 'Cycle' },
]

function setTransportMode(mode) {
  transportMode.value = mode
}

async function sharePlace(place) {
  const mode = modeToDirectionsMode[transportMode.value] || 'driving'
  const url = directionsUrl(selectedAddress.value, place, mode)
  const dist = formatKm(place.distanceKm)
  const shareData = {
    title: place.name,
    text: `Check out ${place.name} — ${dist} away from my location!`,
    url,
  }
  if (navigator.share) {
    try { await navigator.share(shareData) } catch (_) {}
  } else {
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    } catch (_) {}
  }
}

function openAvgPrompt() {
  avgInput.value = vehicleAvg.value[transportMode.value] || 20
  showAvgModal.value = true
}

function saveAvg() {
  const val = Number(avgInput.value)
  if (val > 0 && val <= 99) {
    setVehicleAvg(val, transportMode.value)
    showAvgModal.value = false
    if (selectedAddress.value && query.value) {
      recalculateDistances(selectedAddress.value)
    }
  }
}

const showAvgModal = ref(false)
const avgInput = ref(20)

watch(transportMode, (mode) => {
  if (selectedAddress.value && query.value) {
    recalculateDistances(selectedAddress.value)
  }
  if (!promptedModes.value[mode] && mode !== 'cycle') {
    openAvgPrompt()
  }
})

watch(selectedAddress, (nextAddress, previousAddress) => {
  if (!nextAddress || !query.value || nextAddress === previousAddress) return
  search(query.value, nextAddress)
})
</script>

<template>
  <main class="app-shell">
    <header class="topbar">
      <div class="brand-row">
        <div class="brand-mark">N</div>
        <div>
          <strong class="brand-name">NearLio</strong>
          <p class="brand-subtitle">Precision navigation for modern urban travel.</p>
        </div>
      </div>

      <nav class="topnav">
      </nav>

      <div class="profile-chip">
        <span class="profile-icon"><User :size="18" /></span>
      </div>
    </header>

    <section class="hero-panel">
      <div class="hero-copy">
        <p class="eyebrow">Precision Navigation for the</p>
        <h1>Urban <span>Professional.</span></h1>
        <p class="hero-description">
          Discover the best nearby hubs, offices, and leisure spots with fast search and live route intelligence.
        </p>

        <div class="hero-search-wrap">
          <SearchBar
            :loading="isSearching"
            :disabled="!hasSelectedAddress"
            @search="handleSearch"
            @clear="handleClear"
          />
          <div v-if="recentSearches.length" class="search-trending">
            <span
              v-for="s in recentSearches"
              :key="s"
              class="trending-pill"
              @click="handleSearch(s)"
            >{{ s }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="content-grid">
      <aside class="saved-panel">
        <div class="panel-header">
          <h2>Saved Addresses</h2>
          <a href="#" class="view-all">View All</a>
        </div>

        <div class="saved-list-shell">
          <AddressList
            :addresses="addresses"
            :selected-id="selectedAddressId"
            @select="selectAddress"
            @remove="removeAddress"
          />

          <AddressForm v-if="showForm" @save="handleSave" />

          <button class="add-destination" @click="showForm = !showForm">
            {{ showForm ? '− Cancel' : '+ Add New Address' }}
          </button>
        </div>
      </aside>

      <section class="places-panel">
        <div class="places-header">
          <h2>
            Nearby Places
            <span v-if="selectedAddressLabel"> from <span class="selected-address-title">{{ selectedAddressLabel }}</span></span>
          </h2>
          <div class="category-pill-group">
            <button
              v-for="cat in categories"
              :key="cat"
              class="category-pill"
              :class="{ active: activeCategory === cat }"
              @click="activeCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <FilterPanel
          v-if="hasResults"
          :count="filteredPlaces.length"
        />

        <div v-if="hasResults" class="transport-mode-bar">
          <div class="transport-mode-group">
            <button
              v-for="mode in transportModes"
              :key="mode.key"
              class="transport-mode-btn"
              :class="{ active: transportMode === mode.key }"
              @click="setTransportMode(mode.key)"
            >
              <component :is="mode.icon" :size="16" />
              {{ mode.label }}
            </button>
          </div>
          <span v-if="isRecalculating" class="recalc-indicator">
            <Loader2 :size="14" class="spin" /> Updating...
          </span>
          <span v-if="fuelCurrency && !isRecalculating && transportMode !== 'cycle'" class="fuel-price-info">
            <span class="fuel-price-value">⛽ {{ fuelCurrency.currency }}{{ fuelCurrency.fuelPrice }}/L</span>
            <span v-if="fuelCurrency.source === 'live'" class="fuel-price-updated">Live · {{ new Date(fuelFetchedAt).toLocaleDateString() }}</span>
            <span v-else class="fuel-price-updated fuel-estimated">Estimated</span>
            <span class="avg-badge">Avg: {{ vehicleAvg[transportMode] || 20 }} km/L</span>
            <button class="avg-edit-btn" title="Change vehicle efficiency" @click="openAvgPrompt">
              <Pencil :size="12" />
            </button>
          </span>
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <div v-if="isSearching" class="loading-state">
          <Loader2 :size="24" class="spin" />
          <p>Searching places...</p>
        </div>

        <template v-else-if="hasResults">
          <div class="place-grid">
            <div v-for="place in filteredPlaces" :key="place.id" class="result-card">
              <div class="result-card-media">
                <div class="result-card-bg" :style="cardBgStyle(place)"></div>
                <template v-if="place.videos?.length">
                  <button class="media-play-overlay" @click="openVideo(place.videos[getVidIdx(place)])" aria-label="Play video">
                    <Play :size="28" />
                  </button>
                  <button v-if="place.videos.length > 1" class="carousel-arrow prev" @click.stop="prevVid(place)" aria-label="Previous video">‹</button>
                  <button v-if="place.videos.length > 1" class="carousel-arrow next" @click.stop="nextVid(place)" aria-label="Next video">›</button>
                  <span class="media-counter">{{ getVidIdx(place) + 1 }} / {{ place.videos.length }}</span>
                </template>
              </div>
              <div class="result-card-body">
                <div class="result-card-type-row">
                  <span class="result-card-type">{{ place.type || 'Place' }}</span>
                  <span v-if="place.rating" class="result-card-rating">
                    <Star :size="12" class="rating-star-icon" />
                    {{ place.rating.toFixed(1) }}
                  </span>
                </div>
                <h3 class="result-card-name">
                  {{ place.name }}
                  <span v-if="weather" class="card-weather-tag" :title="getWeatherInfo(weather.weatherCode).label">
                    {{ getWeatherInfo(weather.weatherCode).icon }} {{ weather.temperature }}°
                  </span>
                </h3>
                <p class="result-card-dist">
                  <span
                    class="traffic-dot"
                    :class="{
                      'traffic-high': place.trafficLevel === 'high',
                      'traffic-moderate': place.trafficLevel === 'moderate',
                      'traffic-low': place.trafficLevel === 'low' || (transportMode !== 'car' && place.trafficLevel == null && place.distanceKm != null),
                    }"
                    :title="trafficLabel(place)"
                  ></span>
                  {{ formatKm(place.distanceKm) }} away
                  <template v-if="place.durationSeconds">
                    <span class="result-card-duration-sep">·</span>
                    <span class="result-card-duration">
                      <Clock :size="13" class="duration-icon" />
                      {{ formatDuration(place.durationInTrafficSeconds || place.durationSeconds) }}
                    </span>
                  </template>
                  <span v-if="place.fuelCost && fuelCurrency && transportMode !== 'cycle'" class="result-card-petrol">
                    <span class="result-card-duration-sep">·</span>
                    ⛽ {{ fuelCurrency.currency }}{{ place.fuelCost.toFixed(0) }}
                  </span>
                </p>
                <p v-if="place.parking?.available" class="result-card-parking parking-yes">
                  🅿️ {{ place.parking.text }}
                </p>
                <p v-if="openStatus(place)" class="result-card-hours" :class="openStatus(place).cls">
                  {{ openStatus(place).label }}
                </p>
                <div class="result-card-actions">
                  <a
                    class="action-btn"
                    :href="directionsUrl(selectedAddress, place, modeToDirectionsMode[transportMode] || 'driving')"
                    target="_blank"
                    rel="noopener"
                    title="Directions"
                  ><Navigation :size="18" /></a>
                  <a v-if="place.phone" class="action-btn" :href="`tel:${place.phone}`" title="Call">📞</a>
                  <a v-if="place.website" class="action-btn" :href="place.website" target="_blank" rel="noopener" title="Website">🌐</a>
                  <button class="action-btn menu-btn" @click="openMenu(place)"><Image :size="16" /></button>

                  <button class="action-btn share-btn" @click="sharePlace(place)" title="Share">
                    <Share2 :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Teleport to="body">
            <div v-if="activeVideo" class="video-modal-backdrop" @click.self="closeVideo">
              <div class="video-modal">
                <button class="video-modal-close" @click="closeVideo" aria-label="Close video">
                  <X :size="20" />
                </button>
                <iframe
                  :src="activeVideo.embedUrl"
                  :title="activeVideo.title"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                />
              </div>
            </div>

            <div v-if="showMenuGallery" class="video-modal-backdrop" @click.self="closeMenu">
              <div class="menu-gallery">
                <button class="video-modal-close" @click="closeMenu" aria-label="Close gallery">
                  <X :size="20" />
                </button>

                <div class="menu-gallery-image">
                  <img :src="menuPhotos[activeMenuPhotoIndex]" alt="Place photo" />
                </div>

                <button
                  v-if="menuPhotos.length > 1"
                  class="carousel-arrow prev gallery-arrow"
                  @click="prevMenuPhoto"
                  aria-label="Previous photo"
                >‹</button>
                <button
                  v-if="menuPhotos.length > 1"
                  class="carousel-arrow next gallery-arrow"
                  @click="nextMenuPhoto"
                  aria-label="Next photo"
                >›</button>

                <div class="media-counter gallery-counter">
                  {{ activeMenuPhotoIndex + 1 }} / {{ menuPhotos.length }}
                </div>
              </div>
            </div>


          </Teleport>
        </template>

        <div v-else class="empty-state">
          <template v-if="hasQuery">
            <Search :size="48" class="empty-icon" />
            <h3 class="empty-title">No results found</h3>
            <p class="empty-desc">We couldn't find any places matching "<strong>{{ query }}</strong>". Try a different search term.</p>
          </template>
          <template v-else>
            <MapPin :size="48" class="empty-icon" />
            <h3 class="empty-title">Explore nearby places</h3>
            <p class="empty-desc">Select an address and search for restaurants, cafes, shops, and more in your area.</p>
          </template>
        </div>

        <div v-if="hasResults" class="explore-card">
          <div>
            <p class="explore-label">Explore More</p>
            <p class="explore-copy">Discover {{ filteredPlaces.length }} new spots added in your vicinity this week.</p>
          </div>
          <button class="primary-button">View Map</button>
        </div>
      </section>
    </section>

    <section class="traffic-banner">
      <div class="traffic-text">
        <p class="eyebrow">Live Traffic Intel</p>
        <h3>Get real-time insights into urban flows and optimal routes instantly.</h3>
      </div>
      <button class="primary-button" disabled>Coming soon..</button>
    </section>
  </main>

  <Teleport to="body">
    <div v-if="showAvgModal" class="modal-overlay" @click.self="showAvgModal = false">
      <div class="avg-modal">
        <h3 class="avg-modal-title">{{ transportMode === 'car' ? 'Car' : 'Bike' }} Efficiency</h3>
        <p class="avg-modal-desc">Enter your {{ transportMode === 'car' ? "car" : "bike" }}'s average (km/L) to calculate fuel costs accurately.</p>
        <input
          v-model="avgInput"
          type="number"
          min="1"
          max="99"
          step="1"
          class="avg-input"
          placeholder="e.g. 20"
          @keyup.enter="saveAvg"
        />
        <div class="avg-modal-actions">
          <button class="avg-btn-cancel" @click="showAvgModal = false">Cancel</button>
          <button class="avg-btn-save" @click="saveAvg">Save</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.places-header h2 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
}

.selected-address-title {
  color: #2563eb;
  font-weight: 700;
}
</style>
