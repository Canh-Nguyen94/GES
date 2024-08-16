<script setup>
import { computed } from 'vue'
import { ToastViewport } from 'radix-vue'
import { cn } from '@utils/ui-shadcn.util'

const props = defineProps({
  hotkey: { type: Array, required: false },
  label: { type: [String, Function], required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false }
})

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ToastViewport
    v-bind="delegatedProps"
    :class="
      cn(
        'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse py-4 sm:top-0 sm:right-0 sm:flex-col md:min-w-[420px] md:max-w-fit',
        props.class
      )
    "
  />
</template>
