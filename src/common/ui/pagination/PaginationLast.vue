<script setup>
import { computed } from 'vue'
import { PaginationLast } from 'radix-vue'
import { ChevronsRight } from 'lucide-vue-next'
import { Button } from '@common/ui/button'
import { cn } from '@utils/ui-shadcn.util'

const props = defineProps({
  asChild: { type: Boolean, required: false, default: true },
  as: { type: null, required: false },
  class: { type: null, required: false }
})

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <PaginationLast v-bind="delegatedProps">
    <Button :class="cn('w-10 h-10 p-0', props.class)" variant="outline">
      <slot>
        <ChevronsRight class="h-4 w-4" />
      </slot>
    </Button>
  </PaginationLast>
</template>
