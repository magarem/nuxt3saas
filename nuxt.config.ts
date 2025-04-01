// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import Aura from '@primevue/themes/aura';
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/main.css', '~/assets/tailwind.css', '~/assets/styles.scss'],
  devtools: { enabled: true },
  modules: ['@nuxt/scripts', '@primevue/nuxt-module', 'nuxt-security'],
  primevue: {
      options: {
          theme: {
              preset: Aura,
              options: {
                  darkModeSelector: '.app-dark'
              }
          }
      }
  },
  security: {
    // Options
  },
  vite: {
      plugins: [
        tailwindcss(),
      ]
    }
})