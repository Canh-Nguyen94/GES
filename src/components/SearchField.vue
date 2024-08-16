<script setup>
import { Search, X } from 'lucide-vue-next'
import { debounce } from 'lodash-es'
import { cn } from '@utils/ui-shadcn.util'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  placeholder: { type: String, default: '' },
  value: { type: String, default: '' },
  handleSearch: { type: Function, default: () => {} }
})
const isClear = ref(false)

const handleInput = debounce(props.handleSearch, 1500)

const handleClearSearch = (event) => {
  isClear.value = true

  setTimeout(() => {
    event.target.value = ''
    props.handleSearch(event)
    isClear.value = false
  }, 1500)
}
</script>

<template>
  <div class="relative w-full max-w-sm items-center">
    <input
      :value="isClear ? '' : route?.query?.search || value"
      :class="
        cn(
          'flex h-10 w-full rounded-md border text-primary border-secondary-foreground bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          props.class
        )
      "
      class="h-[40px] pl-10 outline-none w-full"
      :placeholder="placeholder || 'Search...'"
      @input="handleInput"
    />

    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
      <Search class="size-6 text-secondary" />
    </span>

    <span
      v-if="(route?.query?.search || value).length"
      class="absolute end-0 inset-y-0 flex items-center justify-center px-3"
    >
      <X @click="handleClearSearch" class="size-6 text-secondary" />
    </span>
  </div>
</template>
