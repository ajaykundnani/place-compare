<script setup>
import { computed, reactive, ref } from 'vue'
import { Check, Crosshair, Home, Loader2, Plus, Search, Tag } from 'lucide-vue-next'
import { findAddressCandidates, isInsideIndia } from '../../services/nominatim'

const emit = defineEmits(['save'])

const form = reactive({
  tag: 'Home',
  label: '',
  address: '',
  context: '',
  coordinates: '',
})

const isSaving = ref(false)
const isLocating = ref(false)
const error = ref('')
const candidates = ref([])

const hasCandidates = computed(() => candidates.value.length > 0)

function parseCoordinates(value) {
  const mapsAtPattern = /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/
  const pairPattern = /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/
  const match = value.match(mapsAtPattern) || value.match(pairPattern)
  if (!match) return null

  const lat = Number(match[1])
  const lon = Number(match[2])
  if (Number.isNaN(lat) || Number.isNaN(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null
  return { lat, lon }
}

function emitAddress(place, sourceLabel = '') {
  const label = form.label || form.address.split(',')[0] || form.tag

  emit('save', {
    tag: form.tag,
    label,
    address: place.displayName || form.address,
    lat: place.lat,
    lon: place.lon,
    accuracy: place.isApproximate ? 'Approximate match' : 'Confirmed match',
    source: sourceLabel || place.source || 'Manual',
  })

  form.address = ''
  form.label = ''
  form.context = ''
  form.coordinates = ''
  candidates.value = []
}

async function submit() {
  if (!form.address.trim()) {
    error.value = 'Address is required.'
    return
  }

  isSaving.value = true
  error.value = ''
  candidates.value = []

  try {
    const matches = await findAddressCandidates(form.address, { context: form.context })
    if (!matches.length) {
      error.value = 'No confident map match found. Add area/city, use current location, or paste a Google Maps link.'
      return
    }

    candidates.value = matches
    if (matches.length === 1 && !matches[0].isApproximate) {
      emitAddress(matches[0])
    }
  } catch (err) {
    error.value = err.message
  } finally {
    isSaving.value = false
  }
}

function saveCoordinates() {
  const coords = parseCoordinates(form.coordinates)
  if (!coords) {
    error.value = 'Paste India coordinates like 23.05493, 72.64246 or a Google Maps URL containing coordinates.'
    return
  }

  if (!isInsideIndia(coords)) {
    error.value = 'Only India locations can be saved in this app.'
    return
  }

  error.value = ''
  emitAddress(
    {
      displayName: `${form.address || form.label || form.tag} (${coords.lat.toFixed(6)}, ${coords.lon.toFixed(6)})`,
      lat: coords.lat,
      lon: coords.lon,
      isApproximate: false,
    },
    'Manual coordinates',
  )
}

async function useCurrentLocation() {
  if (!navigator.geolocation) {
    error.value = 'Current location is not supported in this browser.'
    return
  }

  isLocating.value = true
  error.value = ''

  const tryGeolocation = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      })
    })

  async function tryIpFallback() {
    try {
      const response = await fetch('https://ipapi.co/json/')
      if (!response.ok) return null
      const data = await response.json()
      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        return {
          lat: Number(data.latitude),
          lon: Number(data.longitude),
          accuracy: 5000,
          source: 'Approximate IP location',
        }
      }
    } catch (err) {
      console.warn('IP geolocation fallback failed', err)
    }
    return null
  }

  try {
    const position = await tryGeolocation()
    const coords = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    }

    if (!isInsideIndia(coords)) {
      error.value = 'Your current location is outside India, so it cannot be saved.'
      return
    }

    emitAddress(
      {
        displayName: `${form.address || form.label || form.tag} (current location, ${Math.round(position.coords.accuracy)} m accuracy)`,
        lat: coords.lat,
        lon: coords.lon,
        isApproximate: position.coords.accuracy > 100,
      },
      'Device GPS',
    )
  } catch (err) {
    const fallback = await tryIpFallback()

    if (fallback) {
      if (!isInsideIndia({ lat: fallback.lat, lon: fallback.lon })) {
        error.value = 'Your current location is outside India, so it cannot be saved.'
        return
      }

      emitAddress(
        {
          displayName: `${form.address || form.label || form.tag} (approximate current location, ${Math.round(fallback.accuracy)} m accuracy)`,
          lat: fallback.lat,
          lon: fallback.lon,
          isApproximate: true,
        },
        fallback.source,
      )
      return
    }

    const code = err?.code
    const message =
      code === 1
        ? 'Location permission was denied. Please allow location access and try again.'
        : code === 2
          ? 'Your device could not determine the current location. Please check your connection or try again.'
          : 'Location permission was blocked or unavailable on this device.'

    error.value = message
  } finally {
    isLocating.value = false
  }
}
</script>

<template>
  <form class="address-form" @submit.prevent="submit">
    <div class="panel-title">
      <Home :size="20" />
      <span>Save Address</span>
    </div>

    <div class="tag-row" aria-label="Address tag">
      <button
        v-for="tag in ['Home', 'Work', 'Other']"
        :key="tag"
        class="tag-button"
        :class="{ active: form.tag === tag }"
        type="button"
        @click="form.tag = tag"
      >
        <Tag :size="15" />
        {{ tag }}
      </button>
    </div>

    <label>
      Name
      <input v-model="form.label" placeholder="My flat, office, parents house" />
    </label>

    <label>
      Society / Building / Address
      <textarea v-model="form.address" rows="3" placeholder="Devgram Residency, tower name, flat area, landmark"></textarea>
    </label>

    <label>
      Area / City
      <input v-model="form.context" placeholder="Nana Chiloda, Ahmedabad, Gujarat" />
    </label>

    <p v-if="error" class="error">{{ error }}</p>

    <button class="primary-button" type="submit" :disabled="isSaving">
      <Loader2 v-if="isSaving" class="spin" :size="18" />
      <Search v-else :size="18" />
      {{ isSaving ? 'Finding matches' : 'Find address matches' }}
    </button>

    <div v-if="hasCandidates" class="candidate-list">
      <p class="candidate-title">Choose the closest match</p>
      <button
        v-for="candidate in candidates"
        :key="candidate.id"
        class="candidate-button"
        type="button"
        @click="emitAddress(candidate)"
      >
        <span>
          <strong>{{ candidate.name }}</strong>
          <small>{{ candidate.displayName }}</small>
          <small>{{ candidate.source }} • {{ Math.round(candidate.confidence * 100) }}% match</small>
        </span>
        <Check :size="18" />
      </button>
    </div>

    <div class="fallback-tools">
      <button class="ghost-button" type="button" :disabled="isLocating" @click="useCurrentLocation">
        <Loader2 v-if="isLocating" class="spin" :size="18" />
        <Crosshair v-else :size="18" />
        {{ isLocating ? 'Locating' : 'Use current location' }}
      </button>

      <label>
        Coordinates / Google Maps link
        <input v-model="form.coordinates" placeholder="India coordinates or Maps URL with @lat,lng" />
      </label>

      <button class="ghost-button" type="button" @click="saveCoordinates">
        <Plus :size="18" />
        Save coordinates
      </button>
    </div>
  </form>
</template>
