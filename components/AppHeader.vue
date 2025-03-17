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
const router = useRouter();
const currentPage = computed(() => router.currentRoute.value.path);
const mainCategory = ref([
  {
    label: 'Men',
    route: '/men',
    // icon: 'pi pi-fw pi-user',
  },
  {
    label: 'Women',
    route: '/women',
    // icon: 'pi pi-fw pi-user',
  },
  {
    label: 'Kids',
    route: '/kids',
    // icon: 'pi pi-fw pi-user',
  },
]);
</script>
<template>
  <header class="flex items-center justify-between p-0 bg-zinc-800 text-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex-row flex gap-4">
      <div class="block lg:hidden">
        <Sheet>
          <SheetTrigger>
            <button class="p-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
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
            <div class="grid grid-cols-3">
              <div v-for="{ label, route } in mainCategory" :key="label"
                class="p-4 text-2xl  uppercase rounded-none h-full">
                <Button>
                  <a :href="route">
                    {{ label }}
                  </a>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div class="flex items-center gap-4 border-r-0 lg:border-r border-zinc-600 pr-4 w-40">
        <a href="/" class="flex items-center gap-2">
          <img src="https://www.radix-vue.com/logo.svg" alt="Radix UI" class="h-8 w-8" />
          <span class="text-xl font-bold">Radix UI</span>
        </a>
      </div>
      <div class="flex items-center gap-4 justify-between w-full">

        <NavigationMenu class="hidden lg:flex">
          <NavigationMenuList class="flex gap-0">
            <!-- <NavigationMenuItem>
        <NavigationMenuTrigger class="bg-card text-base">
          Features
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div class="grid w-[600px] grid-cols-2 gap-5 p-4">
            <img src="https://www.radix-vue.com/logo.svg" alt="Beach" class="h-full w-full rounded-md object-cover" />
            <ul class="flex flex-col gap-2">

            </ul>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger class="bg-card text-base">
          Categories
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid grid-cols-2 gap-2 p-4">
            <li v-for="{ label, route } in mainCategory" :key="label">
              <NavigationMenuLink :href="route" class="rounded-md p-3 text-sm hover:bg-muted">
                {{ label }}
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem> -->
            <NavigationMenuItem v-for="{ label, route } in mainCategory" :key="label"
              class="p-4 text-2xl hover:bg-primary uppercase rounded-none h-full" :class="{
                'bg-primary text-white': currentPage === route,
              }">
              <NavigationMenuLink v-if="route" :href="route">
                {{ label }}
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <CurrencySelector />
        <AppHeaderUser />
      </div>

    </div>

  </header>
  <!-- </div> -->
</template>
