import { useCurrencyStore } from '~/stores/currency';

export default defineEventHandler(() => {
  // get currency from the store
  const currency = useCurrencyStore().currency;

  return {
    lastUpdated: Date.now(),
    baseCurrency: 'NOK',
    userCurrency: currency,
    exchangeRates: {
      NOK: {
        rate: 1,
        timestamp: Date.now(),
      },
      USD: {
        rate: 0.12,
        timestamp: Date.now(),
      },
    },
  };
});
