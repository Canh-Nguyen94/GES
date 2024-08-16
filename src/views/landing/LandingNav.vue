<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import Icon from '@components/Icon.vue'
import { navHeaderItems } from '@constants/landing'

const { t } = useI18n()
</script>

<template>
  <div class="flex justify-between pt-4 px-10 bg">
    <Icon icon="project-logo" :size="56" />
    <div class="flex gap-2 items-center">
      <p v-for="item in navHeaderItems" :id="item.id" :key="item.id">
        <RouterLink :to="item.to">
          <span class="text-background cursor-pointer">
            {{ t(item.name) }}
          </span>
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.bg {
  background: #0f2027;
  background: -webkit-linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
}
</style>
