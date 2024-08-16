<script setup>
import { computed } from 'vue'
import { Primitive } from 'radix-vue'
import { textVariants } from '.'
import { cn } from '@utils/ui-shadcn.util'

const props = defineProps({
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false, default: 'span' },
  size: { type: String, default: '' },
  type: { type: String, default: '' },
  class: { type: String, default: '' },
  variant: { type: String, default: '' },
  font: { type: String, default: '' },
  content: { type: [String, Number], default: '' },
  lineClamp: { type: [String, Number], default: undefined },
  truncated: { type: Boolean, default: false },
  title: { type: String, required: false }
})

const textClass = computed(() => ({
  'is-truncated': props.truncated,
  'is-line-clamp': props.lineClamp
}))
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(textVariants({ variant, size, type, font }), textClass, props.class)"
    :style="{ '-webkit-line-clamp': lineClamp }"
    :title="title"
  >
    <slot>
      {{ content }}
    </slot>
  </Primitive>
</template>

<style scoped>
.is-truncated {
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.is-line-clamp {
  display: -webkit-inline-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: break-word;
}
</style>
