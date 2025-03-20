<script setup lang="ts">
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
const cartStore = useCartStore();
const { items, totalItems, totalPrice } = storeToRefs(cartStore);
const { removeItem, clearCart, updateQuantity } = cartStore;

const { formattedAmount } = useCurrencyStore();

// This will properly watch the items array
const sheetOpen = ref(false);
watch(items, (newItems) => {
  sheetOpen.value = true;
}, { deep: true });

</script>

<template>
  <Sheet v-model:open="sheetOpen">
    <SheetTrigger as-child>
      <Button class="pi pi-shopping-cart" />
    </SheetTrigger>
    <SheetContent class="flex flex-col p-0">
      <SheetTitle class="px-4 py-2">Your Cart</SheetTitle>
      <SheetDescription class="px-4">
        You have {{ totalItems }} items in your cart.
      </SheetDescription>
      <div class="flex flex-col space-y-4 justify-between h-full overflow-y-auto p-0">

        <div class="w-full flex flex-col max-h-full overflow-y-auto px-4">
          <div v-for="item in items" :key="item.id" class="flex flex-row justify-between last:border-b-0 border-b-2">

            <!-- Image -->
            <a :href="`/item/${item.id}`" class="w-1/3 h-32 p-1">
              <img :src="item.thumbnail" alt="item" class="w-full h-full  object-cover" />
            </a>
            <!-- Name -->

            <div class="flex flex-col w-2/3 px-2 justify-between">
              <a :href="`/item/${item.id}`" class="flex flex-col justify-between h-fit">

                <span>{{ formattedAmount(item.price) }}</span>
                <span>{{ item.name }}</span>
                <div class="flex flex-row justify-between">
                  <p>BROWN</p>
                  <p>Size 9</p>
                  <p>Qty: {{ item.quantity }}</p>
                </div>
              </a>

              <div class="flex flex-row justify-end">
                <Button @click="item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)"
                  :class="{ 'pi pi-trash': item.quantity === 1, 'pi pi-minus': item.quantity > 1 }" />
              </div>
            </div>

          </div>
        </div>
        <div>
          <div class="flex flex-row justify-between py-4 bg-gray-100 px-6">
            <span>SUBTOTAL</span>
            <span>{{ formattedAmount(totalPrice) }}</span>
          </div>
          <div class="flex flex-row justify-between py-4 bg-gray-200 px-6">
            <Button @click="clearCart">Clear Cart</Button>
            <Button>Checkout</Button>
          </div>


        </div>
      </div>
    </SheetContent>
  </Sheet>


</template>
