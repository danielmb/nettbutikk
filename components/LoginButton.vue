<script lang="ts" setup>
import { Button } from '@/components/ui/button';
const { signIn } = useAuth();
const onSignIn = () => {
  signIn('credentials');
};
</script>
<template>
  <Button @click="onSignIn">Login</Button>
</template>