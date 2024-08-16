<script setup>
import { cn } from "@utils/ui-shadcn.util";

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    :class="cn('font-normal text-foreground', props.class)"
  >
    <slot />
  </span>
</template>
