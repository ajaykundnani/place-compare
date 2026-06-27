<script setup>
import { computed, ref } from 'vue'
import { Globe, Image, Navigation2, Phone, Play, Route, Star, Video, X, Loader2 } from 'lucide-vue-next'
import { formatKm } from '../../utils/distance'
import { directionsUrl } from '../../utils/maps'

const props = defineProps({
  place: { type: Object, required: true },
  origin: { type: Object, required: true },
})

const imageLoading = ref(false)
const activeVideo = ref(null)

const subtitle = computed(() => [props.place.type, props.place.category].filter(Boolean).join(' • '))

const imageStatus = computed(() => {
  if (imageLoading.value) return 'Loading image...'
  return props.place.image ? 'Image found' : 'No image data'
})

const videoStatus = computed(() => {
  if (props.place.videos?.length) {
    if (props.place.videos[0]?.id) return `${props.place.videos.length} video${props.place.videos.length > 1 ? 's' : ''} found`
    return 'Video preview available'
  }
  return 'No video data'
})

function openVideo(video) {
  activeVideo.value = video
}

function closeVideo() {
  activeVideo.value = null
}
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
        <a
          class="header-action"
          :href="directionsUrl(origin, place)"
          target="_blank"
          rel="noopener"
          aria-label="Get directions"
        >
          <Navigation2 :size="18" />
        </a>
      </div>

      <p class="place-address">{{ place.displayName }}</p>
      <p class="distance-note">{{ place.distanceType }} from {{ origin.label }} ({{ origin.tag }})</p>

      <div v-if="place.videos?.length" class="video-strip">
        <div
          v-for="video in place.videos"
          :key="video.id || video.embedUrl"
          class="video-thumb"
          @click="openVideo(video)"
        >
          <img
            v-if="video.thumbnail"
            :src="video.thumbnail"
            :alt="video.title"
            loading="lazy"
          />
          <div v-else class="video-thumb-fallback">
            <Play :size="28" />
          </div>
          <div class="video-thumb-overlay">
            <Play :size="20" />
          </div>
          <span class="video-thumb-title">{{ video.title }}</span>
        </div>
      </div>

      <div class="feature-grid">
        <span><Image :size="16" /> {{ imageStatus }}</span>
        <span><Video :size="16" /> {{ videoStatus }}</span>
        <span><Star :size="16" /> Google reviews require Places API</span>
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
      </Teleport>

      <div class="actions">
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
