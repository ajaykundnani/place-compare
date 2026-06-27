<script setup>
import AddressCard from './AddressCard.vue'

defineProps({
  addresses: { type: Array, default: () => [] },
  selectedId: { type: String, default: null },
})

defineEmits(['select', 'remove'])
</script>

<template>
  <section class="address-list">
    <div class="section-heading">
      <h2>Saved Addresses</h2>
      <span>{{ addresses.length }}</span>
    </div>

    <p v-if="!addresses.length" class="muted">Add your first Home, Work, or Other address to start comparing places.</p>

    <div v-else class="address-stack">
      <AddressCard
        v-for="address in addresses"
        :key="address.id"
        :address="address"
        :selected="selectedId === address.id"
        @select="$emit('select', address.id)"
        @remove="$emit('remove', address.id)"
      />
    </div>
  </section>
</template>
