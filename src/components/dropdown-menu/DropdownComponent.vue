<script setup>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@common/ui/dropdown-menu'
import { cn } from '@utils/ui-shadcn.util'
import Icon from '@components/Icon.vue'

defineProps({
  placeholder: { type: String, required: false },
  label: { type: String, required: false },
  options: { type: Array, required: false },
  contentClass: { type: String, required: false },
  itemClass: { type: String, required: false },
  seperator: { type: Boolean, required: false }
})

const emits = defineEmits(['update:modelValue'])
const handleClick = (option) => {
  emits('update:modelValue', option)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuContent :class="cn('w-full', contentClass)">
      <DropdownMenuLabel v-if="label">{{ label }}</DropdownMenuLabel>
      <DropdownMenuItem
        v-for="option in options"
        :value="option.value"
        :key="option.id"
        :class="cn('h-12', itemClass)"
        @click="() => handleClick(option)"
      >
        <Icon :icon="option.icon" :size="24" class="mr-4" />
        {{ option.label }}
      </DropdownMenuItem>
      <slot />
    </DropdownMenuContent>
  </DropdownMenu>
</template>
