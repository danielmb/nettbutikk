<template>
  <select v-model="selectedCurrency" @change="changeCurrency">
    <option v-for="currency in currencies" :key="currency" :value="currency">
      {{ currency }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCurrencyStore } from '@/stores/currency';

const currencies = ref(['USD', 'NOK']);
const currencyStore = useCurrencyStore();

const selectedCurrency = ref(currencyStore.currency);

const changeCurrency = () => {
  currencyStore.setCurrency(selectedCurrency.value);
};

</script>