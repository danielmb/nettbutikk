import { isClient, useSessionStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useCategoryStore = defineStore('auth', {
  // state: () => ({
  //   category: useSessionStorage('pinia/category', 'men'),
  // }),
  state: () => {
    if (isClient) {
      return {
        category: sessionStorage.getItem('pinia/category') ?? 'men',
      };
    }
    return {
      category: 'men',
    };
  },

  actions: {
    save() {
      sessionStorage.setItem('pinia/category', this.category);
    },
    setCategory(category: string) {
      this.category = category;
      this.save();
    },
  },
  hydrate(state, initialState) {},
});
