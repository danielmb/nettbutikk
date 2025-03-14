// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
export default defineNuxtConfig({
  typescript: {
    typeCheck: true,
  },
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@sidebase/nuxt-auth',
    'nuxt-auth-utils',
  ],
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  tailwindcss: {},
  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: Aura,
      },
    },
  },
  css: ['primeicons/primeicons.css'],
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
  auth: {
    isEnabled: true,
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'authjs',
    },
  },
});
