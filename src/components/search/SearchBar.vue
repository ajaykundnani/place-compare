<script setup>
import { ref } from 'vue'
import { Loader2, Search, X } from 'lucide-vue-next'

defineProps({
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['search', 'clear'])
const term = ref('')

function submit() {
  emit('search', term.value)
}

function clear() {
  term.value = ''
  emit('clear')
}
</script>

<template>
  <form class="search-bar" @submit.prevent="submit">
    <div class="search-input">
      <Search :size="20" />
      <input v-model="term" :disabled="disabled" placeholder="Search hospitals, cafes, schools, malls..." />
    </div>
    <button class="primary-button" type="submit" :disabled="disabled || loading || !term.trim()">
      <Loader2 v-if="loading" class="spin" :size="18" />
      <Search v-else :size="18" />
      Search
    </button>
    <button class="ghost-button" type="button" @click="clear">
      <X :size="18" />
      Clear
    </button>
  </form>
</template>
