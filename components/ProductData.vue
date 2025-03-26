<!-- components/Product.vue -->
<template>
  <a :href="`/${product.brand?.slug ?? product.brand?.id}/${urlFriendly(product.name)}/prd/${productId}`">
    <slot>
      {{ productId }}
    </slot>
  </a>
</template>

<script setup lang="ts">
import { urlFriendly } from '~/lib/utils'

interface ProductProps {
  id: number | string
  name: string,
  category?: {
    id: number
    slug: string | null
  } | null
  brand?: {
    id: number
    slug: string | null
  } | null
}

const props = withDefaults(defineProps<{
  product: ProductProps
}>(), {
  product: () => ({ id: '', name: '' })
})

const productId = computed(() => {
  return props.product?.id || ''
})
</script>