<script setup lang="ts">
const route = useRoute();
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const { data: item } = await useFetch(
  `/api/items/${Number(route.params.itemId)}`,
);
const { addItem, items } = useCartStore();
watch(
  () => item,
  (value) => {
    console.log('Cart items changed', value);
  },
  { deep: true },
);
const { formattedAmount } = useCurrencyStore();

const size = computed(() => {
  return item?.value?.attributes.find(
    (attr) => attr.attributeValue.attributeType.slug === 'size',
  );
});

const color = computed(() => {
  return item?.value?.attributes.find(
    (attr) => attr.attributeValue.attributeType.slug === 'color',
  );
});

const brand = computed(() => {
  return item?.value?.attributes.find(
    (attr) => attr.attributeValue.attributeType.slug === 'brand',
  );
});

const { categoryUrl } = useCategory();
</script>

<template>
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
        <ItemGallery :images="[{ id: -1, url: item.image }, ...item.images]" />
      </div>
      <div class="w-1/2 flex flex-col space-y-4">
        <h1 class="text-2xl font-bold mb-4">{{ item.name }}</h1>
        <p>
          <Price :price="item.price" />
        </p>
        <div>
          <span>
            <!-- Color: <span class="text-gray-500">Brown</span> -->
            Color:
            <span class="text-gray-500">{{
              color?.attributeValue.displayName
            }}</span>
          </span>
        </div>
        <div>
          <span>
            Size:
            <span class="text-gray-500">{{
              size?.attributeValue.displayName
            }}</span>
          </span>
        </div>

        <div v-if="item.parentVariant" class="flex flex-row space-x-4">
          <a
            v-for="itemVariant in item.parentVariant.Items"
            :key="itemVariant.id"
            :href="`${categoryUrl}/item/${itemVariant.id}`"
            class="flex flex-col items-center space-y-2"
            :class="{ 'border-b-2 border-black': itemVariant.id === item.id }"
          >
            <img :src="itemVariant.image" class="w-12 h-20 object-cover" />
            <span>{{ itemVariant.name }}</span>
          </a>
        </div>

        <Button
          @click="
            addItem({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: 1,
              thumbnail: item.image,
              color: color?.attributeValue.displayName,
              size: size?.attributeValue.displayName,
            })
          "
          >Add to Cart</Button
        >
        <div>
          <Accordion type="single" class="w-full" collapsible>
            <AccordionItem
              v-if="item.description"
              :value="item.description ?? ''"
            >
              <AccordionTrigger> Product Details </AccordionTrigger>
              <AccordionContent>
                {{ item.description }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" class="w-full" collapsible>
            <AccordionItem
              v-if="brand?.attributeValue.description"
              :value="brand?.attributeValue.description ?? ''"
            >
              <AccordionTrigger> Brand </AccordionTrigger>
              <AccordionContent>
                {{ brand?.attributeValue.description }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
</template>
