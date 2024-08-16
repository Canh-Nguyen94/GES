<script setup>
import vIconSize from '@directives/iconSize'

const icons = Object.fromEntries(
  Object.entries(import.meta.glob('@assets/icons/*.svg', { eager: true })).map(
    ([path, loadLocale]) => [path.match(/([\w-]*)\.svg$/)?.[1], loadLocale]
  )
)

defineProps({
  icon: { type: String, required: true },
  color: { type: String, required: false },
  size: { type: Number, required: false },
  stroke: { type: String, required: false }
})
</script>

<template>
  <component :is="icons[icon]" v-icon-size="{ color, size, stroke }" v-bind="$attrs" />
</template>
