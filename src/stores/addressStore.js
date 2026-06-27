import { computed, ref } from 'vue'
import { loadItem, saveItem } from '../services/storage'

const addresses = ref(loadItem('addresses', []))
const selectedAddressId = ref(loadItem('selected-address-id', null))

if (!selectedAddressId.value && addresses.value.length) {
  selectedAddressId.value = addresses.value[0].id
}

function persist() {
  saveItem('addresses', addresses.value)
  saveItem('selected-address-id', selectedAddressId.value)
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `address-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useAddressStore() {
  const selectedAddress = computed(() =>
    addresses.value.find((address) => address.id === selectedAddressId.value) || addresses.value[0] || null,
  )

  function addAddress(address) {
    addresses.value = [{ ...address, id: createId(), createdAt: Date.now() }, ...addresses.value]
    selectedAddressId.value = addresses.value[0].id
    persist()
  }

  function removeAddress(id) {
    addresses.value = addresses.value.filter((address) => address.id !== id)
    if (selectedAddressId.value === id) selectedAddressId.value = addresses.value[0]?.id || null
    persist()
  }

  function selectAddress(id) {
    selectedAddressId.value = id
    persist()
  }

  return { addresses, selectedAddress, selectedAddressId, addAddress, removeAddress, selectAddress }
}
