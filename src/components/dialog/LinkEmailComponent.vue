<script setup>
import { Copy } from 'lucide-vue-next'
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
import { Input } from '@common/ui/input'
import { Label } from '@common/ui/label'
import FormItemInput from '@components/form-item/FormItemInput.vue'
import InputPassword from '@components/InputPassword.vue'
import { ref } from 'vue'

const props = defineProps({
  title: String,
  description: String,
  handleConfirmModal: Function,
  isOpenLinkMicrosoft: Boolean,
  closeModal: Function,
  email: String
})

const password = ref('')

const emit = defineEmits(['cancel', 'confirm'])

const handleCancel = () => {
  props.closeModal()
}

const handleConfirm = () => {
  props.handleConfirmModal(password.value)
}
</script>

<template>
  <Dialog :open="isOpenLinkMicrosoft">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-lg text-success">{{ props.title }}</DialogTitle>
        <DialogDescription> {{ props.description }} </DialogDescription>
      </DialogHeader>
      <div class="text-primary text-justify">
        <div class="mb-5">
          Your email
          <b>{{ email }}</b>
          already exists Please enter your password for the above email if you want to link your
          current account with Microsoft account
        </div>
        <div>
          <p class="mb-[10px]">Password</p>
          <FormItemInput
            v-slot="{ componentField, errorMessage: passwordErrorMessage }"
            name="password"
            @input="password = $event.target.value"
          >
            <InputPassword
              placeholder="********"
              v-bind="componentField"
              :is-error="!!passwordErrorMessage"
            />
          </FormItemInput>
        </div>
      </div>
      <DialogFooter class="justify-end">
        <DialogClose as-child>
          <Button type="button" variant="destructive" @click="handleCancel"> Cancel </Button>
        </DialogClose>
        <Button type="button" @click="handleConfirm"> Confirm </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
