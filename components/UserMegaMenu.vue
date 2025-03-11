<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const subCategory = ref<SubCategory[]>([
  {
    label: 'New',
    root: true,
    items: [
      [
        {
          label: 'New Arrivals',
          items: [
            { label: 'View all' },
            { label: 'Clothing' },
            { label: 'Shoes' },
            { label: 'Accessories' },
          ],
        },
      ],
      [
        {
          label: 'Jeans',
          variant: 'grid',
          items: [
            {
              label: 'View all',
              type: 'rounded',
              image: '/images/jeans_viewall.jpg',
              route: '/jeans',
              first: true,
            },
            {
              label: 'Skinny',
              type: 'rounded',
              image: '/images/jeans_skinny.avif',
              route: '/jeans/skinny',
            },
            {
              label: 'Slim',
              type: 'rounded',
              image: '/images/jeans_slim.avif',
              route: '/jeans/slim',
            },
            {
              label: 'Regular',
              type: 'rounded',
              image: '/images/jeans_regular.avif',
              route: '/jeans/regular',
            },
            {
              label: 'Tapered',
              type: 'rounded',
              image: '/images/jeans_tapered.avif',
              route: '/jeans/tapered',
            },
            {
              label: 'Straight',
              type: 'rounded',
              image: '/images/jeans_straight.avif',
              route: '/jeans/straight',
            },
          ],
        },
      ],

    ],
  },
  {
    label: 'clothing',
    root: true,
    items: [
      [
        {
          items: [
            {
              label: 'T-shirts',
              route: '/clothing/t-shirts',
            },
            {
              label: 'Hoodies',
              route: '/clothing/hoodies',
            },
            {
              label: 'Sweatshirts',
              route: '/clothing/sweatshirts',
            },
            {
              label: 'Jackets',
            },
            {
              label: 'Shirts',
            },
            {
              label: 'Pants',
            },
            {
              label: 'Shorts',
            },
            {
              label: 'Suits',
            },
            {
              label: 'Blazers',
            },
            {
              label: 'Sweaters',
            },
            {
              label: 'Vests',
            },
            {
              label: 'Jeans',
            },
          ],
        },
      ],
      [
        {
          items: [
            {
              label: 'Underwear',
            },
            {
              label: 'Loungewear',
            },
            {
              label: 'Socks',
            },
            {
              label: 'Big & Tall',
            },
            {
              label: 'Accessories',
            },
          ],
        },
      ],
    ],
  },
]);

export interface SubCategory {
  label: string;
  root: boolean;
  items: Array<SubCategoryItem[]>;
}

export interface SubCategoryItem {
  label?: string;
  items: ItemItem[];
  variant?: 'grid';
}

export interface ItemItem {
  label: string;
  type?: string;
  image?: string;
  route?: string;
  first?: boolean;
}


</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 hidden sm:flex">

    <NavigationMenu>
      <NavigationMenuList class="gap-x-0">
        <NavigationMenuItem v-for="item in subCategory" :key="item.label">
          <NavigationMenuTrigger without-chevron>
            {{ item.label }}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-3 p-6 md:w-[800px] lg:w-[1000px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
              <!-- <li class="row-span-3">
              <NavigationMenuLink as-child>
                <a
                  class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href="/"
                >
                  <img src="https://www.reka-ui.com/logo.svg" class="h-6 w-6" />
                  <div class="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
                  <p class="text-sm leading-tight text-muted-foreground">
                  </p>
                </a>
              </NavigationMenuLink>
            </li> -->
              <li v-for="subItem in item.items" :key="JSON.stringify(subItem)">
                <ul>
                  <li v-for="subSubItem in subItem" :key="subSubItem.label">
                  <li class="font-bold">{{ subSubItem.label }}</li>
                  <li v-if="subSubItem.variant === 'grid'" class="grid grid-cols-2 gap-3">
                  <li v-for="subSubSubItem in subSubItem.items" :key="subSubSubItem.label">
                    <a :href="subSubSubItem.route"
                      class="flex flex-row items-center gap-2 p-4 hover:bg-none hover:shadow-lg rounded-md relative">
                      <div
                        class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 hover:border transition-all duration-200">
                        <img :src="subSubSubItem.image" class="w-16 hover:absolute hover:w-24 hover:-left-2" />
                      </div>
                      <span class="self-center">{{ subSubSubItem.label }}</span>
                    </a>
                  </li>
              </li>
              <li v-else v-for="subSubSubItem in subSubItem.items" :key="subSubSubItem.label">
              <li v-if="subSubSubItem.type === 'rounded'">
                <a :href="subSubSubItem.route" class="flex flex-row items-center gap-2 hover:bg-none">
                  <div class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img :src="subSubSubItem.image" class="w-full hover:absolute" />
                  </div>
                  <span class="self-center">{{ subSubSubItem.label }}</span>
                </a>
              <li>{{ subSubSubItem.label }}</li>
              </li>
              <li v-else>
                <a :href="subSubSubItem.route" class="flex flex-row items-center gap-2 hover:bg-none">
                  <span class="self-center">{{ subSubSubItem.label }}</span>
                </a>
              </li>
              </li>
              </li>
            </ul>
            </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>

</template>
