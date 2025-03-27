<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { urlFriendly } from '~/lib/utils';

const props = defineProps<{
  homePageId: string;
}>();

const { data: homePage } = await useFetch(`/api/homepage/${props.homePageId}`);

</script>

<template>
  <div class="w-full flex flex-col align-middle items-center" v-for="section in homePage?.homePageSections ?? []"
    :key="section.id">
    <!-- <template v-if="section.filterId"> -->
    <h2 class="text-5xl font-bold text-center p-10">
      {{ section.name }}
    </h2>
    <div class="w-full flex flex-wrap justify-center items-center" v-if="section.filterId">
      <ProductsFromFilter :filter-id="section.filterId"
        :initalPagination="section.variant === 'grid' ? { limit: 6, page: 1 } : undefined"
        :variant="section.variant === 'carousel' ? 'carousel' : 'grid'""/> 
      </div>
      <a v-if="section.filterId"
        :href="`/men/ctfr/${urlFriendly(section.filter!.name)}/cat?filterId=${section.filterId}`"
        class="text-lg font-bold ">
        <Button variant="link">View all {{ section.name }}</Button>
        </a>
    </div>

</template>