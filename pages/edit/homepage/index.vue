<script lang="ts" setup>
import { AutoForm } from '~/components/ui/auto-form';
import { homemenuPostSchema } from '~/schemas/homemenu';
import { Button } from '~/components/ui/button';

const { data: homeMenus } = await useFetch('/api/homepage');
async function onSubmit(values: Record<string, any>) {
  await $fetch('/api/homepage', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}
</script>

<template>
  <div class="px-52 py-5">
    <div class="flex flex-col space-y-2">
      <Button v-for="menu in homeMenus" :key="menu.id" variant="link" type="button" as-child>
        <a :href="`/edit/homepage/${menu.id}`">
          {{ menu.name }}
        </a>
      </Button>
    </div>
    <AutoForm :schema="homemenuPostSchema" @submit="onSubmit">
      <Button type="submit">
        Submit
      </Button>
    </AutoForm>
  </div>
</template>
