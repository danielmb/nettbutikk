<script setup lang="ts">
const { status } = useAuth();

</script>
<template>
  <div>
    <p v-if="status === 'loading'">Loading...</p>
    <p v-else-if="status === 'authenticated'">
      <AppHeaderUserInfo />
    </p>
    <p v-else-if="status === 'unauthenticated'">
      <LoginButton />
    </p>
  </div>
</template>