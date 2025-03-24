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


const { data: clothingOptions } = await useFetch('/api/filter/category');
const { data: filters } = await useFetch('/api/filters');


const { categoryUrl, category } = useCategory();
const clothing = computed(() => {
  return filters.value?.filter((filter) => filter.values.find((value) => value.attributeType.slug === 'main' && value.value.toLowerCase() === String(category.value).toLowerCase()))
    .map((filter) => {
      return {
        label: filter.name,
        route: `${categoryUrl.value}/${filter.name.toLowerCase().replace(/[^a-z0-9]/gi, '-')}/cat?filterId=${filter.id}`,
      };
    });
});

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
    label: 'Clothing',
    root: true,
    items: [
      [
        {
          // items: [

          // ],
          // items: clothingOptions.value?.values.map((item) => {
          //   return {
          //     label: item.displayName,
          //     route: `/new${categoryUrl.value}/key:category/value:${item.id}`,
          //   };
          // }) ?? [],
          items: clothing.value ?? [],
        },
      ],
      // [
      //   {
      //     items: [
      //       {
      //         label: 'Underwear',
      //       },
      //       {
      //         label: 'Loungewear',
      //       },
      //       {
      //         label: 'Socks',
      //       },
      //       {
      //         label: 'Big & Tall',
      //       },
      //       {
      //         label: 'Accessories',
      //       },
      //     ],
      //   },
      // ],
    ],
  },

  {
    root: true,
    label: 'Admin',
    items: [
      [
        {
          label: 'Filters',
          items: [
            { label: 'View all', route: '/filter' },
          ],
        },
      ],
    ],
  }
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
  <div class="w-full">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 hidden sm:flex">
      <NavigationMenu>
        <NavigationMenuList class="gap-x-0">
          <NavigationMenuItem v-for="item in subCategory" :key="item.label">
            <NavigationMenuTrigger without-chevron
              class="[&[data-state='open']]:bg-gray-500 [&[data-state='open']]:dark:bg-gray-800 rounded-none">
              {{ item.label }}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="grid gap-3 p-6 md:w-[800px] lg:w-[1000px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
                <li v-for="subItem in item.items" :key="JSON.stringify(subItem)">
                  <ul>
                    <li v-for="subSubItem in subItem" :key="subSubItem.label">
                      <strong class="block">{{ subSubItem.label }}</strong>
                      <ul v-if="subSubItem.variant === 'grid'" class="grid grid-cols-2 gap-3">
                        <li v-for="subSubSubItem in subSubItem.items" :key="subSubSubItem.label">
                          <a :href="subSubSubItem.route"
                            class="flex flex-row items-center gap-2 p-4 hover:bg-none hover:shadow-lg rounded-md relative">
                            <div
                              class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 hover:border transition-all duration-200">
                              <img :src="subSubSubItem.image" class="w-16 hover:absolute hover:w-24 hover:-left-2"
                                alt="" />
                            </div>
                            <span class="self-center">{{ subSubSubItem.label }}</span>
                          </a>
                        </li>
                      </ul>
                      <ul v-else>
                        <li v-for="subSubSubItem in subSubItem.items" :key="subSubSubItem.label">
                        <li v-if="subSubSubItem.type === 'rounded'">
                          <a :href="subSubSubItem.route" class="flex flex-row items-center gap-2 hover:bg-none">
                            <div
                              class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                              <img :src="subSubSubItem.image" class="w-full hover:absolute" alt="" />
                            </div>
                            <span class="self-center">{{ subSubSubItem.label }}</span>
                          </a>
                        </li>
                        <li v-else>
                          <a :href="subSubSubItem.route" class="flex flex-row items-center gap-2 hover:bg-none">
                            <span class="self-center">{{ subSubSubItem.label }}</span>
                          </a>
                        </li>
                    </li>
                  </ul>
                </li>
              </ul>
              </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  </div>

</template>
