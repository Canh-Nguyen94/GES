<script setup>
import { ref, reactive } from 'vue'
import Icon from '@components/Icon.vue'
import DropDownComponent from '@components/dropdown-menu/DropdownComponent.vue'
import NavUser from './NavUser.vue'
import router from '@router'
import { getProjectHistory, updateProjectHistory } from '@helpers/storage.helper'
import { storeToRefs } from 'pinia'
import { useCacheStore } from '../../store/cache.store'
import { USER_ROLES } from '@constants/user-role.constant'
import { useAuthStore } from '@store'

const { userCache } = storeToRefs(useCacheStore())
const { setProjectId } = useAuthStore()
const options = reactive(getProjectHistory())
const selectedProject = ref((getProjectHistory() || [])[0]?.label)

const handleSelect = (option) => {
  selectedProject.value = option.label
  updateProjectHistory(option)
  setProjectId(option)

  if (router.currentRoute.value.name === 'Folders') router.go()
  else router.replace({ name: 'Folders' })
}

const handleGoToFullList = () => {
  router.replace({ name: 'ProjectsFolders' })
}

const handleNavigate = () => {
  router.replace({ name: 'Settings' })
}
</script>
<template>
  <div
    class="flex justify-between items-center h-16 py-5 px-8 border-b border-secondary-foreground"
  >
    <DropDownComponent
      @update:modelValue="handleSelect"
      :options="options"
      :seperator="true"
      :placeholder="selectedProject"
      contentClass="w-[271px]"
    >
      <template #trigger>
        <div class="w-[261px] h-[26px] flex justify-between items-center mb-2">
          <span class="font-semibold text-[1.375rem]">{{ selectedProject }}</span>
          <Icon icon="arrow-down" :size="26" />
        </div>
      </template>

      <div>
        <div
          class="flex justify-between items-center h-12 p-2 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground"
          @click="handleGoToFullList"
        >
          <p>Go to Full List</p>
          <Icon icon="arrow-forward" :size="24" />
        </div>
        <div v-if="userCache.role === USER_ROLES.BIMAR_ADMIN">
          <hr />
          <div
            class="flex justify-between items-center h-12 p-2 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground"
            @click="handleNavigate"
          >
            <p>Manage Projects</p>
            <Icon icon="settings" :size="24" />
          </div>
        </div>
      </div>
    </DropDownComponent>
    <NavUser />
  </div>
</template>
