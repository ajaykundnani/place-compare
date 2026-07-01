<script setup>
import HomeView from './views/HomeView.vue'
import PwaInstallBanner from './components/pwa/PwaInstallBanner.vue'
</script>

<template>
  <HomeView />
  <PwaInstallBanner />
</template>

<style>
:root {
  color: #0f172a;
  background: #eef4ff;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  --bg: #eef4ff;
  --surface: rgba(255, 255, 255, 0.92);
  --surface-strong: #ffffff;
  --text: #102033;
  --muted: #5d6c7b;
  --border: rgba(15, 23, 42, 0.08);
  --accent: #2563eb;
  --accent-2: #7c3aed;
  --accent-soft: rgba(37, 99, 235, 0.12);
  --success: #0f766e;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  width: 100%;
  min-width: 320px;
  min-height: 100vh;
  overflow-wrap: anywhere;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 32%),
    radial-gradient(circle at 90% 0%, rgba(124, 58, 237, 0.16), transparent 28%),
    var(--bg);
  color: var(--text);
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
  width: 100%;
  overflow-x: hidden;
  padding: 24px clamp(16px, 3vw, 36px) 48px;
  max-width: 1480px;
  margin: 0 auto;
}

.topbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 20px;
  align-items: center;
  padding: 22px 26px;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(18px);
  margin-bottom: 28px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  object-fit: cover;
}

.brand-name {
  font-size: 1.05rem;
  letter-spacing: -0.02em;
}

.brand-subtitle {
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 0.88rem;
}

.topnav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  flex-wrap: wrap;
}

.topnav-link {
  color: var(--muted);
  font-size: 0.95rem;
  font-weight: 700;
  transition: color 0.2s ease;
}

.topnav-link:hover,
.topnav-link.active {
  color: var(--accent);
}

.profile-chip {
  display: flex;
  justify-content: flex-end;
}

.profile-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #e7efff;
  color: var(--accent);
  font-weight: 800;
}

.hero-panel {
  padding: 42px 44px;
  margin-bottom: 32px;
  background: linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
  border-radius: 32px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.06);
}

.hero-copy {
  max-width: 720px;
}

.hero-copy .eyebrow {
  margin: 0 0 10px;
  color: var(--accent);
  font-size: 0.82rem;
  letter-spacing: 0.18em;
}

.hero-copy h1 {
  margin: 0;
  font-size: clamp(3rem, 4vw, 5.2rem);
  line-height: 0.95;
  letter-spacing: -0.05em;
}

.hero-copy h1 span {
  color: var(--accent);
}

.hero-description {
  margin: 20px 0 28px;
  color: var(--muted);
  font-size: 1.05rem;
  max-width: 640px;
  line-height: 1.8;
}

.hero-search-wrap {
  display: grid;
  gap: 18px;
}

.search-trending {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.search-trending span,
.trending-pill {
  padding: 10px 14px;
  border-radius: 999px;
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.06);
  color: var(--muted);
  font-size: 0.88rem;
}

.trending-pill {
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.trending-pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.12);
  border-color: rgba(37, 99, 235, 0.25);
  color: var(--accent);
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.saved-panel,
.places-panel {
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 32px;
  padding: 26px;
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.06);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 24px;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.view-all {
  color: var(--accent);
  font-weight: 700;
}

.saved-list-shell {
  display: grid;
  gap: 18px;
}

.add-destination {
  width: 100%;
  border: 2px dashed rgba(37, 99, 235, 0.25);
  border-radius: 22px;
  background: rgba(59, 130, 246, 0.06);
  color: var(--accent);
  font-weight: 700;
  padding: 18px 16px;
  cursor: pointer;
}

.places-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.category-pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-pill {
  border: 1px solid rgba(37, 99, 235, 0.15);
  background: #f8fbff;
  color: var(--accent);
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
}

.category-pill.active {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), #eff6ff);
}

.feature-cards {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.hero-place-card {
  display: grid;
  gap: 18px;
  padding: 24px;
  border-radius: 28px;
  background: linear-gradient(180deg, #0f172a 0%, #2563eb 100%);
  color: white;
  min-height: 420px;
}

.hero-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.hero-tag {
  background: rgba(255, 255, 255, 0.12);
  color: #dbeafe;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
}

.hero-rating {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 700;
}

.hero-card-media {
  position: relative;
  border-radius: 24px;
  min-height: 240px;
  overflow: hidden;
}

.hero-card-image {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  min-height: 240px;
  background: linear-gradient(135deg, #1d4ed8, #7c3aed) center/cover no-repeat;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
}

.media-play-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.28);
  border: 0;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
  border-radius: 24px;
}

.media-play-overlay:hover {
  background: rgba(0, 0, 0, 0.38);
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 0.15s ease;
  z-index: 2;
}

.carousel-arrow:hover {
  background: rgba(255, 255, 255, 0.35);
}

.carousel-arrow.prev {
  left: 10px;
}

.carousel-arrow.next {
  right: 10px;
}

.media-counter {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  z-index: 2;
}

.hero-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.hero-card-label {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
}

.hero-card-distance {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.78);
}

.menu-gallery {
  position: relative;
  width: 100%;
  max-width: 800px;
  border-radius: 18px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
  aspect-ratio: 4 / 3;
}

.menu-gallery-image {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: #0f172a;
}

.menu-gallery-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.gallery-arrow {
  background: rgba(255, 255, 255, 0.25);
}

.gallery-counter {
  background: rgba(0, 0, 0, 0.55);
}

.hero-card-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.small-place-cards {
  display: grid;
  gap: 20px;
}

.small-card {
  display: grid;
  grid-template-columns: 90px 1fr auto;
  gap: 12px;
  padding: 18px;
  border-radius: 24px;
  background: #f8fbff;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.small-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.small-card-image {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 20px;
  background: center/cover no-repeat;
  background-image: url('https://images.unsplash.com/photo-1506470152711-9d27b07f4b7a?auto=format&fit=crop&w=600&q=80');
}

.small-card-image.metro {
  background-image: url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80');
}

.small-card-play {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  border-radius: 20px;
}

.small-card-info {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.small-card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
}

.small-card-subtitle {
  margin: 0;
  color: var(--muted);
}

.small-card-phone {
  margin-top: 2px;
}

.small-card-phone a {
  color: var(--accent);
  font-weight: 700;
  font-size: 0.82rem;
}

.small-card-menu {
  align-self: center;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent) 0%, #3b82f6 100%);
  color: #fff;
  padding: 6px 12px;
  font-weight: 700;
  font-size: 0.78rem;
  white-space: nowrap;
}

.explore-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 24px;
  border-radius: 28px;
  background: linear-gradient(180deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 20px 50px rgba(37, 99, 235, 0.18);
}

.explore-label {
  margin: 0 0 8px;
  font-size: 1rem;
  font-weight: 800;
}

.explore-copy {
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
  max-width: 320px;
}

.traffic-banner {
  margin-top: 32px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  align-items: center;
  padding: 28px 32px;
  border-radius: 32px;
  background: linear-gradient(90deg, rgba(37, 99, 235, 0.95), rgba(59, 130, 246, 0.9));
  color: white;
  background-image: url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.traffic-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
}

.traffic-text,
.traffic-banner button {
  position: relative;
  z-index: 1;
}

.traffic-text .eyebrow {
  margin: 0 0 8px;
  color: rgba(255, 255, 255, 0.85);
}

.traffic-text h3 {
  margin: 0;
  font-size: 1.7rem;
  max-width: 680px;
}

.traffic-banner .primary-button {
  white-space: nowrap;
}

@media (max-width: 1120px) {
  .topbar {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .topnav {
    justify-content: center;
  }

  .profile-chip {
    justify-content: center;
  }

  .app-shell {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .topbar {
    margin-bottom: 0;
  }

  .content-grid {
    display: contents;
  }

  .saved-panel {
    order: 0;
  }

  .hero-panel {
    order: 1;
    margin-bottom: 0;
  }

  .places-panel {
    order: 2;
  }

  .traffic-banner {
    order: 3;
  }

  .feature-cards {
    grid-template-columns: 1fr;
  }

  .places-panel,
  .saved-panel {
    padding: 22px;
  }
}

@media (max-width: 720px) {
  .app-shell {
    padding: 18px 14px 32px;
  }

  .hero-copy h1 {
    font-size: 2.7rem;
  }

  .hero-panel {
    padding: 30px 24px;
  }

  .topbar {
    padding: 18px 16px;
  }

  .hero-card-image,
  .small-card-image,
  .small-card-image.metro {
    min-height: 180px;
  }

  .traffic-banner {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}

.hero-copy,
.hero-visual {
  position: relative;
  z-index: 1;
}

.hero-copy {
  max-width: 660px;
}

.hero h1 {
  margin: 8px 0 10px;
  font-size: clamp(2.2rem, 6vw, 4.5rem);
  line-height: 0.95;
  letter-spacing: -0.03em;
}

.hero p {
  max-width: 610px;
  margin: 0;
  color: rgba(255, 255, 255, 0.84);
  font-size: 1.04rem;
  line-height: 1.7;
}

.eyebrow {
  margin: 0 0 6px;
  color: #bfdbfe;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.12);
  color: #f8fafc;
  font-size: 0.86rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.hero-visual {
  display: flex;
  justify-content: flex-end;
}

.hero-badge {
  width: min(100%, 380px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(22px);
  padding: 22px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.2);
}

.hero-badge-header {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.hero-badge-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  flex: 0 0 52px;
}

.hero-badge strong {
  display: block;
  margin-bottom: 6px;
  font-size: 1.02rem;
  line-height: 1.3;
}

.hero-badge span {
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.95rem;
  line-height: 1.6;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.hero-metrics > div {
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.hero-metrics strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 4px;
}

.hero-metrics span {
  display: block;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.82);
}

.workspace {
  display: grid;
  grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
  gap: 24px;
  margin-top: 24px;
  align-items: start;
}

.side-panel,
.results-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.address-form,
.address-list,
.filter-panel,
.search-bar,
.empty-state,
.loading-state,
.notice,
.error {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(16px);
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
  font-weight: 800;
  color: var(--text);
}

label {
  display: grid;
  gap: 7px;
  color: #4d5b54;
  font-size: 0.88rem;
  font-weight: 700;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid #dbe6ff;
  border-radius: 14px;
  background: #f8fbff;
  color: var(--text);
  outline: none;
  padding: 12px 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

textarea {
  resize: vertical;
}

input:focus,
textarea:focus,
select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.16);
  background: #fff;
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
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.tag-button {
  flex: 1;
  background: #edf4ff;
  color: #31548a;
}

.tag-button.active,
.primary-button {
  background: linear-gradient(135deg, var(--accent) 0%, #3b82f6 100%);
  color: #fff;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.25);
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
  background: #f1f5f9;
  color: #214151;
  padding: 0 14px;
}

.action-button {
  border: 1px solid #dce7f1;
  background: #fff;
}

.action-button:hover,
.ghost-button:hover,
.primary-button:hover,
.tag-button:hover {
  transform: translateY(-1px);
}

.primary-action {
  background: linear-gradient(135deg, var(--accent) 0%, #3b82f6 100%);
  color: #fff;
  border-color: transparent;
}

.icon-action {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent) 0%, #3b82f6 100%);
  color: #fff;
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.22);
}

.icon-button {
  width: 42px;
  flex: 0 0 42px;
  background: #eff4ff;
  color: #30475f;
}

.icon-button.danger {
  color: #b42318;
}

.error {
  margin: 0;
  color: #b42318;
  font-weight: 700;
  padding: 12px 14px;
}

.notice {
  margin: 0;
  border-color: #dce6f4;
  background: #f8fbff;
  color: #42546b;
  padding: 12px 14px;
  font-weight: 700;
}

.muted {
  margin: 0;
  color: #64748b;
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
  font-size: 1.05rem;
  color: var(--text);
}

.section-heading span {
  border-radius: 999px;
  background: #e8f1ff;
  color: #1d4ed8;
  padding: 4px 10px;
  font-weight: 800;
  font-size: 0.76rem;
}

.address-stack {
  display: grid;
  gap: 10px;
}

.address-card {
  display: flex;
  align-items: stretch;
  gap: 9px;
  border: 1px solid #dce7f1;
  border-radius: 16px;
  padding: 10px;
  background: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.address-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
}

.address-card.selected {
  border-color: var(--accent);
  box-shadow: inset 0 0 0 1px var(--accent);
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
  color: #5f6d7a;
  font-size: 0.86rem;
  line-height: 1.35;
}

.address-main small {
  color: #73818f;
  font-size: 0.76rem;
  font-weight: 700;
}

.address-tag {
  width: fit-content;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  padding: 3px 9px;
  font-size: 0.75rem;
  font-weight: 800;
}

.candidate-list,
.fallback-tools {
  display: grid;
  gap: 10px;
  border-top: 1px solid #e2e8f0;
  padding-top: 12px;
}

.suggestions-list {
  border-top: 0;
  padding-top: 0;
  margin-top: -4px;
}

.candidate-title {
  margin: 0;
  color: #43566c;
  font-weight: 800;
}

.candidate-button {
  width: 100%;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid #dce7f1;
  border-radius: 14px;
  background: #fff;
  color: var(--text);
  padding: 12px;
  text-align: left;
  cursor: pointer;
}

.candidate-button span {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.candidate-button small {
  color: #6b7a89;
  line-height: 1.25;
}

.fallback-tools {
  background: #f8fbff;
  border: 1px solid #e4edf7;
  border-radius: 16px;
  padding: 12px;
}

.search-bar {
  align-items: center;
  padding: 12px;
}

.search-input-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}

.search-input {
  min-width: 0;
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #dbe6ff;
  border-radius: 16px;
  background: #f8fbff;
  padding: 0 12px;
  min-height: 46px;
}

.search-input input {
  border: 0;
  box-shadow: none;
  padding-left: 0;
  background: transparent;
}

.search-suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 20;
  display: grid;
  gap: 6px;
  padding: 8px;
  border: 1px solid #d8e7ff;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.12);
}

.suggestion-item {
  display: grid;
  gap: 2px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--text);
  padding: 8px 10px;
  text-align: left;
  cursor: pointer;
}

.suggestion-item:hover {
  background: #f3f8ff;
}

.suggestion-item small {
  color: #64748b;
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
  color: var(--text);
}

.filter-panel span {
  color: #67788b;
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
  color: #5e6d7b;
}

.empty-state p {
  margin-bottom: 0;
}

.place-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.result-card {
  display: grid;
  grid-template-rows: 200px 1fr;
  border-radius: 24px;
  overflow: hidden;
  background: var(--surface-strong);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.1);
}

.result-card-media {
  position: relative;
  background: linear-gradient(135deg, #1d4ed8, #7c3aed);
}

.result-card-bg {
  position: absolute;
  inset: 0;
  background: center/cover no-repeat;
}

.result-card-body {
  display: grid;
  gap: 6px;
  padding: 16px;
}

.result-card-type-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-card-type {
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.result-card-rating {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px;
  border-radius: 999px;
  background: #fef3c7;
  color: #92400e;
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1;
}

.rating-star-icon {
  color: #f59e0b;
}

.result-card-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.2;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.card-weather-tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
  background: #f0f9ff;
  color: #0369a1;
  line-height: 1.2;
}



.result-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: 1px solid #dce7f1;
  border-radius: 12px;
  background: #fff;
  color: var(--text);
  cursor: pointer;
  font-size: 1.1rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.action-btn[title="Directions"] {
  background: #3b82f6;
  color: #fff;
  border-color: transparent;
}

.action-btn[title="Directions"]:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.transport-mode-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 4px;
  flex-wrap: wrap;
}

.transport-mode-group {
  display: flex;
  gap: 6px;
  background: #f1f5f9;
  border-radius: 14px;
  padding: 4px;
}

.transport-mode-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #475569;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.transport-mode-btn:hover {
  color: var(--text);
}

.transport-mode-btn.active {
  background: #fff;
  color: var(--accent);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.recalc-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--muted);
  font-weight: 600;
}

.fuel-price-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  color: var(--muted);
}

.fuel-price-value {
  font-weight: 800;
  color: #059669;
}

.fuel-price-source {
  color: #94a3b8;
}

.fuel-estimated {
  font-style: italic;
  color: #f59e0b;
}

.fuel-type-group {
  display: inline-flex;
  gap: 3px;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 3px;
}

.fuel-type-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #475569;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.fuel-type-btn:hover {
  color: var(--text);
}

.fuel-type-btn.active {
  background: #fff;
  color: var(--accent);
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
}

.fuel-cost-type {
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 600;
}

.avg-badge {
  font-weight: 700;
  color: var(--muted);
  font-size: 0.8rem;
}

.avg-edit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 2px 6px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.15s ease;
}

.avg-edit-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.4);
  z-index: 2000;
}

.avg-modal {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  max-width: 380px;
  width: 90%;
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}

.avg-modal-title {
  margin: 0 0 8px;
  font-size: 1.15rem;
  font-weight: 800;
}

.avg-modal-desc {
  margin: 0 0 20px;
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.5;
}

.avg-input {
  width: 100%;
  padding: 12px 14px;
  font-size: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  outline: none;
  box-sizing: border-box;
}

.avg-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
}

.avg-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.avg-btn-cancel {
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #fff;
  font-weight: 600;
  cursor: pointer;
  color: var(--muted);
}

.avg-btn-save {
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.avg-btn-save:hover {
  filter: brightness(1.08);
}

.traffic-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
  background: #94a3b8;
  flex-shrink: 0;
}

.traffic-dot.traffic-high {
  background: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.5);
}

.traffic-dot.traffic-moderate {
  background: #f97316;
  box-shadow: 0 0 6px rgba(249, 115, 22, 0.5);
}

.traffic-dot.traffic-low {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
}

.result-card-dist {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 3px;
  margin: 0;
  color: var(--muted);
  font-size: 0.88rem;
}

.result-card-duration-sep {
  color: #cbd5e1;
}

.result-card-duration {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-weight: 600;
  color: #475569;
}

.duration-icon {
  color: #94a3b8;
}

.result-card-petrol {
  font-weight: 700;
  color: #059669;
}

.result-card-traffic-duration {
  color: #ef4444;
  font-weight: 600;
  font-size: 0.82rem;
}

.weather-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 14px;
  margin-bottom: 16px;
  font-size: 0.88rem;
}

.weather-bar.weather-loading {
  color: var(--muted);
  font-weight: 600;
  gap: 6px;
}

.weather-icon {
  font-size: 1.3rem;
  line-height: 1;
}

.weather-temp {
  font-weight: 800;
  color: var(--accent);
  font-size: 1rem;
}

.weather-label {
  color: #475569;
  font-weight: 600;
}

.weather-feels {
  color: var(--muted);
  font-size: 0.8rem;
}

.result-card-parking {
  margin: 2px 0 0;
  font-size: 0.82rem;
  font-weight: 700;
}

.result-card-parking.parking-yes {
  color: #059669;
}

.result-card-hours {
  margin: 2px 0 0;
  font-size: 0.82rem;
  font-weight: 700;
}

.result-card-hours.open-now {
  color: #059669;
}

.result-card-hours.closed-now {
  color: #dc2626;
}



.share-btn {
  background: #f0f9ff;
  color: #0369a1;
  border-color: transparent;
  transition: all 0.15s ease;
}

.share-btn:hover {
  background: #e0f2fe;
  box-shadow: 0 4px 12px rgba(3, 105, 161, 0.2);
}

.action-btn[title="Call"] {
  background: #d1fae5;
  color: #065f46;
  border-color: transparent;
}

.action-btn[title="Call"]:hover {
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  color: var(--text-secondary);
}

.empty-icon {
  color: var(--accent);
  opacity: 0.5;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 0.9rem;
  max-width: 360px;
  line-height: 1.5;
}

.menu-btn {
  width: auto;
  padding: 0 14px;
  font-weight: 700;
  font-size: 0.85rem;
  gap: 6px;
  background: #fff;
  color: var(--text);
}

.review-btn {
  color: #8b5cf6;
}

.review-btn:hover {
  background: #f5f3ff;
  border-color: #8b5cf6;
}

.vid-btn {
  color: #dc2626;
}

.vid-btn:hover {
  background: #fef2f2;
  border-color: #dc2626;
}

.video-arrow {
  z-index: 12;
}

.video-counter {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 12;
}

/* ═══════════════════════════════════════════════════════════════════
   REVIEWS MODAL
   ═══════════════════════════════════════════════════════════════════ */
.reviews-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: rgba(2, 6, 23, 0.74);
  padding: 20px;
  animation: fadeIn 0.15s ease;
}

.reviews-modal {
  position: relative;
  width: 100%;
  max-width: 520px;
  max-height: 80vh;
  background: #fff;
  border-radius: 24px;
  padding: 28px 24px 20px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}

.reviews-modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  cursor: pointer;
  transition: background 0.15s;
  z-index: 1;
}

.reviews-modal-close:hover {
  background: #e2e8f0;
}

.reviews-modal-title {
  margin: 0 0 20px;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  padding-right: 32px;
  flex-shrink: 0;
}

.reviews-list {
  overflow-y: auto;
  display: grid;
  gap: 16px;
  padding-right: 4px;
}

.review-item {
  padding: 14px;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.review-avatar {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  object-fit: cover;
  flex-shrink: 0;
}

.review-avatar-fallback {
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
}

.review-author-info {
  flex: 1;
  min-width: 0;
}

.review-author-name {
  display: block;
  font-size: 0.85rem;
  color: #0f172a;
  line-height: 1.3;
}

.review-time {
  display: block;
  font-size: 0.72rem;
  color: #94a3b8;
}

.review-rating {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #f59e0b;
  flex-shrink: 0;
}

.review-text {
  margin: 0;
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.6;
}

.reviews-empty {
  text-align: center;
  color: #94a3b8;
  padding: 40px 0;
  margin: 0;
}

@media (max-width: 700px) {
  .place-grid {
    grid-template-columns: 1fr;
  }
}

.media-strip {
  position: relative;
  background: linear-gradient(135deg, #1d4ed8, #7c3aed);
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
  color: rgba(255, 255, 255, 0.9);
  font-weight: 800;
}

.empty-media.loading {
  background: linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%);
}

.spin {
  animation: spin 0.8s linear infinite;
}

.distance-pill {
  position: absolute;
  right: 12px;
  bottom: 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
  color: #fff;
  padding: 8px 12px;
  font-weight: 800;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
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

.header-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #eef4ff;
  color: #1d4ed8;
}

.place-head h3 {
  margin: 4px 0 0;
  font-size: 1.12rem;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.rating {
  flex: 0 0 auto;
  max-width: 150px;
  border-radius: 999px;
  background: #fef3c7;
  color: #92400e;
  padding: 7px 10px;
  font-size: 0.75rem;
  font-weight: 800;
}

.place-address,
.distance-note {
  margin: 0;
  color: #64748b;
  line-height: 1.45;
}

.distance-note {
  font-weight: 700;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  align-items: center;
}

.feature-grid span {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 12px;
  background: transparent;
  color: #5d6c7b;
  padding: 0;
  font-size: 0.78rem;
  font-weight: 700;
  transition: color 0.2s ease, transform 0.2s ease;
  cursor: default;
}

.feature-grid span:hover {
  color: var(--accent);
  transform: scale(1.08);
}

.video-strip {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 4px;
}

.video-thumb {
  flex: 0 0 auto;
  width: 160px;
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  background: #000;
  scroll-snap-align: start;
  transition: transform 0.15s ease;
}

.video-thumb:hover {
  transform: scale(1.03);
}

.video-thumb img {
  width: 160px;
  height: 90px;
  object-fit: cover;
  display: block;
}

.video-thumb-fallback {
  width: 160px;
  height: 90px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #0f172a, #1d4ed8);
  color: #fff;
}

.video-thumb-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.28);
  color: #fff;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.video-thumb:hover .video-thumb-overlay {
  opacity: 1;
}

.video-thumb-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 6px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.82));
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: rgba(2, 6, 23, 0.74);
  padding: 20px;
  animation: fadeIn 0.15s ease;
}

.video-modal {
  position: relative;
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16 / 9;
  border-radius: 18px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
}

.video-modal iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.video-modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.62);
  color: #fff;
  cursor: pointer;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 920px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    justify-content: stretch;
  }

  .hero-badge {
    width: 100%;
  }

  .workspace {
    grid-template-columns: 1fr;
  }

  .search-bar,
  .filter-panel,
  .place-head {
    align-items: stretch;
    flex-direction: column;
  }

  .filter-panel {
    padding: 14px 12px;
  }

  .review-filter,
  .search-input {
    width: 100%;
    min-width: 0;
  }

  .place-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .app-shell {
    padding: 14px 12px 40px;
  }

  .topbar {
    padding: 12px 14px;
    gap: 10px;
    margin-bottom: 16px;
  }

  .brand-mark {
    width: 32px;
    height: 32px;
    border-radius: 10px;
  }

  .brand-row {
    gap: 10px;
    justify-content: center;
  }

  .brand-name {
    font-size: 0.92rem;
  }

  .brand-subtitle {
    font-size: 0.75rem;
    margin: 1px 0 0;
  }

  .profile-chip {
    display: none;
  }

  .hero {
    min-height: 320px;
    padding: 24px 18px;
    border-radius: 24px;
  }

  .hero-metrics {
    grid-template-columns: 1fr;
  }

  .search-bar,
  .filter-panel,
  .place-head,
  .address-card {
    align-items: stretch;
    flex-direction: column;
  }

  .places-header {
    flex-wrap: wrap;
  }

  .transport-mode-bar {
    flex-wrap: wrap;
    gap: 8px;
  }

  .fuel-price-info {
    flex-wrap: wrap;
    gap: 6px;
  }

  .fuel-type-group {
    flex-wrap: wrap;
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

  .reviews-modal {
    max-width: none;
    width: 100%;
    max-height: 90vh;
    padding: 24px 16px 16px;
    border-radius: 20px;
  }

  .reviews-modal-title {
    font-size: 0.95rem;
    margin-bottom: 16px;
  }

  .review-item {
    padding: 12px;
  }
}
</style>
