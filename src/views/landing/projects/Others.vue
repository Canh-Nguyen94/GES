<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="flex justify-between pt-4 px-10 bg">
    <h2>Others</h2>
  </div>
</template>

<style scoped>
.bg {
  z-index: -1;
  background: #0f2027;
  background: -webkit-linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
}
</style>
