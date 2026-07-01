<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Loader2, Search, X } from 'lucide-vue-next'
import { autocompletePlaces } from '../../services/googleMaps'

defineProps({
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['search', 'clear'])
const term = ref('')
const suggestions = ref([])
const isSuggesting = ref(false)

const placeholders = [
  'Search nearby hospitals',
  'Find cafes near me',
  'Search PVR cinemas',
  'Nearby restaurants',
  'Search petrol pumps',
  'Find ATMs nearby',
]

const placeholderText = ref('')
let placeholderIndex = 0
let charIndex = 0
let isDeleting = false
let typeTimer = null

function runTypeAnimation() {
  const current = placeholders[placeholderIndex]

  if (!isDeleting) {
    placeholderText.value = current.slice(0, charIndex + 1)
    charIndex++
    if (charIndex === current.length) {
      isDeleting = true
      typeTimer = setTimeout(runTypeAnimation, 3000)
      return
    }
  } else {
    placeholderText.value = current.slice(0, charIndex - 1)
    charIndex--
    if (charIndex === 0) {
      isDeleting = false
      placeholderIndex = (placeholderIndex + 1) % placeholders.length
      typeTimer = setTimeout(runTypeAnimation, 800)
      return
    }
  }

  const delay = isDeleting ? 60 : 120
  typeTimer = setTimeout(runTypeAnimation, delay)
}

onMounted(() => {
  runTypeAnimation()
})

onUnmounted(() => {
  if (typeTimer) clearTimeout(typeTimer)
})

const hasSuggestions = computed(() => suggestions.value.length > 0)

let suggestionTimer = null

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

function handleInput() {
  if (suggestionTimer) clearTimeout(suggestionTimer)
  suggestionTimer = setTimeout(() => {
    loadSuggestions(term.value)
  }, 250)
}

function chooseSuggestion(value) {
  term.value = value
  suggestions.value = []
  emit('search', value)
}

function submit() {
  suggestions.value = []
  emit('search', term.value)
}

function clear() {
  term.value = ''
  suggestions.value = []
  emit('clear')
}
</script>

<template>
  <form class="search-bar" @submit.prevent="submit">
    <div class="search-input-wrap">
      <div class="search-input">
        <Search :size="20" />
        <input v-model="term" :disabled="disabled" :placeholder="placeholderText" @input="handleInput" />
      </div>

      <div v-if="hasSuggestions" class="search-suggestions">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          type="button"
          class="suggestion-item"
          @click="chooseSuggestion(suggestion.name)"
          :aria-label="`Search for ${suggestion.name}`"
        >
          <strong>{{ suggestion.name }}</strong>
          <small>{{ suggestion.displayName }}</small>
        </button>
      </div>
    </div>

    <button class="primary-button" type="submit" :disabled="disabled || loading || !term.trim()" aria-label="Search places">
      <Loader2 v-if="loading" class="spin" :size="18" />
      <Search v-else :size="18" />
      Search
    </button>
    <button class="ghost-button" type="button" @click="clear" aria-label="Clear search">
      <X :size="18" />
      Clear
    </button>
  </form>
</template>
