<script setup lang="js">
const { data: attributes } = useFetch('/api/attribute-type');
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
</script>

<template>
  <div class="w-full flex flex-col space-y-4 p-4">
    <Accordion>
      <AccordionItem v-for="attribute in attributes" :value="`${attribute.id}`" :key="attribute.id">
        <AccordionTrigger>
          {{ attribute.name }}
        </AccordionTrigger>
        <AccordionContent>
          <EAVAttributeEditor :attribute="attribute" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>


</template>