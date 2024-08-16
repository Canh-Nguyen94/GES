<script setup>
import { Button } from '@common/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@common/ui/dialog'
import { useLayoutStore } from '../../store/layout.store'
const { openConfirmDiscardModel } = useLayoutStore()

const props = defineProps({
  handleDiscardModel: Function,
  isOpen: Boolean,
  name: String,
  title: { type: String, default: 'Discard Changes?' },
  description: { type: String, default: 'Your data will not be saved' }
})

const emits = defineEmits(['cancel', 'update:discardModel'])

const handleCancel = () => {
  openConfirmDiscardModel(false)
}

const handleDiscardModel = () => {
  emits('update:discardModel', true)
}
</script>

<template>
  <Dialog :open="isOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-lg text-primary font-bold">{{ title }}</DialogTitle>
      </DialogHeader>
      <div class="text-primary text-justify">
        <div class="mb-1">{{ description }}</div>
      </div>
      <DialogFooter class="justify-end">
        <DialogClose as-child>
          <Button type="button" class="text-[red]" @click="handleDiscardModel"> CONFIRM </Button>
        </DialogClose>
        <Button type="button" @click="handleCancel"> CANCEL </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
