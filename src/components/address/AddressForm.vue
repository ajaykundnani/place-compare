<script setup>
import { computed, reactive, ref } from 'vue'
import { Check, Home, Tag } from 'lucide-vue-next'
import { findAddressCandidates } from '../../services/googleMaps'

const emit = defineEmits(['save'])

const form = reactive({
  tag: 'Home',
  address: '',
})

const suggestions = ref([])
const isSuggesting = ref(false)

const hasSuggestions = computed(() => suggestions.value.length > 0)

function emitAddress(place, sourceLabel = '') {
  const label = place.displayName?.split(',')[0] || form.address.split(',')[0] || form.tag

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
  suggestions.value = []
}

let suggestionTimer = null

async function loadSuggestions(query) {
  if (!query.trim()) {
    suggestions.value = []
    isSuggesting.value = false
    return
  }

  isSuggesting.value = true
  try {
    const matches = await findAddressCandidates(query, { limit: 5 })
    suggestions.value = matches
  } catch (err) {
    suggestions.value = []
  } finally {
    isSuggesting.value = false
  }
}

function handleAddressInput() {
  if (suggestionTimer) clearTimeout(suggestionTimer)
  if (form.address.trim().length < 3) {
    suggestions.value = []
    return
  }
  suggestionTimer = setTimeout(() => {
    loadSuggestions(form.address)
  }, 400)
}

function chooseSuggestion(suggestion) {
  emitAddress(suggestion, 'Address selected')
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
