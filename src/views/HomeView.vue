<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { Loader2, Play, X } from 'lucide-vue-next'
import AddressForm from '../components/address/AddressForm.vue'
import AddressList from '../components/address/AddressList.vue'
import FilterPanel from '../components/filters/FilterPanel.vue'
import SearchBar from '../components/search/SearchBar.vue'
import { useAddressStore } from '../stores/addressStore'
import { usePlaceStore } from '../stores/placeStore'
import { fetchPlacePhotos } from '../services/googleMaps'
import { formatKm } from '../utils/distance'
import { directionsUrl } from '../utils/maps'

const {
  addresses,
  selectedAddress,
  selectedAddressId,
  addAddress,
  removeAddress,
  selectAddress,
} = useAddressStore()
const { sortedPlaces, isSearching, error, reviewFilter, query, search, clearResults } = usePlaceStore()

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

function handleClear() {
  clearResults()
  activeCategory.value = 'All'
}

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
        <a href="#" class="topnav-link active">Home</a>
        <a href="#" class="topnav-link">Saved</a>
        <a href="#" class="topnav-link">Search</a>
        <a href="#" class="topnav-link">Profile</a>
      </nav>

      <div class="profile-chip">
        <span class="profile-icon">JD</span>
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
            {{ showForm ? '− Cancel' : '+ Add New Destination' }}
          </button>
        </div>
      </aside>

      <section class="places-panel">
        <div class="places-header">
          <h2>Nearby Places</h2>
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
          :review-filter="reviewFilter"
          :has-reviews="false"
          @update:review-filter="reviewFilter = $event"
        />

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
                <span class="result-card-type">{{ place.type || 'Place' }}</span>
                <h3 class="result-card-name">{{ place.name }}</h3>
                <p class="result-card-dist">{{ formatKm(place.distanceKm) }} away</p>
                <div class="result-card-actions">
                  <a class="action-btn" :href="directionsUrl(selectedAddress, place)" target="_blank" rel="noopener" title="Directions">📍</a>
                  <a v-if="place.phone" class="action-btn" :href="`tel:${place.phone}`" title="Call">📞</a>
                  <a v-if="place.website" class="action-btn" :href="place.website" target="_blank" rel="noopener" title="Website">🌐</a>
                  <button class="action-btn menu-btn" @click="openMenu(place)">Menu</button>
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
      <button class="primary-button">Open Dashboard</button>
    </section>
  </main>
</template>
