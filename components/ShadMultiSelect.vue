<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Check, ChevronsUpDown, X } from 'lucide-vue-next'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface Props {
  options: Option[]
  placeholder?: string
  disabled?: boolean
  maxSelected?: number
  emptyMessage?: string
  noBadge?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select items...',
  disabled: false,
  maxSelected: Infinity,
  emptyMessage: 'No results found.',
  noBadge: false
})

const emit = defineEmits(['update:modelValue'])

const modelValue = defineModel<string[]>({ default: [] })
const open = ref(false)
const search = ref('')

const selectedOptions = computed(() => {
  return modelValue.value?.map(value => props.options.find(option => option.value === value)) || []
})

const filteredOptions = computed(() => {
  if (!search.value) return props.options

  const searchLower = search.value.toLowerCase()
  return props.options.filter(option =>
    option.label.toLowerCase().includes(searchLower)
  )
})

const isSelected = (value: string) => {
  return modelValue.value?.includes(value) || false
}

const canSelectMore = computed(() => {
  return !modelValue.value || modelValue.value.length < props.maxSelected
})

const toggleOption = (option: Option) => {
  if (isSelected(option.value)) {
    // Remove option
    modelValue.value = modelValue.value?.filter(v => v !== option.value)
  } else if (canSelectMore.value) {
    // Add option
    modelValue.value = [...(modelValue.value || []), option.value]
  }
}

const removeOption = (value: string) => {
  modelValue.value = modelValue.value?.filter(v => v !== value)
}

const clearAll = () => {
  modelValue.value = []
}

watch(open, (isOpen) => {
  if (isOpen) {
    search.value = ''
  }
})


</script>

<template>
  <div class="w-full">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button variant="outline" :disabled="disabled" role="combobox" :aria-expanded="open"
          class="w-full justify-between text-left min-h-10"
          :class="cn({ 'border-blue-200': selectedOptions.length > 0 })">
          <div class="flex gap-1 flex-wrap">
            <template v-if="selectedOptions.length && !noBadge">
              <Badge v-for="option in selectedOptions" :key="option?.value" variant="secondary" class="mr-1 mb-1">
                {{ option?.label }}
                <button
                  class="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  @click.stop="option?.value && removeOption(option?.value)">
                  <X class="h-3 w-3" />
                  <span class="sr-only">Remove {{ option?.label }}</span>
                </button>
              </Badge>
              <span v-if="!selectedOptions.length">{{ placeholder }}</span>
            </template>
            <span v-else class="text-muted-foreground">{{ placeholder }}</span>
          </div>
          <ChevronsUpDown class="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-full p-0">
        <Command :filter="() => true" class="max-h-64">
          <div class="flex items-center border-b px-3">
            <div class="flex-1">
              <CommandInput v-model="search" placeholder="Search..." class="h-9 focus:outline-none" />
            </div>
            <Button v-if="selectedOptions.length > 0" variant="ghost" size="sm" class="h-8 px-2 lg:px-3"
              @click="clearAll">
              Clear
            </Button>
          </div>
          <CommandEmpty v-if="filteredOptions.length === 0">
            {{ emptyMessage }}
          </CommandEmpty>
          <CommandGroup v-else>
            <CommandItem v-for="option in filteredOptions" :key="option.value" :value="option.value"
              :disabled="isSelected(option.value) ? false : !canSelectMore" @select="toggleOption(option)" :class="cn(
                'flex items-center gap-2',
                !canSelectMore && !isSelected(option.value) ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              )">
              <Check :class="cn(
                'h-4 w-4',
                isSelected(option.value) ? 'opacity-100' : 'opacity-0'
              )" />
              <span>{{ option.label }}</span>
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>