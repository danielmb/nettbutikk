<script lang="ts" setup>
import {
  CommandDialog,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandSeparator,

} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { useMagicKeys } from '@vueuse/core'
import { ref, watch } from 'vue'

const { signOut } = useAuth();

const open = ref(false);

const keys = useMagicKeys();
const ctrlu = keys['alt+u'];

const handleOpenChange = (value: boolean) => {
  open.value = value;
};

watch(ctrlu, () => {
  open.value = true;
});

const onSignOut = () => {
  signOut();
};

</script>
<template>
  <Button @click="open = true">
    <div class="pi pi-user"></div>
  </Button>
  <CommandDialog :open="open" @update:open="handleOpenChange">
    <CommandInput placeholder="Type a command or search..." />
    <CommandEmpty>
      No results found
    </CommandEmpty>
    <CommandList>

      <CommandGroup heading="Settings">

        <CommandItem value="billing">
          Billing
        </CommandItem>
        <CommandItem value="settings" onselect="">
          Settings
        </CommandItem>
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup heading="Account">
        <CommandItem value="profile">
          Profile
        </CommandItem>
        <CommandItem value="signout" @select="onSignOut">
          Sign Out
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>

</template>