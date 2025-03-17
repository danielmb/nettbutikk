import type { InternalApi, SerializeObject } from 'nitropack/types';
export const useProducts = () => {
  const route = useRoute();
  const router = useRouter();

  const products = ref<
    SerializeObject<InternalApi['/api/items']['default']>['products']
  >([]);
  const filters = ref<InternalApi['/api/items/filters']['get']>([]);
  const activeFilters = ref<Record<string, number[]>>({});
  const loading = ref(false);
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const loadFilters = async () => {
    const data = await $fetch('/api/items/filters');
    filters.value = data;
  };

  async function loadProducts() {
    loading.value = true;

    const { data } = await useFetch('/api/items', {
      params: {
        filters: JSON.stringify(activeFilters.value),
        page: pagination.value.page,
        limit: pagination.value.limit,
      },
    });

    products.value = data.value?.products || products.value;
    pagination.value = data.value?.pagination || pagination.value;
    loading.value = false;

    return products.value;
  }

  function toggleFilter(typeSlug: string, valueId: number) {
    if (!activeFilters.value[typeSlug]) {
      activeFilters.value[typeSlug] = [];
    }

    const index = activeFilters.value[typeSlug].indexOf(valueId);
    if (index > -1) {
      activeFilters.value[typeSlug].splice(index, 1);
      // Remove empty arrays
      if (activeFilters.value[typeSlug].length === 0) {
        delete activeFilters.value[typeSlug];
      }
    } else {
      activeFilters.value[typeSlug].push(valueId);
    }

    // Reset pagination when filter changes
    pagination.value.page = 1;

    // Update URL to reflect filters
    updateRouteWithFilters();

    // Reload products
    loadProducts();
  }

  function updateRouteWithFilters() {
    router.push({
      query: {
        ...route.query,
        filters: JSON.stringify(activeFilters.value),
        page: pagination.value.page,
      },
    });
  }

  function initFromRoute() {
    if (route.query.filters) {
      try {
        activeFilters.value = JSON.parse(String(route.query.filters));
      } catch (e) {
        activeFilters.value = {};
      }
    }

    if (route.query.page) {
      pagination.value.page = Number(route.query.page);
    }
  }
  watch(
    () => route.query,
    () => {
      initFromRoute();
      loadProducts();
    },
    { deep: true },
  );

  onMounted(async () => {
    await loadFilters();
    await initFromRoute();
    await loadProducts();
  });
  // watch prodocts
  // watch(
  //   products,
  //   () => {
  //     console.log(products.value);
  //   },
  //   { deep: true },
  // );
  return {
    products,
    filters,
    activeFilters,
    loading,
    pagination,
    toggleFilter,
    loadProducts,
  };
};
