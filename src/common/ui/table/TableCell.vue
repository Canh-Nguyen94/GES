<script setup>
import { cn } from "@utils/ui-shadcn.util";

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <td
    :class="cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', props.class)"
  >
    <slot />
  </td>
</template>
