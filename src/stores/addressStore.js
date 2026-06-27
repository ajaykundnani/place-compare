import { computed, ref } from "vue";
import { loadItem, saveItem } from "../services/storage";

const addresses = ref(loadItem("addresses", []));
const selectedAddressId = ref(loadItem("selected-address-id", null));

if (!selectedAddressId.value && addresses.value.length) {
  selectedAddressId.value = addresses.value[0].id;
}

function persist() {
  saveItem("addresses", addresses.value);
  saveItem("selected-address-id", selectedAddressId.value);
}

function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `address-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

function coordKey(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(5) : null;
}

function isSameLocation(left, right) {
  if (!left || !right) return false;

  const leftLat = coordKey(left.lat);
  const leftLon = coordKey(left.lon);
  const rightLat = coordKey(right.lat);
  const rightLon = coordKey(right.lon);

  return (
    leftLat &&
    leftLon &&
    rightLat &&
    rightLon &&
    leftLat === rightLat &&
    leftLon === rightLon
  );
}

export function useAddressStore() {
  const selectedAddress = computed(
    () =>
      addresses.value.find(
        (address) => address.id === selectedAddressId.value,
      ) ||
      addresses.value[0] ||
      null,
  );

  function addAddress(address) {
    const normalizedAddress = {
      ...address,
      lat: Number(address.lat),
      lon: Number(address.lon),
    };
    const existingAddress = addresses.value.find((existing) =>
      isSameLocation(existing, normalizedAddress),
    );

    if (existingAddress) {
      selectedAddressId.value = existingAddress.id;
      persist();
      return existingAddress.id;
    }

    addresses.value = [
      { ...normalizedAddress, id: createId(), createdAt: Date.now() },
      ...addresses.value,
    ];
    selectedAddressId.value = addresses.value[0].id;
    persist();
    return addresses.value[0].id;
  }

  function removeAddress(id) {
    addresses.value = addresses.value.filter((address) => address.id !== id);
    if (selectedAddressId.value === id)
      selectedAddressId.value = addresses.value[0]?.id || null;
    persist();
  }

  function selectAddress(id) {
    selectedAddressId.value = id;
    persist();
  }

  return {
    addresses,
    selectedAddress,
    selectedAddressId,
    addAddress,
    removeAddress,
    selectAddress,
  };
}
