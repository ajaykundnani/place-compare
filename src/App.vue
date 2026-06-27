<script setup>
import HomeView from './views/HomeView.vue'
</script>

<template>
  <HomeView />
</template>

<style>
:root {
  color: #17211c;
  background: #f5f7f2;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  overflow-wrap: anywhere;
}

button,
input,
textarea,
select {
  font: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

.app-shell {
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.8), transparent 330px),
    radial-gradient(circle at top left, rgba(47, 121, 99, 0.16), transparent 340px),
    #f5f7f2;
}

.hero {
  min-height: 250px;
  display: flex;
  align-items: end;
  padding: 44px clamp(18px, 4vw, 56px) 30px;
  background:
    linear-gradient(90deg, rgba(20, 33, 28, 0.82), rgba(20, 33, 28, 0.44)),
    url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80")
      center/cover;
  color: #fff;
}

.hero > div {
  max-width: 760px;
}

.hero h1 {
  margin: 8px 0 10px;
  font-size: clamp(2.1rem, 6vw, 4.8rem);
  line-height: 0.96;
  letter-spacing: 0;
}

.hero p {
  max-width: 640px;
  margin: 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 1.03rem;
}

.eyebrow {
  margin: 0;
  color: #31715f;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero .eyebrow {
  color: #bcf4d6;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(300px, 390px) minmax(0, 1fr);
  gap: 22px;
  padding: 22px clamp(16px, 4vw, 56px) 44px;
}

.side-panel,
.results-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.address-form,
.address-list,
.filter-panel,
.search-bar,
.empty-state,
.loading-state {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(23, 33, 28, 0.1);
  border-radius: 8px;
  box-shadow: 0 18px 45px rgba(24, 40, 32, 0.08);
}

.address-form {
  display: grid;
  gap: 14px;
  padding: 18px;
}

.panel-title,
.section-heading,
.filter-panel > div,
.feature-grid span,
.distance-pill,
.rating,
.place-address,
.distance-note {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-title {
  font-weight: 850;
}

label {
  display: grid;
  gap: 7px;
  color: #4d5b54;
  font-size: 0.88rem;
  font-weight: 760;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid #cfd8d2;
  border-radius: 8px;
  background: #fff;
  color: #17211c;
  outline: none;
  padding: 12px 13px;
}

textarea {
  resize: vertical;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #2d7c64;
  box-shadow: 0 0 0 4px rgba(45, 124, 100, 0.13);
}

.tag-row,
.actions,
.search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-button,
.primary-button,
.ghost-button,
.action-button,
.icon-button {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 820;
}

.tag-button {
  flex: 1;
  background: #edf2ee;
  color: #34463d;
}

.tag-button.active,
.primary-button {
  background: #20755e;
  color: #fff;
}

.primary-button {
  padding: 0 16px;
}

.primary-button:disabled,
.search-input input:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.ghost-button,
.action-button {
  background: #e7ece8;
  color: #1f332b;
  padding: 0 14px;
}

.action-button {
  border: 1px solid #d7dfda;
  background: #fff;
}

.icon-button {
  width: 42px;
  flex: 0 0 42px;
  background: #eef2ef;
  color: #304139;
}

.icon-button.danger {
  color: #a43636;
}

.error {
  margin: 0;
  color: #a43636;
  font-weight: 760;
}

.notice {
  margin: 0;
  border: 1px solid #d8e3dd;
  border-radius: 8px;
  background: #f7faf8;
  color: #42534a;
  padding: 12px 14px;
  font-weight: 760;
}

.muted {
  margin: 0;
  color: #6a756f;
}

.address-list {
  padding: 18px;
}

.section-heading {
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-heading h2,
.empty-state h2 {
  margin: 0;
  font-size: 1.06rem;
}

.section-heading span {
  border-radius: 999px;
  background: #e3eee8;
  color: #20664f;
  padding: 4px 10px;
  font-weight: 850;
}

.address-stack {
  display: grid;
  gap: 10px;
}

.address-card {
  display: flex;
  align-items: stretch;
  gap: 9px;
  border: 1px solid #dde4df;
  border-radius: 8px;
  padding: 9px;
  background: #fff;
}

.address-card.selected {
  border-color: #20755e;
  box-shadow: inset 0 0 0 1px #20755e;
}

.address-main {
  min-width: 0;
  flex: 1;
  display: grid;
  gap: 6px;
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  cursor: pointer;
}

.address-text {
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  color: #65716b;
  font-size: 0.86rem;
  line-height: 1.35;
}

.address-main small {
  color: #738078;
  font-size: 0.76rem;
  font-weight: 760;
}

.address-tag {
  width: fit-content;
  border-radius: 999px;
  background: #edf5f1;
  color: #20755e;
  padding: 3px 9px;
  font-size: 0.75rem;
  font-weight: 850;
}

.candidate-list,
.fallback-tools {
  display: grid;
  gap: 10px;
  border-top: 1px solid #e2e8e4;
  padding-top: 12px;
}

.candidate-title {
  margin: 0;
  color: #435049;
  font-weight: 850;
}

.candidate-button {
  width: 100%;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid #d6dfd9;
  border-radius: 8px;
  background: #fff;
  color: #17211c;
  padding: 11px;
  text-align: left;
  cursor: pointer;
}

.candidate-button span {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.candidate-button small {
  color: #67736d;
  line-height: 1.25;
}

.fallback-tools {
  background: #f6f8f6;
  border: 1px solid #e0e7e2;
  border-radius: 8px;
  padding: 12px;
}

.search-bar {
  align-items: center;
  padding: 12px;
}

.search-input {
  min-width: min(100%, 280px);
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #cfd8d2;
  border-radius: 8px;
  background: #fff;
  padding: 0 12px;
}

.search-input input {
  border: 0;
  box-shadow: none;
  padding-left: 0;
}

.filter-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
}

.filter-panel strong {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-panel span {
  color: #68746d;
}

.review-filter {
  min-width: 180px;
}

.review-filter.disabled {
  opacity: 0.72;
}

.review-filter select {
  padding-block: 9px;
}

.empty-state,
.loading-state {
  padding: 34px;
  color: #5f6d66;
}

.empty-state p {
  margin-bottom: 0;
}

.place-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
  gap: 16px;
}

.place-card {
  overflow: hidden;
  display: grid;
  grid-template-rows: 190px 1fr;
  border: 1px solid rgba(23, 33, 28, 0.11);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 18px 44px rgba(24, 40, 32, 0.08);
}

.media-strip {
  position: relative;
  background: linear-gradient(135deg, #28473c, #a9cbbd);
}

.media-strip img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-media {
  height: 100%;
  display: grid;
  place-items: center;
  gap: 7px;
  color: rgba(255, 255, 255, 0.84);
  font-weight: 820;
}

.distance-pill {
  position: absolute;
  right: 12px;
  bottom: 12px;
  border-radius: 999px;
  background: #fff;
  color: #17211c;
  padding: 9px 12px;
  font-weight: 900;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
}

.place-body {
  display: grid;
  gap: 13px;
  padding: 16px;
}

.place-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 14px;
}

.place-head h3 {
  margin: 4px 0 0;
  font-size: 1.18rem;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.rating {
  flex: 0 0 auto;
  max-width: 150px;
  border-radius: 999px;
  background: #f4ecd7;
  color: #755822;
  padding: 7px 10px;
  font-size: 0.75rem;
  font-weight: 850;
}

.place-address,
.distance-note {
  margin: 0;
  color: #627068;
  line-height: 1.4;
}

.distance-note {
  font-weight: 760;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.feature-grid span {
  align-items: start;
  border-radius: 8px;
  background: #f2f5f3;
  color: #4d5d55;
  padding: 10px;
  font-size: 0.78rem;
  font-weight: 760;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 920px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: 300px;
    padding-top: 86px;
  }

  .search-bar,
  .filter-panel,
  .place-head {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-button,
  .ghost-button,
  .candidate-button {
    width: 100%;
  }

  .candidate-button {
    align-items: flex-start;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .rating {
    max-width: none;
    width: fit-content;
  }
}
</style>
