import { defineStore } from 'pinia';
export interface ExchangeRate {
  rate: number;
  timestamp: number; // When the rate was last updated
}

export interface ExchangeRates {
  [currencyPair: string]: ExchangeRate; // Key format: "USD-EUR"
}

export interface CurrencyState {
  currency: string;
  locale: string;
  exchangeRates: ExchangeRates;
  lastUpdated?: number; // When the rates were last fetched
}

// export const useCurrencyStore = defineStore('currency', {
//   state: () => ({
//     currency: 'NOK',
//     exchangeRates: {},
//     lastUpdated: 0,
//   }),
//   actions: {
//     setCurrency(currency: string) {
//       this.currency = currency;
//     },
//     setExchangeRates(exchangeRates: Record<string, ExchangeRate>) {
//       this.exchangeRates = exchangeRates;
//     },
//     async fetchExchangeRates() {
//       if (Date.now() - this.lastUpdated < 60 * 60 * 1000) {
//         return this.exchangeRates;
//       }
//       const { exchangeRates, baseCurrency, lastUpdated } = await $fetch(
//         `/api/exchangerate?baseCurrency`,
//       );
//       this.setExchangeRates(exchangeRates);
//       this.lastUpdated = lastUpdated;
//       return exchangeRates;
//     },
//   },
// });
export const useCurrencyStore = defineStore('currency', {
  state: (): CurrencyState => ({
    currency: 'USD',
    locale: 'en-US',
    exchangeRates: {},
    lastUpdated: 0,
  }),
  actions: {
    setCurrency(currency: string) {
      this.currency = currency;
      if (process.client) {
        localStorage.setItem('userCurrency', currency);
      }
    },

    async fetchExchangeRates(baseCurrency: string = 'USD'): Promise<boolean> {
      try {
        // const response = await fetch(
        //   `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
        // );
        // const data = await response.json();
        const data = {
          rates: {
            USD: 1,
            EUR: 0.85,
            GBP: 0.72,
            JPY: 110.0,
            NOK: 8.5,
          },
        };
        // Format and store the exchange rates
        const now = Date.now();
        const rates: ExchangeRates = {};

        Object.entries(data.rates).forEach(([currency, rate]) => {
          const key = `${baseCurrency}-${currency}`;
          rates[key] = {
            rate: rate as number,
            timestamp: now,
          };
        });

        this.exchangeRates = { ...this.exchangeRates, ...rates };
        this.lastUpdated = now;
        return true;
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        return false;
      }
    },

    getExchangeRate(from: string, to: string): number {
      const key = `${from}-${to}`;

      // Direct rate available
      if (this.exchangeRates[key]?.rate) {
        return this.exchangeRates[key].rate;
      }

      // Try reverse rate (with inversion)
      const reverseKey = `${to}-${from}`;
      if (this.exchangeRates[reverseKey]?.rate) {
        return 1 / this.exchangeRates[reverseKey].rate;
      }

      // If we have rates for USD-from and USD-to, we can calculate
      if (from !== 'USD' && to !== 'USD') {
        const usdToFrom = this.exchangeRates[`USD-${from}`]?.rate;
        const usdToTo = this.exchangeRates[`USD-${to}`]?.rate;

        if (usdToFrom && usdToTo) {
          return usdToTo / usdToFrom;
        }
      }

      // Fallback
      return 1;
    },
  },

  getters: {
    formattedAmount:
      () =>
      (amount: number, baseCurrency?: string): string => {
        const store = useCurrencyStore();
        const convertedAmount =
          baseCurrency && baseCurrency !== store.currency
            ? amount * store.getExchangeRate(baseCurrency, store.currency)
            : amount;

        return new Intl.NumberFormat(store.locale, {
          style: 'currency',
          currency: store.currency,
        }).format(convertedAmount / 100); // Assuming amount is stored in cents
      },

    isRatesExpired: (state) => (): boolean => {
      const EXPIRY_TIME = 3600000; // 1 hour in ms
      return !state.lastUpdated || Date.now() - state.lastUpdated > EXPIRY_TIME;
    },
  },
});
