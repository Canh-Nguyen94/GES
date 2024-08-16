<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@common/ui/select'
import SelectSeparator from '@common/ui/select/SelectSeparator.vue'
import { cn } from '@utils/ui-shadcn.util'

defineProps({
  placeholder: { type: String, required: false },
  label: { type: String, required: false },
  options: { type: Array, required: false },
  triggerClass: { type: String, required: false },
  itemClass: { type: String, required: false },
  seperator: { type: Boolean, required: false },
  loading: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false }
})
</script>

<template>
  <Select>
    <SelectTrigger
      :disabled="loading"
      :class="cn('w-full h-[39px] text-secondary border-b border-input', triggerClass)"
    >
      <p v-if="loading" class="w-full h-8 flex justify-center items-center">Loading...</p>
      <SelectValue v-else :placeholder="placeholder" class="h-4" />
    </SelectTrigger>

    <SelectContent>
      <SelectGroup>
        <SelectLabel v-if="label">{{ label }}</SelectLabel>
        <SelectItem
          v-for="option in options"
          :value="option.value"
          :key="option.id"
          :class="cn('h-12', itemClass)"
          :disabled="disabled"
        >
          {{ option.label }}
        </SelectItem>
        <SelectSeparator v-if="seperator" />
        <slot />
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
