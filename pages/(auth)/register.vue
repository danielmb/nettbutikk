<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'
import Input from '~/components/ui/input/Input.vue'
const { loggedIn, user, fetch: refreshSession } = useUserSession()
const credentials = reactive({
  name: '',
  email: '',
  password: '',
})
async function register() {
  $fetch('/api/auth/register', {
    method: 'POST',
    body: credentials
  })
    .then(async () => {
      await navigateTo('/api/auth/signin')
    })
    .catch(() => alert('Bad credentials'))
}
</script>

<template>
  <form @submit.prevent="register">
    <Input v-model="credentials.name" type="text" placeholder="Name" />
    <Input v-model="credentials.email" type="email" placeholder="Email" />
    <Input v-model="credentials.password" type="password" placeholder="Password" />
    <Button type="submit">Login</Button>
  </form>
</template>