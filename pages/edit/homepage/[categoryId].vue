<script lang="ts" setup>
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from '~/components/ui/select';
import type { HomeMenuSectionPost } from '~/schemas/homemenu';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader, CardDescription, CardFooter, CardTitle
} from '~/components/ui/card';
import { Accordion, AccordionContent, AccordionTrigger } from '~/components/ui/accordion';
const route = useRoute();
const { categoryId } = route.params;
// const { data: homepage } = await useFetch(`/api/homepage/${categoryId}`);
const { data: homepage } = useQuery({
  // @ts-ignore Excessive stack depth ...
  queryFn: () => $fetch(`/api/homepage/${categoryId}`, {
    query: {
      takeSection: 6,
    },
  }),
  enabled: !!categoryId,
  queryKey: ['homepage', categoryId],
})
const queryClient = useQueryClient();
const { mutateAsync: addSection } = useMutation({
  mutationFn: (data: HomeMenuSectionPost) => $fetch(`/api/homepage_section`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  onSuccess: async (res) => {
    await queryClient.cancelQueries({ queryKey: ['homepage', categoryId] });
    const previousData = queryClient.getQueryData(['homepage', categoryId]);
    queryClient.setQueryData(['homepage', categoryId], (old: any) => {
      return {
        ...old,
        homePageSections: [
          ...old.homePageSections,
          res,
        ],
      };
    });
    return { previousData };
  },
});

const { data: filters } = useQuery({
  // @ts-ignore Excessive stack depth ...
  queryFn: () => $fetch('/api/filters'),
  queryKey: ['filters'],
})


</script>

<template>
  <Card class="mb-6">
    <CardHeader>
      <CardTitle>
        {{ homepage?.name }}
      </CardTitle>
      <CardDescription>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div>
        <div>
          <h2>
            Sections
          </h2>
          <div>
            <Accordion :unmount-on-hide="false">
              <HomepageEditorSection :filters="filters ?? []" :section="section"
                v-for="section in homepage?.homePageSections" :key="section.id" />
            </Accordion>
          </div>
          <div v-if="homepage">
            <Button @click="addSection({ homePageId: homepage?.id, name: 'New Section' })">
              Add Section
            </Button>
          </div>
        </div>
      </div>
    </CardContent>

  </Card>

</template>