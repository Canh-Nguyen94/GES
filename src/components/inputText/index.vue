<template>
  <div class="relative">
    <input
      :class="[
        'text-black border-[2px] rounded-md w-[310px] h-[44px] px-[14px] py-[10px] focus:outline-none ',
        borderClass
      ]"
      :placeholder="placeholder"
      v-model="value"
      :type="type || 'text'"
    />
    <div v-if="errorMessage" class="absolute right-4 top-4">
      <IconError />
    </div>

    <span class="text-[14px] text-[#DB4336] -translate-y-[6px]">{{ errorMessage }}</span>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'
import { computed } from 'vue'
import IconError from '@assets/icons/error-input.svg'

const props = defineProps({
  name: String,
  type: String,
  placeholder: String
})

const { value, errorMessage } = useField(props.name)

const borderClass = computed(() => {
  return errorMessage.value ? 'border-[#DB4336]' : 'border-gray-300'
})
</script>
