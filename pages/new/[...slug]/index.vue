<script lang="ts" setup>
const route = useRoute();
let slugs = route.params.slug as string[];


// let parsed = slug.reduce((acc, cur, i) => {
//   const isKey = i % 2 === 0;
//   if (!acc[cur] && isKey) {
//     acc[cur] = [];
//   } else if (acc[slug[i - 1]]) {
//     acc[slug[i - 1]].push(cur);
//   }
//   return acc
// }, {} as Record<string, string[]>
// )
const parsed = computed(() => {
  const parsed: Record<string, string[]> = {};
  // for (let i = 0; i < slug.length; i += 2) {
  //   const key = slug[i];
  //   const value = slug[i + 1]?.split(',');
  //   if (!key || !value) {
  //     continue;
  //   }
  //   if (!parsed[key]) {
  //     parsed[key] = [];
  //   }
  //   parsed[key].push(...value);
  // }
  // for (let i = 0; i < slug.length; i++) {
  // }
  // if starts with key: it is a key
  for (const slug of slugs) {
    if (slug.startsWith('key:')) {
      const key = slug.replace(/^key:/, '');
      parsed[key] = [];
      continue;
    }

    if (slug.startsWith('value:')) {
      const value = slug.replace(/^value:/, '');
      const lastKey = Object.keys(parsed).pop();
      if (lastKey) {
        parsed[lastKey].push(value);
      }
    }

  }
  return parsed;
})
const { data: filter } = await useFetch('/api/filter/readable', {
  query: {
    filters: parsed.value,
  },
});
</script>

<template>
  <Clothes :default-filters="filter ?? undefined" />
</template>