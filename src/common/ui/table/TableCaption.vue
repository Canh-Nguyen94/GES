<script setup>
import { cn } from "@utils/ui-shadcn.util";

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <caption :class="cn('mt-4 text-sm text-muted-foreground', props.class)">
    <slot />
  </caption>
</template>
