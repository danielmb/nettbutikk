<script setup lang="ts">
const route = useRoute();

const { data: item } = await useFetch(`/api/items/${Number(route.params.itemId)}`);
const { addItem, items } = useCartStore();
watch(() => item, (value) => {
  console.log('Cart items changed', value);
}, { deep: true });
</script>

<template>
  {{ item }}
  <div v-if="item" class="flex flex-col px-24">
    <!-- <h1>Item {{ $route.params.id }}</h1>
    <Button @click="addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      thumbnail: item.image,
    })">Add to Cart</Button>
     -->
    <div class="flex flex-row justify-between">
      <div class="w-4/6" v-if="item && item?.images">
        <ItemGallery :images="item.images" />
      </div>
      <div class="w-1/2">
        <h1>{{ item.name }}</h1>
        <p>{{ item.description }}</p>
        <p>{{ item.price }}</p>
        <Button @click="addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          thumbnail: item.image,
        })">Add to Cart</Button>
      </div>
    </div>
  </div>
</template>