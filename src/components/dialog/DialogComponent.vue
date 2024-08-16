<script setup>
import { Button } from '@common/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@common/ui/dialog'

const props = defineProps({
  title: String,
  description: String,
  handleDiscardModel: Function,
  isOpen: Boolean
})

const emit = defineEmits(['cancel', 'confirm'])

const handleCancel = () => {
  emit('cancel')
  toggleConfirmDelete()
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<template>
  <Dialog :open="isOpen">
    <DialogTrigger as-child>
      <!-- <Button variant="outline"> Share </Button> -->
    </DialogTrigger>
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-lg text-primary font-bold">{{ props.title }}</DialogTitle>
        <DialogDescription class="text-secondary mt-2"> {{ props.description }} </DialogDescription>
      </DialogHeader>
      <div class="flex items-center space-x-2">
        <slot />
      </div>
      <DialogFooter class="justify-end">
        <DialogClose as-child>
          <Button type="button" class="uppercase" @click="handleCancel"> Cancel </Button>
        </DialogClose>
        <Button type="button" class="uppercase" variant="destructive" @click="handleConfirm">
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
