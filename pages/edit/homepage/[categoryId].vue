<script lang="ts" setup>
import type { HomeMenuSectionPost } from '~/schemas/homemenu_post';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader, CardDescription, CardFooter, CardTitle
} from '~/components/ui/card';
const route = useRoute();
const { categoryId } = route.params;
// const { data: homepage } = await useFetch(`/api/homepage/${categoryId}`);
const { data: homepage } = useQuery({
  queryFn: () => $fetch(`/api/homepage/${categoryId}`),
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
  onMutate: async (data) => {

  },
});

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
            <div v-for="section in homepage?.homePageSections" :key="section.id">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {{ section.name }}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <h3>
                        Products
                      </h3>
                      <div>

                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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