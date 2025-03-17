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

// export const useFavoritesStore = defineStore('favorites', {
//   state: () => {
//     // const favorites = useLocalStorage('favorites', [] as number[]);
//     const favorites = await useFetch('/api/user/favorites');
//     console.log('favorites', favorites.data.value);
//     return {
//       favorites: favorites.data.value ?? [],
//     };
//   },
//   getters: {
//     getFavorites: (state) => {
//       return state.favorites;
//     },
//     isFavorited: (state) => (id: number) => {
//       return state.favorites.find((favorite: Favorite) => favorite.id === id);
//     },
//   },
//   actions: {
//     async addFavorite(id: number) {
//       const res = await $fetch(`/api/user/favorites/${id}`, {
//         method: 'POST' as any,
//       });
//     },

//     async removeFavorite(id: number) {
//       const res = await $fetch(`/api/user/favorites/${id}`, {
//         method: 'DELETE' as any,
//       });
//     },

//     toggleFavorite(id: number) {
//       // const index = this.favorites.indexOf(id);
//       // if (index === -1) {
//       //   this.favorites.push(id);
//       // } else {
//       //   this.favorites.splice(index, 1);
//       //
//       console.log('toggleFavorite', id);
//       if (this.isFavorited(id)) {
//         console.log('removeFavorite', id);
//         console.log('this', this);
//         this.removeFavorite(id);
//         return;
//       }
//       console.log('addFavorite', id);
//       console.log('this', this);
//       this.addFavorite(id);
//     },
//   },

//   hydrate(state, initialState) {
//     // state.favorites = useLocalStorage('favorites', [] as number[]).value;
//     state.favorites = useFetch('/api/user/favorites').data.value ?? [];
//   },
// });
