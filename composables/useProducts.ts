import type { InternalApi, SerializeObject } from 'nitropack/types';
import { useQuery, keepPreviousData } from '@tanstack/vue-query';

export interface UseProductsOptions {
  staticFilters?: Record<string, number[]>;
  noUrl?: boolean;
  filterId?: number;
  initialPagination?: {
    page: number;
    limit: number;
    total?: number;
    pages?: number;
  };
}

export const useProducts = (
  options: UseProductsOptions = {
    staticFilters: {},
    noUrl: false,
    filterId: undefined,
    initialPagination: { page: 1, limit: 20, total: 0, pages: 0 },
  },
) => {
  const route = useRoute();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Reactive state for filters and pagination
  const activeFilters = ref<Record<string, number[]>>({
    ...options.staticFilters,
  });

  const pagination = ref(
    options.initialPagination ?? { page: 1, limit: 20, total: 0, pages: 0 },
  );

  const search = ref('');

  // Function to fetch filters
  const fetchFilters = async () => {
    const filterId = options.filterId;
    return await $fetch('/api/items/filters', {
      params: { filterId },
    });
  };

  // Function to fetch products
  const fetchProducts = async () => {
    const filterId = options.filterId;
    const response = await $fetch('/api/items', {
      params: {
        defaultFilterId: filterId,
        filters: JSON.stringify(activeFilters.value),
        page: pagination.value.page,
        limit: pagination.value.limit,
        search: search.value,
      },
    });

    // Update pagination based on response
    if (response.pagination) {
      pagination.value = {
        ...pagination.value,
        ...response.pagination,
      };
    }

    return response;
  };

  // Filters query
  const filtersQuery = useQuery({
    queryKey: ['filters', options.filterId],
    queryFn: fetchFilters,
  });

  // Products query
  const productsQuery = useQuery({
    queryKey: [
      'products',
      options.filterId,
      activeFilters.value,
      pagination.value.page,
      search.value,
    ],
    queryFn: fetchProducts,
    placeholderData: keepPreviousData,
  });

  // Computed properties for easier access
  const filters = computed(() => {
    const staticFilters = options.staticFilters || {};
    return (
      filtersQuery.data.value?.filter(
        (filter) => !staticFilters[filter.slug],
      ) || []
    );
  });

  const products = computed(() => productsQuery.data.value?.products || []);

  // Filter toggle/management methods
  const toggleFilter = (typeSlug: string, valueId: number) => {
    if (!activeFilters.value[typeSlug]) {
      activeFilters.value[typeSlug] = [];
    }

    const index = activeFilters.value[typeSlug].indexOf(valueId);
    if (index > -1) {
      activeFilters.value[typeSlug].splice(index, 1);

      // Remove empty filter arrays
      if (activeFilters.value[typeSlug].length === 0) {
        delete activeFilters.value[typeSlug];
      }
    } else {
      activeFilters.value[typeSlug].push(valueId);
    }

    // Reset pagination and update route
    pagination.value.page = 1;
    updateRouteWithFilters();

    // Invalidate and refetch products query
    queryClient.invalidateQueries({
      queryKey: ['products', options.filterId],
    });
  };

  const setFilter = (typeSlug: string, valueIds: number[]) => {
    activeFilters.value = {
      ...activeFilters.value,
      [typeSlug]: valueIds,
    };
    updateRouteWithFilters();

    // Invalidate and refetch products query
    queryClient.invalidateQueries({
      queryKey: ['products', options.filterId],
    });
  };

  const removeFilter = (typeSlug: string) => {
    const { [typeSlug]: _, ...rest } = activeFilters.value;
    activeFilters.value = rest;
    updateRouteWithFilters();

    // Invalidate and refetch products query
    queryClient.invalidateQueries({
      queryKey: ['products', options.filterId],
    });
  };

  const updateRouteWithFilters = () => {
    if (options.noUrl) return;

    router.push({
      query: {
        ...route.query,
        filters: JSON.stringify(activeFilters.value),
        page: pagination.value.page,
      },
    });
  };

  const setSearch = (value: string) => {
    search.value = value;

    // Invalidate and refetch products query when search changes
    queryClient.invalidateQueries({
      queryKey: ['products', options.filterId],
    });
  };

  // Initialize from route on mount
  const initFromRoute = () => {
    if (options.noUrl) return;

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
  };

  // Watch route changes
  watch(
    () => route.query,
    () => {
      initFromRoute();
    },
    { deep: true },
  );

  // Initialize on mount
  onMounted(() => {
    initFromRoute();
  });

  return {
    // Queries
    filtersQuery,
    productsQuery,

    // Data
    products,
    filters,
    activeFilters,
    pagination,
    search,

    // Computed
    loading: false,

    // Methods
    toggleFilter,
    setFilter,
    removeFilter,
    setSearch,
  };
};
