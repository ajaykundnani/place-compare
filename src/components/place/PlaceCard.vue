<script setup>
import { computed, ref } from 'vue'
import { Globe, Image, Navigation2, Phone, Route, Star, Video, Loader2 } from 'lucide-vue-next'
import { formatKm } from '../../utils/distance'
import { directionsUrl } from '../../utils/maps'

const props = defineProps({
  place: { type: Object, required: true },
  origin: { type: Object, required: true },
})

const imageLoading = ref(false)

const subtitle = computed(() => [props.place.type, props.place.category].filter(Boolean).join(' • '))

const imageStatus = computed(() => {
  if (imageLoading.value) return 'Loading image...'
  return props.place.image ? 'Image found' : 'No image data'
})
</script>

<template>
  <article class="place-card">
    <div class="media-strip">
      <img v-if="place.image && place.image.startsWith('http')" :src="place.image" :alt="place.name" loading="lazy" @loadstart="imageLoading = true" @load="imageLoading = false" @error="imageLoading = false" />
      <div v-else-if="imageLoading" class="empty-media loading"><Loader2 :size="32" class="spin" />Fetching image...</div>
      <div v-else class="empty-media"><Image :size="32" />No image available</div>
      <div class="distance-pill">
        <Route :size="16" />
        {{ formatKm(place.distanceKm) }}
      </div>
    </div>

    <div class="place-body">
      <div class="place-head">
        <div>
          <p class="eyebrow">{{ subtitle || 'Place' }}</p>
          <h3>{{ place.name }}</h3>
        </div>
        <span class="rating"><Star :size="16" /> Public rating unavailable</span>
      </div>

      <p class="place-address">{{ place.displayName }}</p>
      <p class="distance-note">{{ place.distanceType }} from {{ origin.label }} ({{ origin.tag }})</p>

      <div class="feature-grid">
        <span><Image :size="16" /> {{ imageStatus }}</span>
        <span><Video :size="16" /> No free video data</span>
        <span><Star :size="16" /> Google reviews require Places API</span>
      </div>

      <div class="actions">
        <a class="icon-action" :href="directionsUrl(origin, place)" target="_blank" rel="noopener" aria-label="Get directions">
          <Navigation2 :size="18" />
        </a>
        <a v-if="place.phone" class="action-button" :href="`tel:${place.phone}`">
          <Phone :size="17" />
          Call
        </a>
        <a v-if="place.website" class="action-button" :href="place.website" target="_blank" rel="noopener">
          <Globe :size="17" />
          Site
        </a>
      </div>
    </div>
  </article>
</template>
