<script setup>
import { computed, onUnmounted } from 'vue'
import NavSideItem from './NavSideItem.vue'
import { navItems } from '@config/navItems'
import adminRoutes from '@router/admin'
import { Transition } from 'vue'
import Icon from '@components/Icon.vue'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '../../store/layout.store'
import { useRouter } from 'vue-router'
import { signOut } from '@service/auth.service'
import { useCacheStore } from '../../store/cache.store'
import { USER_ROLES, ACTIONS_ROLE } from '@constants/user-role.constant'
import { useAuthStore } from '@store'
import { isPermitted } from '@utils/common.util'

const router = useRouter()
const { isShowSidebar } = storeToRefs(useLayoutStore())
const { toggleSidebar } = useLayoutStore()

const { userCache } = storeToRefs(useCacheStore())

const { permissions, isSuperAdmin: isBimarAdmin } = storeToRefs(useAuthStore())

onUnmounted(() => {
  document.body.classList.remove('no-scroll')
})

const routesData = computed(() => {
  if (permissions.value) {
    const menuAvailable = []
    const _mainRoutes = adminRoutes.filter((m) => m.main)[0].children
    for (let i = 0; i < _mainRoutes.length; i++) {
      const checkPassing = isPermitted(
        isBimarAdmin.value,
        _mainRoutes[i].path,
        permissions.value,
        ACTIONS_ROLE.view
      )

      if (
        (checkPassing && _mainRoutes[i].displayOnSidebar && _mainRoutes[i].path !== '/settings') ||
        _mainRoutes[i].path === '/'
      ) {
        menuAvailable.push(_mainRoutes[i])
      }
    }
    return menuAvailable
  }
  return {}
})

const handleNavigate = () => {
  router.replace({ name: 'Settings' })
}

const handleRedirectToProjectList = () => {
  router.replace({ name: 'ProjectsFolders' })
}

const sidebarMiniClass = computed(() => {
  if (isShowSidebar?.value) {
    document?.body?.classList?.add('no-scroll')
    return 'w-[223px]'
  } else {
    document?.body?.classList?.remove('no-scroll')
    return 'w-[71px]'
  }
})

async function handleSignOut() {
  signOut()
}
</script>

<template>
  <Transition name="slide" mode="out-in">
    <aside
      class="bg-foreground z-99 h-screen flex flex-col flex-shrink-0 flex-col transition border-r border-secondary-foreground"
      :class="sidebarMiniClass"
      aria-label="Sidebar"
    >
      <div class="relative flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden">
        <div v-if="isShowSidebar" class="flex justify-between items-center py-[18px] px-5">
          <img
            class="cursor-pointer"
            src="@assets/images/logoOpen.png"
            @click="handleRedirectToProjectList"
          />
          <Icon
            icon="closeMenu"
            :size="24"
            grow-0
            shrink-0
            basis-24px
            group-hover:text-gray-900
            transition
            duration-25
            @click="toggleSidebar"
            class="cursor-pointer"
          />
        </div>
        <div v-else class="flex flex-col justify-between items-center py-[18px] px-5 gap-6 mb-2">
          <img
            class="cursor-pointer"
            src="@assets/images/bimarLogo.png"
            @click="handleRedirectToProjectList"
          />
          <Icon
            icon="openMenu"
            :size="24"
            grow-0
            shrink-0
            basis-24px
            group-hover:text-gray-900
            transition
            duration-25
            @click="toggleSidebar"
            class="cursor-pointer"
          />
        </div>
        <ul class="px-2">
          <NavSideItem
            v-for="nav in routesData"
            :title="nav.displayName"
            :icon="nav.icon"
            :to="nav.path"
            :key="nav.name"
          />
        </ul>
      </div>
      <div
        :disabled="!isBimarAdmin"
        class="flex items-center m-2 px-4 cursor-pointer overflow-y-auto overflow-x-hidden"
        @click="handleNavigate"
      >
        <Icon icon="settings" :size="24" />
        <p v-if="isShowSidebar" class="ml-4 text-primary text-lg">Settings</p>
      </div>
      <div
        class="h-[46px] flex items-center m-2 px-4 cursor-pointer overflow-y-auto overflow-x-hidden"
        @click="handleSignOut"
      >
        <Icon icon="log-out" :size="24" />
        <p v-if="isShowSidebar" class="ml-4 text-primary text-lg">Log out</p>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
body.no-scroll {
  overflow: hidden;
}
</style>
