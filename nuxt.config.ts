// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
import { promises as fsp } from 'node:fs';
import { resolve } from 'path';

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
    './lib/modules/auth-fix.ts',
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
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
  },
});
