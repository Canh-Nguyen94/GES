<script setup>
import { RouterLink } from 'vue-router'
import Icon from '@components/Icon.vue'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@store/layout.store'
const { isShowSidebar } = storeToRefs(useLayoutStore())

defineProps({
  icon: { type: String, required: false },
  to: { type: String, required: true },
  title: { type: String, required: false }
})
</script>

<template>
  <li>
    <RouterLink
      :to="to"
      activeClass="bg-card font-semibold"
      hover="bg-gray-100"
      class="w-full h-[46px] flex items-center pl-4 transition group rounded-[8px]"
    >
      <slot name="icon">
        <Icon
          :icon="icon"
          :size="24"
          grow-0
          shrink-0
          basis-24px
          group-hover:text-gray-900
          transition
          duration-25
        />
      </slot>

      <p v-if="isShowSidebar" class="ml-4 text-primary text-lg">
        {{ title }}
      </p>
    </RouterLink>
  </li>
</template>
