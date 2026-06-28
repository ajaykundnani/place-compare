import { createApp } from 'vue'
import VueGtag from 'vue-gtag-next'
import App from './App.vue'

const app = createApp(App)

const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID
if (gaId) {
  app.use(VueGtag, {
    property: { id: gaId },
  })
}

app.mount('#app')
