import { defineStore } from 'pinia';
import { ref } from 'vue';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export const useCartStore = defineStore(
  'main',
  () => {
    const items = ref<CartItem[]>([]);

    const addItem = (item: CartItem) => {
      const existingItem = items.value.find((i) => i.id === item.id);
      if (existingItem) {
        // Create a new array with updated quantity
        items.value = items.value.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      } else {
        // Create a new array with the added item
        items.value = [...items.value, { ...item, quantity: 1 }];
      }
    };

    const removeItem = (itemId: number) => {
      // Create a new array with items filtered out
      items.value = items.value.filter((i) => i.id !== itemId);
    };

    const updateQuantity = (itemId: number, quantity: number) => {
      // Create a new array with updated quantity
      items.value = items.value.map((i) =>
        i.id === itemId ? { ...i, quantity } : i,
      );
    };

    const clearCart = () => {
      items.value = [];
    };

    const totalItems = computed(() =>
      items.value.reduce((total, item) => total + item.quantity, 0),
    );
    const totalPrice = computed(() =>
      items.value.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    );

    return {
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      // get totalItems() {
      //   return items.value.reduce((total, item) => total + item.quantity, 0);
      // },
      // get totalPrice() {
      //   return items.value.reduce(
      //     (total, item) => total + item.price * item.quantity,
      //     0,
      //   );
      // },
      totalItems,
      totalPrice,
    };
  },
  {
    persist: true,
  },
);
