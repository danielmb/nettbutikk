<script lang="ts" setup>
import { AutoForm } from '~/components/ui/auto-form';
import { megaMenuNewSchema } from '~/schemas/megamenu_[id]';
import { Button } from '~/components/ui/button';

const { data: megamenus } = await useFetch('/api/megamenu');
async function onSubmit(values: Record<string, any>) {
  await $fetch('/api/megamenu', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}
</script>

<template>
  <div class="px-52 py-5">
    <div class="flex flex-col space-y-2">
      <Button v-for="menu in megamenus" :key="menu.id" variant="link" type="button" as-child>
        <a :href="`/menu/${menu.id}`">
          {{ menu.name }}
        </a>
      </Button>
    </div>
    <AutoForm :schema="megaMenuNewSchema" @submit="onSubmit">
      <Button type="submit">
        Submit
      </Button>
    </AutoForm>
  </div>
</template>
