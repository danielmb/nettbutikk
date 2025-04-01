<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';
import { ref } from 'vue';

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const route = useRoute();
const router = useRouter();
const { data: mainCategories } = await useFetch('/api/filter/main');
// const mainCategory = ref([
//   {
//     label: 'Men',
//     route: '/men',
//     // icon: 'pi pi-fw pi-user',
//   },
//   {
//     label: 'Women',
//     route: '/women',
//     // icon: 'pi pi-fw pi-user',
//   },
//   {
//     label: 'Kids',
//     route: '/kids',
//     // icon: 'pi pi-fw pi-user',
//   },
// ]);
const categoryId = route.params.categoryId;
const mainCategory = computed(() => {
  return mainCategories.value?.values.map((category) => ({
    label: category.displayName,
    route: `/${category.slug ?? category.id}`,
    isActive: category.id === Number(categoryId) || category.slug === categoryId,
  }));
});
const { categoryUrl, category } = useCategory();


// @ts-ignore 
const { data: megaMenu } = useQuery({ queryKey: ['megamenu', category.value], queryFn: () => $fetch(`/api/megamenu/${category.value}`) });


const items = computed(() => {
  if (!megaMenu.value) return [];

  return megaMenu.value.categories.map(category => {
    return {
      id: category.id,
      label: category.label,
      root: category.root,
      items: category.columns.map(column => {
        return column.sections.map(section => {
          return {
            label: section.label,
            variant: section.variant || undefined,
            items: section.items.map(item => {
              return {
                label: item.label,
                type: item.type || undefined,
                image: item.image || undefined,
                route: item.route || undefined,
                first: item.first || false
              };
            })
          };
        });
      })
    };
  });
});

</script>
<template>
  <Sheet default-open>
    <SheetTrigger as-child>
      <Button class="p-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <!-- For screen readers -->
      <SheetHeader class="hidden">
        <SheetTitle>
          Menu
        </SheetTitle>
        <SheetDescription>
          Main menu
        </SheetDescription>
      </SheetHeader>
      <div v-for="(item, index) in items" class="w-full" :key="item.id">
        <Sheet>
          <SheetTrigger as-child>
            <Button :class="cn('w-full justify-between p-6 border-t-2',
              index === 0 ? 'border-t-0' : 'border-t-2',
            )" variant="ghost">
              <div>
                {{ item.label }}
              </div>
              <div class="pi pi-fw pi-chevron-right text-2xl" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader class="hidden">
              <SheetTitle>
                {{ item.label }}
              </SheetTitle>
              <SheetDescription>
                {{ item.label }}
              </SheetDescription>
            </SheetHeader>
            <SheetClose>
              <Button class="pi pi-fw pi-arrow-left" variant="ghost" />
            </SheetClose>
            <ul class="flex flex-col gap-3 p-6 md:w-[800px] lg:w-[1000px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
              <li v-for="subItem in item.items" :key="JSON.stringify(subItem)">
                <ul>
                  <li v-for="subSubItem in subItem" :key="subSubItem.label">
                    <strong class="block">{{ subSubItem.label }}</strong>
                    <ul v-for="subSubSubItem in subSubItem.items" :key="subSubSubItem.label">
                      <NuxtLink :to="subSubSubItem.route" class="w-full p-6">
                        <span class="self-center">{{ subSubSubItem.label }}</span>
                      </NuxtLink>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </SheetContent>
  </Sheet>

  <!-- </div> -->
</template>
