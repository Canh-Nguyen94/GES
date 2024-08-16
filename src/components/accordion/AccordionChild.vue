<script setup>
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@common/ui/accordion'
import { useField } from 'vee-validate'
import FormControl from '@components/form-control/FormControl.vue'
import Icon from '@components/Icon.vue'
import { watch } from 'vue'

const props = defineProps({
  name: { type: String, required: false },
  nameLabel: { type: String, required: false },
  placeholder: { type: String, required: false },
  label: { type: String, required: false },
  options: { type: Array, required: false },
  subFolderList: { type: Array, required: false },
  triggerClass: { type: String, required: false },
  itemClass: { type: String, required: false },
  errorMessage: { type: String, required: false },
  seperator: { type: Boolean, required: false },
  required: { type: Boolean, required: false },
  loading: { type: Boolean, required: false }
})
const { value, errorMessage } = useField(() => props.name)
const emits = defineEmits(['update:modelValue'])
watch(props.options, () => {
  console.log('options', props.options)
})
const handleSelect = (value) => {
  folders.value = value
}
const handleSelectsubFolder = (item) => {
  if (item.type === 'folder') subfolders.value = item.id
}
const folders = defineModel('folders')
const subfolders = defineModel('subfolders')
</script>

<template>
  <FormControl :label="label" :errorMessage="errorMessage" :required="required" class="mt-[32px]">
    <Accordion type="single" class="w-full" collapsible @update:modelValue="handleSelect">
      <AccordionItem v-for="item in options" :key="item.value" :value="item.value" class="w-full">
        <div class="flex gap-4 items-center w-full">
          <Icon :icon="item.type" :size="24" />
          <AccordionTrigger class="w-full flex justify-between">
            {{ item.label }}
          </AccordionTrigger>
        </div>

        <AccordionContent class="pl-4">
          <Accordion type="single" class="w-full" collapsible>
            <AccordionItem
              v-for="sub in item.children"
              :key="sub.value"
              :value="sub.value"
              @click="() => handleSelectsubFolder(sub)"
            >
              <div class="flex gap-4 items-center w-full">
                <Icon :icon="sub.type" :size="24" />

                <AccordionTrigger class="w-full flex justify-between font-medium">{{
                  sub.label
                }}</AccordionTrigger>
              </div>
              <AccordionContent class="pl-4">
                <AccordionComponent v-if="sub.children" :options="sub.children" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </FormControl>
</template>
