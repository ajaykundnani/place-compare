<script setup>
import AddressForm from '../components/address/AddressForm.vue'
import AddressList from '../components/address/AddressList.vue'
import FilterPanel from '../components/filters/FilterPanel.vue'
import PlaceCard from '../components/place/PlaceCard.vue'
import SearchBar from '../components/search/SearchBar.vue'
import { useAddressStore } from '../stores/addressStore'
import { usePlaceStore } from '../stores/placeStore'

const {
  addresses,
  selectedAddress,
  selectedAddressId,
  addAddress,
  removeAddress,
  selectAddress,
} = useAddressStore()
const { sortedPlaces, isSearching, error, reviewFilter, search, clearResults } = usePlaceStore()
</script>

<template>
  <main class="app-shell">
    <section class="hero">
      <div>
        <p class="eyebrow">Local browser storage • Free map data • No login</p>
        <h1>NearMe Pro</h1>
        <p>
          Save Home, Work, or Other locations, search nearby places, and open routes directly in Google Maps.
        </p>
      </div>
    </section>

    <section class="workspace">
      <aside class="side-panel">
        <AddressForm @save="addAddress" />
        <AddressList
          :addresses="addresses"
          :selected-id="selectedAddressId"
          @select="selectAddress"
          @remove="removeAddress"
        />
      </aside>

      <section class="results-panel">
        <SearchBar
          :loading="isSearching"
          :disabled="!selectedAddress"
          @search="search($event, selectedAddress)"
          @clear="clearResults"
        />

        <p v-if="!selectedAddress" class="notice">
          Save or select an India address first. Place results will be sorted from that address.
        </p>

        <p v-if="error" class="error">{{ error }}</p>

        <FilterPanel
          v-model:review-filter="reviewFilter"
          :count="sortedPlaces.length"
          :has-reviews="false"
        />

        <div v-if="isSearching" class="loading-state">Finding places and calculating distance...</div>

        <div v-else-if="!sortedPlaces.length" class="empty-state">
          <h2>Search results will appear here</h2>
          <p>Cards are sorted by nearest distance from the selected saved address.</p>
        </div>

        <div v-else class="place-grid">
          <PlaceCard
            v-for="place in sortedPlaces"
            :key="place.id"
            :place="place"
            :origin="selectedAddress"
          />
        </div>
      </section>
    </section>
  </main>
</template>
