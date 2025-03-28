<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';
import { ref } from 'vue';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';

const route = useRoute();
const router = useRouter();
const currentPage = computed(() => router.currentRoute.value.path);
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
</script>
<template>
  <header class="flex items-center justify-between p-0 bg-zinc-800 text-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex-row flex gap-4 ">
      <div class="block lg:hidden">
        <Sheet>
          <SheetTrigger as-child>
            <Button class="p-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
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
            <div class="flex flex-wrap gap-x-2">
              <div v-for="{ label, route } in mainCategory" :key="label"
                class="text-2xl  uppercase rounded-none h-full">
                <Button>
                  <NuxtLink :to="route">
                    {{ label }}
                  </NuxtLink>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div class="flex items-center gap-4 border-r-0 lg:border-r border-zinc-600 pr-4 w-40">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="https://www.radix-vue.com/logo.svg" alt="Radix UI" class="h-8 w-8" />
          <span class="text-xl font-bold w-52 hidden md:block">Nettbutikk</span>
        </NuxtLink>
      </div>
      <div class="flex items-center gap-4 justify-between w-full">
        <NavigationMenu class="hidden lg:flex">
          <NavigationMenuList class="flex gap-0">
            <NavigationMenuItem v-for="{ label, route, isActive } in mainCategory" :key="label"
              class="p-4 text-2xl hover:bg-primary uppercase rounded-none h-full" :class="{
                'bg-primary text-white': currentPage === route || isActive,
              }">
              <NavigationMenuLink v-if="route" :href="route" as-child>
                <NuxtLink :to="route">
                  {{ label }}
                </NuxtLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <!-- <AppHeaderSearch /> -->
        <!-- <div class="hidden lg:flex items-center gap-4">
          <CurrencySelector />
        </div> -->
        <div class="hidden lg:flex items-center gap-4">
          <AppHeaderCart />
          <AppHeaderUser />
        </div>
      </div>

    </div>

  </header>
  <!-- </div> -->
</template>
