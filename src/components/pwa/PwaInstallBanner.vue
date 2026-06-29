<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/*
 * ── PWA Install Banner ──────────────────────────────────────────
 * Shows an install prompt on mobile devices.
 * - Android: uses beforeinstallprompt event → native install dialog
 * - iOS: shows instructions → Share → Add to Home Screen
 * Dismissal is remembered for 7 days (localStorage).
 * Duplicate prompts within the same session are suppressed (sessionStorage).
 * ────────────────────────────────────────────────────────────────
 */

/* ── Constants ─────────────────────────────────────────────────── */
const STORAGE_KEY_DISMISS = 'pwa-banner-dismissed'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

/* ── Reactive state ────────────────────────────────────────────── */
const visible = ref(false)          /* banner visibility           */
const isAndroid = ref(false)        /* Android Chrome / WebView    */
const isIos = ref(false)            /* iPhone / iPad Safari        */
const pwaIconSrc = `${import.meta.env.BASE_URL}NearLio-PWA.png`
const showIosModal = ref(false)     /* iOS install guide modal     */
const deferredPrompt = ref(null)    /* stored beforeinstallprompt  */

/* ── Platform detection helpers (vanilla) ─────────────────────── */
function isMobile () {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function detectAndroid () {
  return /Android/i.test(navigator.userAgent)
}

function detectIos () {
  /* iPad on iPadOS 13+ reports as Macintosh, so check maxTouchPoints */
  const iosUa = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const iosLike = navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent)
  return iosUa || iosLike
}

/* ── Is the PWA already running standalone? ───────────────────── */
function isStandalone () {
  return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true
}

/* ─── Dismiss cooldown ─────────────────────────────────────────── */
function isDismissed () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DISMISS)
    if (!raw) return false
    const dismissedAt = parseInt(raw, 10)
    return Date.now() - dismissedAt < SEVEN_DAYS_MS
  } catch { return false }
}

function markDismissed () {
  try {
    localStorage.setItem(STORAGE_KEY_DISMISS, String(Date.now()))
    /* prevent same-session re-appearance */
    sessionStorage.setItem(STORAGE_KEY_DISMISS, '1')
  } catch { /* quota exceeded – silently ignore */ }
}

/* ─── Handler: close / dismiss ─────────────────────────────────── */
function dismiss () {
  visible.value = false
  markDismissed()
}

/* ─── Handler: Android install button ──────────────────────────── */
async function installAndroid () {
  if (!deferredPrompt.value) return
  deferredPrompt.value.prompt()
  const result = await deferredPrompt.value.userChoice
  if (result.outcome === 'accepted') {
    visible.value = false       /* hide after successful install */
    markDismissed()
  }
  deferredPrompt.value = null
}

/* ─── Handler: iOS "How to Install" button ─────────────────────── */
function openIosGuide () {
  showIosModal.value = true
}

function closeIosGuide () {
  showIosModal.value = false
}

/* ─── beforeinstallprompt listener (Android) ───────────────────── */
function onBeforeInstallPrompt (e) {
  e.preventDefault()                /* prevent the mini-infobar    */
  deferredPrompt.value = e

  /* If not dismissed + not standalone + mobile, show the banner   */
  if (!isDismissed() && !isStandalone() && isMobile()) {
    visible.value = true
  }
}

/* ─── Listen for "appinstalled" (Android) ──────────────────────── */
function onAppInstalled () {
  visible.value = false
  markDismissed()
}

/* ─── Lifecycle ────────────────────────────────────────────────── */
onMounted(() => {
  /* Skip if already standalone or not mobile */
  if (isStandalone() || !isMobile()) return

  /* Skip if dismissed in this session */
  try {
    if (sessionStorage.getItem(STORAGE_KEY_DISMISS)) return
  } catch { /* ignore */ }

  /* Detect platform */
  if (detectAndroid()) {
    isAndroid.value = true
    /* Listen will be attached below; show banner after prompt fires */
  }

  if (detectIos()) {
    isIos.value = true
    /* iOS has no beforeinstallprompt; always show if not dismissed */
    if (!isDismissed()) {
      /* Small delay so slide-up anim is visible after page load */
      setTimeout(() => { visible.value = true }, 600)
    }
  }

  /* Attach global listeners */
  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.addEventListener('appinstalled', onAppInstalled)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.removeEventListener('appinstalled', onAppInstalled)
})
</script>

<template>
  <!-- ══════════════════════════════════════════════════════════════
       BANNER — fixed bottom, slide-up animation
       ══════════════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <div
      v-if="visible"
      class="pwa-banner-overlay"
      role="dialog"
      aria-label="Install app banner"
    >
      <div class="pwa-banner" role="status" aria-live="polite">
        <!-- Close button -->
        <button
          class="pwa-banner-close"
          aria-label="Close install banner"
          title="Dismiss"
          @click="dismiss"
        >
          ✕
        </button>

        <!-- ── App icon (NearLio PWA icon) ──────────────────── -->
        <img class="pwa-banner-icon" :src="pwaIconSrc" alt="NearLio" />

        <!-- ── Android variant ──────────────────────────────── -->
        <template v-if="isAndroid">
          <div class="pwa-banner-content">
            <strong class="pwa-banner-title">Install NearLio</strong>
            <p class="pwa-banner-desc">Install NearLio for faster access.</p>
          </div>
          <button class="pwa-banner-btn" @click="installAndroid">
            Install App
          </button>
        </template>

        <!-- ── iOS variant ──────────────────────────────────── -->
        <template v-if="isIos">
          <div class="pwa-banner-content">
            <strong class="pwa-banner-title">Install NearLio</strong>
            <p class="pwa-banner-desc">
              Tap Share → Add to Home Screen to install NearLio.
            </p>
          </div>
          <button class="pwa-banner-btn" @click="openIosGuide">
            How to Install
          </button>
        </template>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         iOS INSTRUCTION MODAL
         ══════════════════════════════════════════════════════════════ -->
    <div
      v-if="showIosModal"
      class="pwa-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Install instructions"
      @click.self="closeIosGuide"
    >
      <div class="pwa-modal">
        <button
          class="pwa-modal-close"
          aria-label="Close instructions"
          @click="closeIosGuide"
        >
          ✕
        </button>

        <h3 class="pwa-modal-title">Install NearLio on iPhone</h3>

        <div class="pwa-modal-steps">
          <div class="pwa-step">
            <div class="pwa-step-number">1</div>
            <div class="pwa-step-body">
              <strong>Tap the Share icon</strong>
              <p>Tap the <strong>Share</strong> button 📤 at the bottom of Safari.</p>
            </div>
          </div>

          <div class="pwa-step">
            <div class="pwa-step-number">2</div>
            <div class="pwa-step-body">
              <strong>Add to Home Screen</strong>
              <p>Scroll down and tap <strong>"Add to Home Screen"</strong>.</p>
            </div>
          </div>

          <div class="pwa-step">
            <div class="pwa-step-number">3</div>
            <div class="pwa-step-body">
              <strong>Tap Add</strong>
              <p>Tap <strong>"Add"</strong> in the top-right corner to install NearLio.</p>
            </div>
          </div>
        </div>

        <button class="pwa-modal-btn" @click="closeIosGuide">Got it</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   BANNER STYLES
   ═══════════════════════════════════════════════════════════════════ */
.pwa-banner-overlay {
  position: fixed;
  inset: 0;
  top: auto;            /* only pins bottom — banner sits over content */
  z-index: 2147483647;  /* maximum safe z-index                       */
  pointer-events: none; /* allow clicks to pass through to the overlay */
  display: flex;
  justify-content: center;
  padding: 0 12px 16px;
}

.pwa-banner {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 480px;
  padding: 14px 16px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow:
    0 8px 32px rgba(15, 23, 42, 0.14),
    0 2px 8px rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(37, 99, 235, 0.10);
  position: relative;

  /* ── slide-up animation ── */
  animation: pwa-slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1);
  transform-origin: bottom center;
}

@keyframes pwa-slide-up {
  from {
    opacity: 0;
    transform: translateY(80px) scale(0.94);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ── Close button ──────────────────────────────────────────────── */
.pwa-banner-close {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.10);
  transition: background 0.15s, color 0.15s;
  z-index: 1;
}

.pwa-banner-close:hover,
.pwa-banner-close:focus-visible {
  background: #e2e8f0;
  color: #0f172a;
}

/* ── Icon (NearLio PWA icon) ──────────────────────────────────── */
.pwa-banner-icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  object-fit: cover;
}

/* ── Content ───────────────────────────────────────────────────── */
.pwa-banner-content {
  flex: 1;
  min-width: 0;
}

.pwa-banner-title {
  display: block;
  font-size: 0.92rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 2px;
}

.pwa-banner-desc {
  margin: 0;
  font-size: 0.78rem;
  color: #5d6c7b;
  line-height: 1.4;
}

/* ── Action button ─────────────────────────────────────────────── */
.pwa-banner-btn {
  flex-shrink: 0;
  white-space: nowrap;
  padding: 10px 18px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;
}

.pwa-banner-btn:hover,
.pwa-banner-btn:focus-visible {
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.32);
  transform: translateY(-1px);
}

.pwa-banner-btn:active {
  transform: translateY(0);
}

/* ═══════════════════════════════════════════════════════════════════
   iOS MODAL STYLES
   ═══════════════════════════════════════════════════════════════════ */
.pwa-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147483646;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  animation: pwa-fade-in 0.2s ease;
  padding: 20px;
}

@keyframes pwa-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.pwa-modal {
  position: relative;
  width: 100%;
  max-width: 380px;
  background: #fff;
  border-radius: 24px;
  padding: 32px 24px 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.20);
  animation: pwa-modal-up 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes pwa-modal-up {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.pwa-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.15s;
}

.pwa-modal-close:hover,
.pwa-modal-close:focus-visible {
  background: #e2e8f0;
}

.pwa-modal-title {
  margin: 0 0 24px;
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  text-align: center;
}

/* ── Steps ─────────────────────────────────────────────────────── */
.pwa-modal-steps {
  display: grid;
  gap: 20px;
  margin-bottom: 28px;
}

.pwa-step {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.pwa-step-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
}

.pwa-step-body strong {
  display: block;
  font-size: 0.9rem;
  color: #0f172a;
  margin-bottom: 3px;
}

.pwa-step-body p {
  margin: 0;
  font-size: 0.82rem;
  color: #5d6c7b;
  line-height: 1.5;
}

/* ── Modal action button ───────────────────────────────────────── */
.pwa-modal-btn {
  display: block;
  width: 100%;
  padding: 14px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  transition: box-shadow 0.15s;
}

.pwa-modal-btn:hover,
.pwa-modal-btn:focus-visible {
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.30);
}

/* ═══════════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════════ */
@media (min-width: 768px) {
  .pwa-banner-overlay {
    display: none;  /* desktop: never show */
  }
}

@media (max-width: 380px) {
  .pwa-banner {
    flex-wrap: wrap;
    gap: 8px;
  }

  .pwa-banner-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
