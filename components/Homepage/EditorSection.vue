<script lang="ts" setup>
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import { AutoForm, AutoFormField, AutoFormFieldEnum } from '~/components/ui/auto-form';
import { homeMenuSectionPatchSchema } from '~/schemas/homemenu';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '~/components/ui/card';
import { Accordion, AccordionContent, AccordionTrigger, AccordionItem } from '~/components/ui/accordion';
import { z } from 'zod';
import { useToast } from '~/components/ui/toast';
const { toast } = useToast();
type Section = {
  filter: {
    name: string;
    id: number;
    description: string | null;
    public: boolean;
    createdAt: string
    updatedAt: string
  } | null;
} & {
  name: string;
  id: number;
  description: string | null;
  filterId: number | null;
  homePageId: number | null;
};

type Props = {
  section: Section;
  filters: {
    name: string;
    id: number;
    description: string | null;
    public: boolean;
    createdAt: string
    updatedAt: string
  }[];
};

const props = defineProps<Props>();

const schemaWithDefaults = homeMenuSectionPatchSchema.extend({
  name: z.string().default(props.section.name),
  description: z.string().nullish().default(props.section.description),
  homePageId: z.number().nullish().default(props.section.homePageId),
  filterId: z.number().nullish().default(props.section.filterId),
});

const schema = computed(() => {
  const filtersMapped =
    [
      "null",
      ...props.filters.map((filter) => (String(filter.id)))
    ] as [string, ...string[]];
  const filterOptionsEnum = z.enum(filtersMapped)
  return schemaWithDefaults.extend({
    filterId: filterOptionsEnum.transform((val) => {
      if (!val) return null;
      return val === "null" ? null : parseInt(val);
    }).nullish()
  });
});

const selectOptions = computed(() => {
  const options = new Map(props.filters.map((filter) => [String(filter.id), filter.name]));
  options.set("null", "None");
  return options;
});
const queryClient = useQueryClient();
const {
  mutateAsync: updateSection
} = useMutation({
  // @ts-ignore Excessive stack depth
  mutationFn: (data: z.infer<typeof homeMenuSectionPatchSchema>) => $fetch(`/api/homepage_section/${props.section.id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  onError: (error) => {
    toast({
      title: 'Error',
      description: 'Failed to update section',
      variant: 'destructive',
    });
    console.error(error);
  },
  onSettled: async () => {
    await queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'homepage' });
    toast({
      title: 'Success',
      description: 'Section updated',
      variant: 'default',
    });
  },
})

const {
  mutateAsync: deleteSection
} = useMutation({
  // @ts-ignore Excessive stack depth
  mutationFn: () => $fetch(`/api/homepage_section/${props.section.id}`, {
    method: 'DELETE',
  }),
  onError: (error) => {
    toast({
      title: 'Error',
      description: 'Failed to delete section',
      variant: 'destructive',
    });
    console.error(error);
  },
  onSettled: async () => {
    await queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'homepage' });
    toast({
      title: 'Success',
      description: 'Section deleted',
      variant: 'default',
    });
  },
});


</script>

<template>

  <AccordionItem :value="`section-${section.id}`">
    <div class="flex justify-between">

      <AccordionTrigger>
        {{ section.name }}
      </AccordionTrigger>
      <div class="flex justify-end space-x-4 p-4">
        <Button @click="deleteSection" variant="destructive" type="button" class="pi pi-trash" />
      </div>
    </div>
    <AccordionContent>
      <AutoForm @submit="(data) => {
        updateSection(data)
      }" :field-config="{
        filterId: {

          label: 'Filter',
        },
        homePageId: {
          component: () => { return h('div') }
        },
      }" :schema="schema" :model="section">
        <template #filterId="slotProps">
          <AutoFormField v-bind="slotProps" :select-options="selectOptions" />
        </template>
        <div class="flex justify-end space-x-4 p-4">
          <Button @click="deleteSection" variant="destructive" type="button">
            Delete
          </Button>
          <Button type="submit">
            Save
          </Button>
        </div>

      </AutoForm>
    </AccordionContent>
  </AccordionItem>
</template>