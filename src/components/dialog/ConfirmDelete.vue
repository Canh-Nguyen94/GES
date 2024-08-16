<script setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { Button } from '@common/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@common/ui/dialog'
import { useLayoutStore } from '@store/layout.store'
import { useCacheStore } from '@store/cache.store'

const { cache, popupCache } = storeToRefs(useCacheStore())
const { toggleConfirmDelete } = useLayoutStore()

const props = defineProps({
  handleDelete: Function,
  isOpen: Boolean,
  title: { type: String, default: 'Delete model?' },
  description: { type: String, default: 'This model will be deleted from BIMAR' },
  confirmBtn: { type: String, default: 'DELETE' },
  cancelBtn: { type: String, default: 'CANCEL' }
})

const emits = defineEmits(['cancel', 'update:confirmDelete'])
const modelName = ref('')

const handleCancel = () => {
  emits('cancel')
  toggleConfirmDelete()
}

const handleConfirm = () => {
  emits('update:confirmDelete', true)
}

watch(popupCache, () => {
  modelName.value = popupCache?.value?.name || ''
})
</script>

<template>
  <Dialog :open="isOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-lg text-primary font-bold">{{ title }}</DialogTitle>
      </DialogHeader>
      <div class="text-primary text-justify">
        <div class="mb-1">
          <p>{{ description }}</p>
          {{ modelName }}
        </div>
      </div>
      <DialogFooter class="justify-end">
        <DialogClose as-child>
          <Button type="button" class="text-destructive uppercase" @click="handleConfirm">
            {{ confirmBtn }}
          </Button>
        </DialogClose>
        <Button type="button" @click="handleCancel" class="uppercase"> {{ cancelBtn }} </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
