<script setup>
import { computed, reactive, ref } from 'vue'
import { Check, Home, Tag } from 'lucide-vue-next'
import { autocompletePlaces, findAddressCandidates } from '../../services/googleMaps'

const emit = defineEmits(['save'])

const form = reactive({
  tag: 'Home',
  address: '',
})

const suggestions = ref([])
const isSuggesting = ref(false)

const hasSuggestions = computed(() => suggestions.value.length > 0)

async function resolveLatLon(displayName) {
  try {
    const results = await findAddressCandidates(displayName, { limit: 1 })
    if (results.length) {
      return { lat: results[0].lat, lon: results[0].lon, accuracy: results[0].isApproximate ? 'Approximate match' : 'Confirmed match' }
    }
  } catch {}
  return { lat: 0, lon: 0, accuracy: 'Approximate match' }
}

function emitAddress(place, sourceLabel = '') {
  const label = place.name || form.address.split(',')[0] || form.tag

  emit('save', {
    tag: form.tag,
    label,
    address: place.displayName || form.address,
    lat: place.lat,
    lon: place.lon,
    accuracy: place.accuracy || 'Confirmed match',
    source: sourceLabel || place.source || 'Autocomplete',
  })

  form.address = ''
  suggestions.value = []
}

async function loadSuggestions(query) {
  if (!query.trim()) {
    suggestions.value = []
    isSuggesting.value = false
    return
  }

  isSuggesting.value = true
  try {
    const matches = await autocompletePlaces(query, 5)
    suggestions.value = matches
  } catch (err) {
    suggestions.value = []
  } finally {
    isSuggesting.value = false
  }
}

function handleAddressInput() {
  if (form.address.trim().length < 3) {
    suggestions.value = []
    return
  }
  loadSuggestions(form.address)
}

async function chooseSuggestion(suggestion) {
  const coords = await resolveLatLon(suggestion.displayName)
  emitAddress({ ...suggestion, ...coords }, 'Address selected')
}
</script>

<template>
  <form class="address-form">
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
      Society / Building / Address
      <textarea
        v-model="form.address"
        rows="3"
        placeholder="Add your Address, Society, Building, or Street name"
        @input="handleAddressInput"
      ></textarea>
    </label>

    <div v-if="hasSuggestions" class="candidate-list suggestions-list">
      <p class="candidate-title">Suggestions</p>
      <button
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        class="candidate-button"
        type="button"
        @click="chooseSuggestion(suggestion)"
        :aria-label="`Select address: ${suggestion.name}`"
      >
        <span>
          <strong>{{ suggestion.name }}</strong>
          <small>{{ suggestion.displayName }}</small>
        </span>
        <Check :size="18" />
      </button>
    </div>

  </form>
</template>
