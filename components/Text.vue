<template>
  <div class="relative">
    <p v-if="isTruncated"
      :style="{ height: truncatedHeight + 'px', overflow: 'hidden', marginBottom: '0', lineHeight: lineHeight }">
      {{ truncatedText }}
    </p>
    <p v-else :style="{ marginBottom: '0', lineHeight: lineHeight }">{{ text }}</p>

    <template v-if="shouldShowMoreButton">
      <slot name="button" v-bind="{ isExpanded, toggleExpand }">
        <!-- Default button if no slot is provided -->
        <button @click="toggleExpand"
          class="absolute bottom-0 right-0 bg-white dark:bg-zinc-900 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 font-medium text-sm flex items-center px-2 py-1 rounded-md shadow-sm">
          {{ isExpanded ? 'Show Less' : 'Show More' }}
          <i :class="['pi', isExpanded ? 'pi-chevron-up' : 'pi-chevron-down', 'ml-1']"></i>
        </button>
      </slot>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  maxLength: {
    type: Number,
    default: 150, // Maximum characters before truncation
  },
  truncatedHeight: {
    type: Number,
    default: 60, // Maximum height in pixels before truncation. This is important to handle multi-line text.  Adjust as needed.
  },
  lineHeight: {
    type: String,
    default: '1.5', // Adjust as needed.  Important for accurate height calculation.
  },
});

const isExpanded = ref(false);
const shouldShowMoreButton = ref(false);

const truncatedText = computed(() => {
  if (props.text.length > props.maxLength && !isExpanded.value) {
    return props.text.substring(0, props.maxLength) + '...';
  }
  return props.text;
});

const isTruncated = computed(() => {
  return props.text.length > props.maxLength && !isExpanded.value;
});

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

onMounted(() => {
  if (props.text.length > props.maxLength) {
    shouldShowMoreButton.value = true;
  }
});
</script>