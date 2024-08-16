<script setup>
import Icon from '@common/ui/icon/Icon.vue'
import Text from './text/Text.vue'
import { FileSearch } from 'lucide-vue-next'

defineProps({
  content: {
    type: String,
    default: ''
  },
  searching: {
    type: Boolean,
    default: false
  },
  itemName: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="flex wrap-box bg-background">
    <template v-if="searching">
      <FileSearch size="40" />
      <Text size="lg" font="md" type="primary">Searching</Text>
    </template>
    <template v-else>
      <Icon icon="empty-table" :size="140" />
      <Text size="lg" font="md" type="primary" class="mb-1">No result found</Text>
      <Text size="lg" type="primary">Try searching for a different keyword</Text>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.wrap-box {
  width: 100%;
  min-height: calc(100vh - 600px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  gap: 10px;
  font-size: 22px;
  background-color: var(--background);
  color: gray;
  align-items: center;
  margin-top: 10px;
  border-radius: 4px;
}
</style>
