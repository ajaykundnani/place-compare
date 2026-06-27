<script setup>
import { ArrowDownUp, BadgeAlert } from 'lucide-vue-next'

defineProps({
  count: { type: Number, default: 0 },
  reviewFilter: { type: String, default: 'all' },
  hasReviews: { type: Boolean, default: false },
})

defineEmits(['update:reviewFilter'])
</script>

<template>
  <section class="filter-panel">
    <div>
      <strong><ArrowDownUp :size="17" /> Sorted nearest first</strong>
      <span>{{ count }} places</span>
    </div>

    <div class="review-filter" :class="{ disabled: !hasReviews }">
      <BadgeAlert :size="17" />
      <select
        :value="reviewFilter"
        :disabled="!hasReviews"
        @change="$emit('update:reviewFilter', $event.target.value)"
      >
        <option v-if="!hasReviews" value="all">Reviews unavailable on free data</option>
        <option value="all">All reviews</option>
        <option value="good">Good</option>
        <option value="bad">Bad</option>
        <option value="worst">Worst</option>
      </select>
    </div>
  </section>
</template>
