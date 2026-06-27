<script setup>
import { MapPin, Trash2 } from 'lucide-vue-next'

defineProps({
  address: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})

defineEmits(['select', 'remove'])
</script>

<template>
  <article class="address-card" :class="{ selected }">
    <button class="address-main" type="button" @click="$emit('select')">
      <span class="address-tag">{{ address.tag }}</span>
      <strong>{{ address.label }}</strong>
      <span class="address-text"><MapPin :size="15" /> {{ address.address }}</span>
      <small v-if="address.source || address.accuracy">
        {{ [address.accuracy, address.source].filter(Boolean).join(' • ') }}
      </small>
    </button>

    <button class="icon-button danger" type="button" title="Remove address" @click="$emit('remove')">
      <Trash2 :size="17" />
    </button>
  </article>
</template>
