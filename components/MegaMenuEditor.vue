<script setup lang="ts">
import { ref, computed } from 'vue';
import { useForm, useFieldArray } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, MoveVertical, Copy } from 'lucide-vue-next';
import { useToast } from '@/components/ui/toast/use-toast';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { megaMenuSchema } from "@/schemas/megamenu_[id]";
import { useQueryClient } from '@tanstack/vue-query';
const queryClient = useQueryClient();
// Define the schema for form validation
const formSchema = toTypedSchema(
  megaMenuSchema
);

// Load initial data
const loading = ref(true);
const { data: filters } = await useFetch('/api/filters');
const { data: attributeValues } = await useFetch('/api/attribute-values', {
  query: { attributeType: 'category' }
});

// State for active tabs
const activeTab = ref('general');
const activeCategoryId = ref(0);

// Get existing menu data if editing
// const { id } = useRoute().params;
const props = defineProps<{ id?: string }>();
const id = props.id ? parseInt(props.id) : null;
// const initialValues = ref({
//   name: '',
//   description: '',
//   isActive: true,
//   categories: [],
// });
const initialValues = ref<Record<string, any>>({
  name: '',
  description: '',
  isActive: true,
  categories: [],
});

// Check if we're editing an existing menu
if (id) {
  const { data, error } = await useFetch(`/api/megamenu/${id}`);

  if (data.value) {
    initialValues.value = data.value;
    activeCategoryId.value = data.value.categories?.[0]?.id || 0;
  }
}

loading.value = false;

// Set up form with vee-validate
const { handleSubmit, values, errors, meta,
  isFieldDirty,
  isSubmitting
} = useForm({
  validationSchema: formSchema,
  initialValues: initialValues.value,
  keepValuesOnUnmount: true,

});


// Set up field arrays for nested structures
const { remove: removeCategory, push: addCategory, fields: categories, update, move } = useFieldArray('categories');

const { toast } = useToast();

// Form submission handler
const onSubmit = handleSubmit(async (formData) => {
  try {

    const endpoint = id ? `/api/megamenu/${id}` : '/api/megamenu';
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to save navigation menu');
    }

    toast({
      title: 'Success',
      description: `Navigation menu ${id ? 'updated' : 'created'} successfully`,
    });
    await queryClient.invalidateQueries({
      predicate: query => query.queryKey[0] === 'megamenu',
    })
    if (!id) {
      // Redirect to edit page if creating new menu
      const result = await response.json();
      navigateTo(`/admin/navigation-menu/${result.id}`);
    }
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message || 'Something went wrong',
      variant: 'destructive',
    });
  }
});

// Helper functions for nested items
const addColumn = (categoryIndex: number) => {
  console.log('addColumn', categoryIndex);
  if (!values.categories) {
    return;
  }
  // console.log('values.categories', values.categories);
  // const category = values.categories[categoryIndex];
  // if (!category.columns) {
  //   category.columns = [];
  // }

  // category.columns.push({
  //   sortOrder: category.columns.length,
  //   sections: []
  // });

  // console.log('category', category.columns);
  // update(categoryIndex, category);

  const categoryCopy = JSON.parse(JSON.stringify(values.categories[categoryIndex]));
  categoryCopy.columns.push({
    sortOrder: categoryCopy.columns.length,
    sections: []
  });
  update(categoryIndex, categoryCopy);
};

const removeColumn = (categoryIndex: number, columnIndex: number) => {
  console.log('removeColumn', categoryIndex, columnIndex);
  if (!values.categories) {
    return;
  }
  // values.categories[categoryIndex].columns.splice(columnIndex, 1);
  const categoryCopy = JSON.parse(JSON.stringify(values.categories[categoryIndex]));
  categoryCopy.columns.splice(columnIndex, 1);
  update(categoryIndex, categoryCopy);
};

const addSection = (categoryIndex: number, columnIndex: number) => {
  // console.log('addSection', categoryIndex, columnIndex);
  // if (!values.categories) {
  //   return;
  // }
  // const column = values.categories[categoryIndex].columns[columnIndex];

  // column.sections.push({
  //   label: `New Section`,
  //   sortOrder: column.sections.length,
  //   items: []
  // });
  if (!values.categories) {
    return;
  }
  const categoryCopy = JSON.parse(JSON.stringify(values.categories[categoryIndex])) as typeof values.categories[0];
  categoryCopy.columns[columnIndex].sections.push({
    label: `New Section`,
    sortOrder: categoryCopy.columns[columnIndex].sections.length,
    items: []
  });
  update(categoryIndex, categoryCopy);
};

// const removeSection = (categoryIndex, columnIndex, sectionIndex) => {
const removeSection = (categoryIndex: number, columnIndex: number, sectionIndex: number) => {
  console.log('removeSection', categoryIndex, columnIndex, sectionIndex);
  if (!values.categories) {
    return;
  }
  const categoryCopy = JSON.parse(JSON.stringify(values.categories[categoryIndex])) as typeof values.categories[0];
  categoryCopy.columns[columnIndex].sections.splice(sectionIndex, 1);
  update(categoryIndex, categoryCopy);
};

// const addItem = (categoryIndex, columnIndex, sectionIndex) => {
const addItem = (categoryIndex: number, columnIndex: number, sectionIndex: number) => {
  console.log('addItem', categoryIndex, columnIndex, sectionIndex);
  if (!values.categories) {
    return;
  }
  // const section = values.categories[categoryIndex].columns[columnIndex].sections[sectionIndex];
  const categoryCopy = JSON.parse(JSON.stringify(values.categories[categoryIndex])) as typeof values.categories[0];
  const section = categoryCopy.columns[columnIndex].sections[sectionIndex];
  section.items.push({
    label: `New Item`,
    route: '#',
    sortOrder: section.items.length,
    first: false
  });
  update(categoryIndex, categoryCopy);
};

// const removeItem = (categoryIndex, columnIndex, sectionIndex, itemIndex) => {
const removeItem = (categoryIndex: number, columnIndex: number, sectionIndex: number, itemIndex: number) => {
  console.log('removeItem', categoryIndex, columnIndex, sectionIndex, itemIndex);
  if (!values.categories) {
    return;
  }
  // values.categories[categoryIndex].columns[columnIndex].sections[sectionIndex].items.splice(itemIndex, 1);
  const categoryCopy = JSON.parse(JSON.stringify(values.categories[categoryIndex])) as typeof values.categories[0];
  categoryCopy.columns[columnIndex].sections[sectionIndex].items.splice(itemIndex, 1);
  update(categoryIndex, categoryCopy);
};

// Clone functions for nested items
// const cloneCategory = (index) => {
const cloneCategory = (index: number) => {
  console.log('cloneCategory', index);
  if (!values.categories) {
    return;
  }
  const clonedCategory = JSON.parse(JSON.stringify(values.categories[index]));
  // Clear IDs to create new records
  clearIds(clonedCategory);
  clonedCategory.label += ' (Copy)';
  addCategory(clonedCategory);
};

// const clearIds = (obj) => {
const clearIds = (obj: Record<string, any>) => {
  console.log('clearIds', obj);
  if (typeof obj !== 'object' || obj === null) return;

  if ('id' in obj) {
    delete obj.id;
  }

  Object.values(obj).forEach(val => {
    if (Array.isArray(val)) {
      val.forEach(item => clearIds(item));
    } else if (typeof val === 'object' && val !== null) {
      clearIds(val);
    }
  });
};

// Helper for moving items up/down in arrays
// const moveItem = (array, from, to) => {
const moveFromArr = <T extends { sortOrder?: number }>(array: T[], from: number, to: number) => {
  if (to < 0 || to >= array.length) return;

  const item = array[from];
  array.splice(from, 1);
  array.splice(to, 0, item);

  // Update sort orders
  array.forEach((item, index) => {
    item.sortOrder = index;
  });

  return array;
};

const moveColumns = (categoryIndex: number, from: number, to: number) => {
  if (!values.categories) {
    return;
  }
  const categoryCopy = JSON.parse(JSON.stringify(values.categories[categoryIndex])) as typeof values.categories[0];
  moveFromArr(categoryCopy.columns, from, to);
  update(categoryIndex, categoryCopy);
};

const moveItem = (categoryIndex: number, columnIndex: number, sectionIndex: number, from: number, to: number) => {
  if (!values.categories) {
    return;
  }
  const categoryCopy = JSON.parse(JSON.stringify(values.categories[categoryIndex])) as typeof values.categories[0];
  moveFromArr(categoryCopy.columns[columnIndex].sections[sectionIndex].items, from, to);
  update(categoryIndex, categoryCopy);
};



const activeCategoryIdString = computed(() => activeCategoryId.value.toString());


watch(
  () => values,
  (newVal) => {
    console.log('Form values changed:', newVal);
  },
  { deep: true }
);

const previewItems = computed(() => {
  return (values.categories as z.infer<typeof megaMenuSchema>['categories'])?.map(category => {
    return {
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
})

</script>

<template>
  <div>
    <Accordion>
      <AccordionItem value="debug">
        <AccordionTrigger>
          <h3 class="text-lg font-medium">Debug</h3>
        </AccordionTrigger>
        <AccordionContent>
          <pre>{{ values }}</pre>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <Card class="mb-6">
      <CardHeader>
        <CardTitle>{{ id ? 'Edit Navigation Menu' : 'Create Navigation Menu' }}</CardTitle>
        <CardDescription>
          Configure your website's mega menu structure.
        </CardDescription>
      </CardHeader>

      <div v-if="loading" class="flex justify-center p-6">
        <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>

      <form v-else @submit.prevent="onSubmit">
        <CardContent>
          <Tabs v-model:value="activeTab" :unmount-on-hide="false" default-value="general">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="general">General Settings</TabsTrigger>
              <TabsTrigger value="categories">Menu Structure</TabsTrigger>
            </TabsList>

            <!-- General Settings Tab -->
            <KeepAlive>
              <TabsContent value="general">
                <div class="grid gap-4 py-4">
                  <!-- <div class="grid gap-2">
                  <Label for="name">Menu Name</Label>
                  <Input id="name" v-model="values.name" />
                  <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
                </div> -->
                  <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
                    <FormItem>
                      <FormLabel>Menu Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Menu Name" v-bind="componentField" />
                      </FormControl>
                      <FormDescription>
                        This is the name of the menu.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <!-- <div class="grid gap-2">
                  <Label for="description">Description</Label>
                  <Input id="description" v-model="values.description" />
                  <p v-if="errors.description" class="text-sm text-destructive">{{ errors.description }}</p>
                </div> -->
                  <FormField v-slot="{ componentField }" name="description" :validate-on-blur="!isFieldDirty">
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Description" v-bind="componentField" />
                      </FormControl>
                      <FormDescription>
                        This is the description of the menu.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <!-- <div class="flex items-center space-x-2">
                  <Switch id="isActive" v-model="values.isActive" />
                  <Label for="isActive">Active Menu</Label>
                </div> -->
                  <FormField v-slot="{ componentField, field }" name="isActive" :validate-on-blur="!isFieldDirty">
                    <FormItem class="flex flex-col space-x-2">
                      <FormLabel>Active Menu</FormLabel>
                      <FormControl>
                        <Switch v-model:model-value="field.value" @update:model-value="field['onUpdate:modelValue']" />
                      </FormControl>
                      <FormDescription>
                        This is the active status of the menu.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
              </TabsContent>
            </KeepAlive>
            <!-- Categories Tab -->
            <KeepAlive>

              <TabsContent value="categories">
                <div class="mb-4 flex justify-between items-center">
                  <h3 class="text-lg font-medium">Categories</h3>
                  <Button type="button" variant="outline" size="sm"
                    @click="addCategory({ label: 'New Category', root: false, sortOrder: categories.length, columns: [] })">
                    <PlusCircle class="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </div>

                <!-- If no categories -->
                <div v-if="!values.categories || values.categories.length === 0"
                  class="text-center p-6 bg-muted/50 rounded-md">
                  <p>No categories added yet. Click the button above to add your first category.</p>
                </div>

                <!-- Categories List -->
                <div v-else>
                  <Tabs v-model:value="activeCategoryIdString" :unmount-on-hide="false">
                    <TabsList class="w-full flex gap-1 overflow-x-auto pb-1">
                      <TabsTrigger v-for="(category, categoryIndex) in values.categories" :key="categoryIndex"
                        :value="categoryIndex.toString()" class="flex-shrink-0">
                        <!-- {{ category.label ?? `Category ${categoryIndex + 1}` }} -->
                        {{ category.label ? category.label.length > 0 ? category.label : `Category ${categoryIndex + 1}`
                          : `Category ${categoryIndex + 1}` }}
                      </TabsTrigger>
                    </TabsList>

                    <div v-for="(category, categoryIndex) in values.categories" :key="categoryIndex">
                      <TabsContent :value="categoryIndex.toString()">
                        <Card>
                          <CardHeader>
                            <div class="flex justify-between items-center">
                              <div class="flex-1">
                                <Input v-model="category.label" placeholder="Category Name" />
                                <p v-if="errors[`categories.${categoryIndex}.label`]" class="text-sm text-destructive">
                                  {{ errors[`categories.${categoryIndex}.label`] }}
                                </p>
                              </div>

                              <div class="flex space-x-2">
                                <Button type="button" variant="outline" size="icon"
                                  @click="move(categoryIndex, categoryIndex - 1)" :disabled="categoryIndex === 0">
                                  <MoveVertical class="h-4 w-4 rotate-180" />
                                </Button>

                                <Button type="button" variant="outline" size="icon"
                                  @click="move(categoryIndex, categoryIndex + 1)"
                                  :disabled="categoryIndex === values.categories.length - 1">
                                  <MoveVertical class="h-4 w-4" />
                                </Button>

                                <Button type="button" variant="outline" size="icon"
                                  @click="cloneCategory(categoryIndex)">
                                  <Copy class="h-4 w-4" />
                                </Button>

                                <Button type="button" variant="destructive" size="icon"
                                  @click="removeCategory(categoryIndex)">
                                  <Trash2 class="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <!-- <div class="flex items-center space-x-2 mt-2">
                                <Switch v-model="category.root" />
                                <Label>Root Category</Label>
                              </div> -->
                            <FormField v-slot="{ field }" :name="`categories.${categoryIndex}.root`"
                              :validate-on-blur="!isFieldDirty">
                              <FormItem class="flex flex-col space-x-2 mt-2">
                                <FormLabel>Root Category</FormLabel>
                                <FormControl>
                                  <Switch v-model:model-value="field.value"
                                    @update:model-value="field['onUpdate:modelValue']" />
                                </FormControl>
                                <FormDescription>
                                  This is the root category of the menu.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            </FormField>
                          </CardHeader>

                          <CardContent>
                            <!-- Columns -->
                            <div class="mb-4">
                              <div class="flex justify-between items-center mb-2">
                                <h4 class="font-medium">Columns</h4>
                                <Button type="button" variant="outline" size="sm" @click="addColumn(categoryIndex)">
                                  <PlusCircle class="mr-2 h-4 w-4" />
                                  Add Column
                                </Button>
                              </div>

                              <div v-if="!category.columns || category.columns.length === 0"
                                class="text-center p-4 bg-muted/50 rounded-md">
                                <p>No columns added yet.</p>
                              </div>

                              <div v-else>
                                <Accordion type="multiple" class="w-full">
                                  <AccordionItem v-for="(column, columnIndex) in category.columns" :key="columnIndex"
                                    :value="`column-${categoryIndex}-${columnIndex}`" class="border rounded-md mb-2">
                                    <AccordionTrigger class="px-4">
                                      <div class="flex justify-between items-center w-full">
                                        <span>Column {{ columnIndex + 1 }}</span>
                                        <div class="flex space-x-1" @click.stop>
                                          <Button type="button" variant="ghost" size="icon"
                                            @click="moveColumns(categoryIndex, columnIndex, columnIndex - 1)"
                                            :disabled="columnIndex === 0">
                                            <MoveVertical class="h-4 w-4 rotate-180" />
                                          </Button>

                                          <Button type="button" variant="ghost" size="icon"
                                            @click="moveColumns(categoryIndex, columnIndex, columnIndex + 1)"
                                            :disabled="columnIndex === category.columns.length - 1">
                                            <MoveVertical class="h-4 w-4" />
                                          </Button>

                                          <Button type="button" variant="destructive" size="icon"
                                            @click="removeColumn(categoryIndex, columnIndex)">
                                            <Trash2 class="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </AccordionTrigger>

                                    <AccordionContent class="px-4 pt-2 pb-4">
                                      <!-- Sections -->
                                      <div class="mb-4">
                                        <div class="flex justify-between items-center mb-2">
                                          <h5 class="font-medium">Sections</h5>
                                          <Button type="button" variant="outline" size="sm"
                                            @click="addSection(categoryIndex, columnIndex)">
                                            <PlusCircle class="mr-2 h-4 w-4" />
                                            Add Section
                                          </Button>
                                        </div>

                                        <div v-if="!column.sections || column.sections.length === 0"
                                          class="text-center p-4 bg-muted/50 rounded-md">
                                          <p>No sections added yet.</p>
                                        </div>

                                        <div v-else>
                                          <Accordion type="multiple" class="w-full">
                                            <AccordionItem v-for="(section, sectionIndex) in column.sections"
                                              :key="sectionIndex"
                                              :value="`section-${categoryIndex}-${columnIndex}-${sectionIndex}`"
                                              class="border rounded-md mb-2">
                                              <AccordionTrigger class="px-4">
                                                Section {{ sectionIndex + 1 }}
                                              </AccordionTrigger>

                                              <AccordionContent class="px-4 pt-2 pb-4">
                                                <div class="grid gap-4">
                                                  <!-- <div>
                                                      <Label>Section Label</Label>
                                                      <Input v-model="section.label" />
                                                    </div> -->
                                                  <FormField v-slot="{ componentField }"
                                                    :name="`categories.${categoryIndex}.columns.${columnIndex}.sections.${sectionIndex}.label`"
                                                    :validate-on-blur="!isFieldDirty">
                                                    <FormItem>
                                                      <FormLabel>Section Label</FormLabel>
                                                      <FormControl>
                                                        <Input type="text" placeholder="Section Label"
                                                          v-bind="componentField" />
                                                      </FormControl>
                                                      <FormDescription>
                                                        This is the label for the section.
                                                      </FormDescription>
                                                      <FormMessage />
                                                    </FormItem>
                                                  </FormField>
                                                  <FormField v-slot="{ componentField }"
                                                    :name="`categories.${categoryIndex}.columns.${columnIndex}.sections.${sectionIndex}.variant`"
                                                    :validate-on-blur="!isFieldDirty">
                                                    <FormItem>
                                                      <FormLabel>Display Variant</FormLabel>
                                                      <FormControl>
                                                        <!-- <Select v-model="section.variant">
                                                            <SelectTrigger class="w-full">
                                                              <SelectValue placeholder="Select variant" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                              <SelectItem :value="undefined as any">Default</SelectItem>
                                                              <SelectItem value="grid">Grid</SelectItem>
                                                            </SelectContent>
                                                          </Select> -->

                                                        <Select v-bind="componentField">
                                                          <SelectTrigger class="w-full">
                                                            <SelectValue placeholder="Select variant" />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            <SelectItem :value="null">Default</SelectItem>
                                                            <SelectItem value="grid">Grid</SelectItem>
                                                          </SelectContent>
                                                        </Select>
                                                      </FormControl>
                                                      <FormDescription>
                                                        This is the display variant for the section.
                                                      </FormDescription>
                                                      <FormMessage />
                                                    </FormItem>
                                                  </FormField>

                                                  <!-- Items -->
                                                  <div>
                                                    <div class="flex justify-between items-center mb-2">
                                                      <h6 class="font-medium">Items</h6>
                                                      <Button type="button" variant="outline" size="sm"
                                                        @click="addItem(categoryIndex, columnIndex, sectionIndex)">
                                                        <PlusCircle class="mr-2 h-4 w-4" />
                                                        Add Item
                                                      </Button>
                                                    </div>

                                                    <div v-if="!section.items || section.items.length === 0"
                                                      class="text-center p-4 bg-muted/50 rounded-md">
                                                      <p>No items added yet.</p>
                                                    </div>

                                                    <div v-else>
                                                      <Card v-for="(item, itemIndex) in section.items" :key="itemIndex"
                                                        class="mb-2">
                                                        <CardHeader class="p-4">
                                                          <div class="flex justify-between items-center w-full">
                                                            <span>{{ item.label || `Item ${itemIndex + 1}` }}</span>
                                                            <div class="flex space-x-1">
                                                              <Button type="button" variant="ghost" size="icon"
                                                                @click="moveItem(categoryIndex, columnIndex, sectionIndex, itemIndex, itemIndex - 1)"
                                                                :disabled="itemIndex === 0">
                                                                <MoveVertical class="h-4 w-4 rotate-180" />
                                                              </Button>

                                                              <Button type="button" variant="ghost" size="icon"
                                                                @click="moveItem(categoryIndex, columnIndex, sectionIndex, itemIndex, itemIndex + 1)"
                                                                :disabled="itemIndex === section.items.length - 1">
                                                                <MoveVertical class="h-4 w-4" />
                                                              </Button>

                                                              <Button type="button" variant="destructive" size="icon"
                                                                @click="removeItem(categoryIndex, columnIndex, sectionIndex, itemIndex)">
                                                                <Trash2 class="h-4 w-4" />
                                                              </Button>
                                                            </div>
                                                          </div>
                                                        </CardHeader>

                                                        <CardContent class="p-4 pt-0">
                                                          <div class="grid gap-4">
                                                            <!-- <div>
                                                                <Label>Item Label</Label>
                                                                <Input v-model="item.label" />
                                                              </div> -->
                                                            <FormField v-slot="{ componentField }"
                                                              :name="`categories.${categoryIndex}.columns.${columnIndex}.sections.${sectionIndex}.items.${itemIndex}.label`"
                                                              :validate-on-blur="!isFieldDirty">
                                                              <FormItem>
                                                                <FormLabel>Item Label</FormLabel>
                                                                <FormControl>
                                                                  <Input type="text" placeholder="Item Label"
                                                                    v-bind="componentField" />
                                                                </FormControl>
                                                                <FormDescription>
                                                                  This is the label for the item.
                                                                </FormDescription>
                                                                <FormMessage />
                                                              </FormItem>
                                                            </FormField>

                                                            <FormField v-slot="{ componentField }"
                                                              :name="`categories.${categoryIndex}.columns.${columnIndex}.sections.${sectionIndex}.items.${itemIndex}.route`"
                                                              :validate-on-blur="!isFieldDirty">
                                                              <FormItem>
                                                                <FormLabel>Route / URL</FormLabel>
                                                                <FormControl>
                                                                  <Input type="text" placeholder="Route / URL"
                                                                    v-bind="componentField" />
                                                                </FormControl>
                                                                <FormDescription>
                                                                  This is the route or URL for the item.
                                                                </FormDescription>
                                                                <FormMessage />
                                                              </FormItem>
                                                            </FormField>

                                                            <FormField v-slot="{ componentField }"
                                                              :name="`categories.${categoryIndex}.columns.${columnIndex}.sections.${sectionIndex}.items.${itemIndex}.type`"
                                                              :validate-on-blur="!isFieldDirty">
                                                              <FormItem>
                                                                <FormLabel>Display Type</FormLabel>
                                                                <FormControl>
                                                                  <Select v-bind="componentField">
                                                                    <SelectTrigger class="w-full">
                                                                      <SelectValue placeholder="Select type" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                      <SelectItem :value="undefined as any">Default
                                                                      </SelectItem>
                                                                      <SelectItem value="rounded">Rounded</SelectItem>
                                                                    </SelectContent>
                                                                  </Select>
                                                                </FormControl>
                                                                <FormDescription>
                                                                  This is the display type for the item.
                                                                </FormDescription>
                                                                <FormMessage />
                                                              </FormItem>
                                                            </FormField>

                                                            <!-- <div>
                                                            <Label>Image URL</Label>
                                                            <Input v-model="item.image" />
                                                          </div> -->

                                                            <FormField v-slot="{ componentField }"
                                                              :name="`categories.${categoryIndex}.columns.${columnIndex}.sections.${sectionIndex}.items.${itemIndex}.image`"
                                                              :validate-on-blur="!isFieldDirty">
                                                              <FormItem>
                                                                <FormLabel>Image URL</FormLabel>
                                                                <FormControl>
                                                                  <Input type="text" placeholder="Image URL"
                                                                    v-bind="componentField" />
                                                                </FormControl>
                                                                <FormDescription>
                                                                  This is the image URL for the item.
                                                                </FormDescription>
                                                                <FormMessage />
                                                              </FormItem>
                                                            </FormField>

                                                            <!-- <div class="flex items-center space-x-2">
                                                                <Switch v-model="item.first" />
                                                                <Label>Show First</Label>
                                                              </div> -->
                                                            <FormField v-slot="{ field }"
                                                              :name="`categories.${categoryIndex}.columns.${columnIndex}.sections.${sectionIndex}.items.${itemIndex}.first`"
                                                              :validate-on-blur="!isFieldDirty">
                                                              <FormItem class="flex flex-col space-x-2">
                                                                <FormLabel>Show First</FormLabel>
                                                                <FormControl>
                                                                  <Switch v-model:model-value="field.value"
                                                                    @update:model-value="field['onUpdate:modelValue']" />
                                                                </FormControl>
                                                                <FormDescription>
                                                                  This is the first item in the section.
                                                                </FormDescription>
                                                                <FormMessage />
                                                              </FormItem>
                                                            </FormField>

                                                            <!-- <div>
                                                            <Label>Related Filter</Label>
                                                            <Select v-model="item.filterId">
                                                              <SelectTrigger class="w-full">
                                                                <SelectValue placeholder="Select filter" />
                                                              </SelectTrigger>
                                                              <SelectContent>
                                                                <SelectItem :value="undefined">None</SelectItem>
                                                                <SelectItem 
                                                                  v-for="filter in filters" 
                                                                  :key="filter.id" 
                                                                  :value="filter.id"
                                                                >
                                                                  {{ filter.name }}
                                                                </SelectItem>
                                                              </SelectContent>
                                                            </Select>
                                                          </div> -->


                                                            <!-- <div>
                                                            <Label>Category Value</Label>
                                                            <Select v-model="item.categoryValueId">
                                                              <SelectTrigger class="w-full">
                                                                <SelectValue placeholder="Select category value" />
                                                              </SelectTrigger>
                                                              <SelectContent>
                                                                <SelectItem :value="undefined">None</SelectItem>
                                                                <SelectItem 
                                                                  v-for="value in attributeValues" 
                                                                  :key="value.id" 
                                                                  :value="value.id"
                                                                >
                                                                  {{ value.name }}
                                                                </SelectItem>
                                                              </SelectContent>
                                                            </Select>
                                                          </div> -->
                                                          </div>
                                                        </CardContent>
                                                      </Card>
                                                    </div>
                                                  </div>
                                                </div>
                                              </AccordionContent>
                                            </AccordionItem>
                                          </Accordion>
                                        </div>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </TabsContent>
            </KeepAlive>
          </Tabs>
        </CardContent>

        <CardFooter class="flex justify-between">
          <Button type="button" variant="outline" @click="() => navigateTo('/admin/navigation-menus')">
            Cancel
          </Button>

          <Popover v-if="!meta.valid && meta.dirty">
            <PopoverTrigger class="text-red-500 cursor-pointer" as-child>
              <span class="text-sm">Please fix the errors above</span>
            </PopoverTrigger>
            <PopoverContent class="p-4 bg-red-100 text-red-500 rounded-md">
              <ul class="list-disc pl-4">
                <li v-for="(error, key) in errors" :key="key">{{ key }}: {{ error }}</li>
              </ul>
            </PopoverContent>
          </Popover>

          <Button type="submit" :disabled="!meta.valid || meta.pending || isSubmitting">
            {{ id ? 'Update' : 'Create' }} Navigation Menu

          </Button>
        </CardFooter>
      </form>
    </Card>

    <!-- Preview section -->
    <!-- <Card v-if="values.categories && values.categories.length > 0">
      <CardHeader>
        <CardTitle>Menu Preview</CardTitle>
        <CardDescription>
          This is a simplified preview of how your mega menu will appear.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div class="border rounded-md p-4">
          <div class="flex gap-4 border-b pb-2 mb-4">
            <div v-for="(category, i) in values.categories" :key="i"
              class="font-medium cursor-pointer hover:text-primary">
              {{ category.label }}
            </div>
          </div>

          <div
            v-if="values.categories.length > 0 && values.categories[activeCategoryId] && values.categories[activeCategoryId].columns">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div v-for="(column, columnIndex) in values.categories[activeCategoryId].columns" :key="columnIndex"
                class="space-y-4">
                <div v-for="(section, sectionIndex) in column.sections" :key="sectionIndex">
                  <h4 class="font-medium mb-2">{{ section.label }}</h4>
                  <ul class="space-y-1">
                    <li v-for="(item, itemIndex) in section.items" :key="itemIndex"
                      class="hover:text-primary cursor-pointer" :class="{ 'font-medium': item.first }">
                      {{ item.label }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center p-4 text-muted-foreground">
            Add columns and sections to see the preview.
          </div>
        </div>
      </CardContent>
    </Card> -->
    <NavMegaMenu :items="previewItems" />
  </div>
</template>