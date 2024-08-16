<script setup>
import { useField } from 'vee-validate'
import FormControl from '@components/form-control/FormControl.vue'
import SingleSelect from './SingleSelect.vue'

const props = defineProps({
  name: { type: String, required: false },
  nameLabel: { type: String, required: false },
  placeholder: { type: String, required: false },
  label: { type: String, required: false },
  options: { type: Array, required: false },
  triggerClass: { type: String, required: false },
  itemClass: { type: String, required: false },
  errorMessage: { type: String, required: false },
  seperator: { type: Boolean, required: false },
  required: { type: Boolean, required: false },
  loading: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
})

const { value, errorMessage } = useField(() => props.name)

defineOptions({
  inheritAttrs: false
})

const emits = defineEmits(['update:modelValue'])

const handleSelect = (value) => {
  emits('update:modelValue', value)
}
</script>

<template>
  <FormControl :label="label" :errorMessage="errorMessage" :required="required" class="mt-[32px]">
    <SingleSelect
      v-model="value"
      :placeholder="placeholder"
      :options="props.options"
      v-bind="$attrs"
      @update:modelValue="handleSelect"
      :loading="loading"
      :disabled="disabled"
    />
  </FormControl>
</template>
