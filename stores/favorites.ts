import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
export interface Favorite {
  id: number;
}

// export const useFavoritesStore = defineStore('favorites', {
//   state: () => ({
//     userToken: useCookie('token'),
//   }),
//   getters: {
//     getUserToken: (state) => {
//       return state.userToken;
//     },
//   },
//   actions: {
//     storeToken(token: string) {
//       this.userToken = token;
//       const newCookie = useCookie('token', {
//         maxAge: 60 * 24 * 28,
//         sameSite: true,
//         secure: true,
//       });
//       newCookie.value = this.userToken;
//     },
//   },
// });

export const useFavoritesStore = defineStore('favorites', {
  state: () => {
    const favorites = useLocalStorage('favorites', [] as number[]);
    return {
      favorites: favorites,
    };
  },
  getters: {
    getFavorites: (state) => {
      return state.favorites;
    },
    isFavorited: (state) => (id: number) => {
      return state.favorites.includes(id);
    },
  },
  actions: {
    toggleFavorite(id: number) {
      const index = this.favorites.indexOf(id);
      if (index === -1) {
        this.favorites.push(id);
      } else {
        this.favorites.splice(index, 1);
      }
    },
  },

  hydrate(state, initialState) {
    state.favorites = useLocalStorage('favorites', [] as number[]).value;
  },
});
