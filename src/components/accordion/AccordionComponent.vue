<script setup>
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@common/ui/accordion'
import Icon from '@components/Icon.vue'
import Tooltip from '@components/Tooltip.vue'
import { ref, watch } from 'vue'

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
  loading: { type: Boolean, required: false },
  isOpen: { type: Boolean, required: false, default: false }
})

const clickedItem = ref()
const emits = defineEmits(['update:folderValue', 'update:modelDetails'])
const folderId = defineModel()

const handleOpenFolder = (item) => {
  if (item?.type === 'folder') {
    folderId.value = item.id
    emits('update:folderValue', item.id)
  } else {
    clickedItem.value = item
    emits('update:modelDetails', item)
  }
}
</script>

<template>
  <Accordion type="single" collapsible>
    <AccordionItem
      v-if="options"
      v-for="item in options"
      :key="item.value"
      :value="item.value"
      class="w-full border-none pl-4"
    >
      <div v-if="item.type === 'folder'">
        <div class="flex gap-4 items-center w-full truncate">
          <AccordionTrigger
            class="w-full flex justify-between items-center text-md font-normal truncate text-[16px]"
            @click="() => handleOpenFolder(item)"
            :showDropdown="item.type === 'folder'"
          >
            <Icon :icon="item.type" :size="24" class="mr-4" />
            {{ item.label }}
          </AccordionTrigger>
        </div>

        <AccordionContent v-if="item.children" class="pl-4">
          <AccordionComponent
            v-if="item?.children"
            :options="item?.children"
            name="folder"
            label="Select Model"
            @update:folderValue="$emit('update:folderValue', $event)"
            @update:modelDetails="$emit('update:modelDetails', $event)"
          />
        </AccordionContent>
      </div>
      <div v-else class="flex w-full">
        <AccordionTrigger
          :class="item?.id === clickedItem?.id && 'bg-foreground'"
          class="w-full flex items-center text-md font-normal text-[16px]"
          @click="() => handleOpenFolder(item)"
          :showDropdown="item.type === 'folder'"
        >
          <Icon :icon="item.type" :size="24" class="mr-4" />
          <div>
            <Tooltip :value="item.label">
              <p class="w-[240px] min-h-5 truncate text-left">{{ item.label }}</p>
            </Tooltip>
          </div>
        </AccordionTrigger>
      </div>
    </AccordionItem>
  </Accordion>
</template>
