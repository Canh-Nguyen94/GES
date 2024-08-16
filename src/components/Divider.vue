<script setup>
defineProps({
  orientation: {
    type: String,
    default: 'horizontal'
  },
  color: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
    :class="[
      orientation === 'horizontal'
        ? 'border-b border-secondary-foreground w-full'
        : 'border-r border-secondary-foreground h-full'
    ]"
    :style="{
      borderColor: color
    }"
  >
    <slot />
  </div>
</template>
