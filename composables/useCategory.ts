let alternativeCategories = ['men', 'women', 'kids'];
export const useCategory = () => {
  const storedCategory = useCategoryStore();
  const route = useRoute();
  const router = useRouter();
  const category = computed(() => {
    const path = route.path.split('/');
    if (alternativeCategories.includes(path[1])) {
      return path[1];
    }
    return (
      route.params.categoryId ?? route.query.category ?? storedCategory.category
    );
  });
  const url = computed(() => {
    // cftr stands for constant for the route :)
    return `/${category.value}/cftr`;
  });

  return {
    category,
    categoryUrl: url,
  };
};
