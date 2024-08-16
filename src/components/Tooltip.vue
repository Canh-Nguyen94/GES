<script setup>
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@common/ui/tooltip'

const props = defineProps({
  value: { type: String, required: false },
  class: { type: String, required: false }
})
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger :class="class">
        <slot />
      </TooltipTrigger>
      <TooltipContent class="w-full text-left bg-black bg-opacity-70 bottom p-2" side="bottom">
        <p class="text-white">{{ value }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
