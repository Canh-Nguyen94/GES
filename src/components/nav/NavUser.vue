<script setup>
import { ref, reactive, watch } from 'vue'

import Icon from '@components/Icon.vue'
import DropDownComponent from '@components/dropdown-menu/DropdownComponent.vue'
import { signOut } from '@service/auth.service'
import { userService } from '@service/users.service'
import { useCacheStore } from '../../store/cache.store'

const props = defineProps({
  user: { type: Object, required: false }
})
const { setUserCache } = useCacheStore()

const { data: userData } = userService.getUserDetail()

watch(userData, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    setUserCache(newValue)
  }
})

const options = reactive([
  { icon: 'user', label: 'Account', value: 'account', id: 1 },
  { icon: 'log-out', label: 'Logout', value: 'logout', id: 2 }
])

const openMenu = ref()
const handleSelect = (option) => {
  switch (option.value) {
    case 'logout': {
      signOut()
      break
    }
    default: {
      break
    }
  }
}
const handleOpen = () => {}

const getUserDisplayName = () => {
  if (!userData?.value) return 'User'
  const { firstName = '', lastName = '' } = userData?.value
  return firstName + ' ' + lastName
}
</script>
<template>
  <DropDownComponent
    @update:modelValue="handleSelect"
    @update:open="handleOpen"
    v-model:open="openMenu"
    :options="options"
    contentClass="w-[264px]"
  >
    <template #trigger>
      <div class="w-[212px] h-12 flex justify-end items-center mb-2 gap-4">
        <p>{{ getUserDisplayName() }}</p>
        <div class="flex gap-1 justify-center items-center">
          <Icon icon="avatar" :size="32" />
          <Icon icon="arrow-down" :size="26" />
        </div>
      </div>
    </template>
  </DropDownComponent>
</template>
