// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import Aura from '@primevue/themes/aura';
export default defineNuxtConfig({
  nitro: {
    
    // routeRules: {
    //   '/*/auth/login': { // Qualquer segmento antes de /auth/login
    //     headers: {
    //       'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests; base-uri 'self'; form-action 'self' http://localhost:3000;"
    //     }
    //   },
    //   '/**': { // CSP padrão para o restante da aplicação
    //     headers: {
    //       'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests; base-uri 'self'; form-action 'self';"
    //     }
    //   }
    // },

    publicAssets: [
      {
        dir: 'server/data',
        baseURL: '/data'
      }
    ]
  },
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
      ],
      server: {
        watch: {
          ignored: ['**/*.db', '**/server/data/*.db'],
        },
      }
    }
})