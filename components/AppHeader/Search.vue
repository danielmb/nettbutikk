<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'

import { ref, watch } from 'vue'

const open = ref(false)

const keys = useMagicKeys()
const CmdJ = keys['Cmd+J']
useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k' && e.type === 'keydown') {
      handleOpenChange()

      e.preventDefault()
    }
  }
})

const { products, search, setSearch } = await useProducts({ noUrl: true });

function handleOpenChange() {
  open.value = !open.value
}





</script>


<template>
  <div>
    <CommandDialog>
      <CommandInput placeholder="Type a command or search..." :model-value="search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem v-for="product in products" :key="product.id" :value="product.name">
            {{ product.name }}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </div>
</template>