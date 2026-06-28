<script setup>
import { ArrowDownUp } from 'lucide-vue-next'

defineProps({
  count: { type: Number, default: 0 },
})
</script>

<template>
  <section class="filter-panel">
    <div>
      <strong><ArrowDownUp :size="17" /> Sorted nearest first</strong>
      <span>{{ count }} places</span>
    </div>
  </section>
</template>
