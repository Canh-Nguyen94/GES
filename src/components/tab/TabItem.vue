<script setup lang="ts">
interface Props {
  id: number
  name: string
  icon: any
  isSelected: boolean
}

defineProps<Props>()

const emit = defineEmits(['clickItem'])

const handleSelect = (value: number) => {
  emit('clickItem', value)
}
</script>

<template>
  <div :class="[classes['tab-item-style'], isSelected && classes['active']]" @click="handleSelect(id)">
    <component :is="icon" :class="[classes['icon-style'], isSelected && classes['active']]" />
    <p :class="[classes['text-style'], isSelected && classes['active']]">{{ name }}</p>
  </div>
</template>

<style module="classes" lang="scss" src="./tab.module.scss"></style>
