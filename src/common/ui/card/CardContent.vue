<script setup>
import { cn } from '@utils/ui-shadcn.util'

const props = defineProps({
  class: { type: null, required: false }
})
</script>

<template>
  <div :class="cn('p-6 pt-0', props.class)">
    <slot />
  </div>
</template>
