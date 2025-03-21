let alternativeCategories = ['men', 'women', 'kids', 'kids'];

export const useCategory = () => {
  const route = useRoute();
  const category = computed(() => {
    const path = route.path.split('/');
    if (alternativeCategories.includes(path[1])) {
      return path[1];
    }
    return route.params.categoryId;
  });
  const url = computed(() => {
    return `/key:main/value:${category.value}`;
  });
  return {
    category,
    categoryUrl: url,
  };
};
