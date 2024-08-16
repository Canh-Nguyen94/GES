<script setup>
import { Button } from '@common/ui/button'
import Icon from '@components/Icon.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@common/ui/popover'
import Text from '@components/text/Text.vue'
import router from '@router'
import { useRoute } from 'vue-router'
import CheckBox from '@common/ui/checkbox/Checkbox.vue'
import { MODEL_STATUS } from '@constants/common.constant'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCacheStore } from '../../store/cache.store'
const { setFilterStatusCache } = useCacheStore()
const { filterStatusCache } = storeToRefs(useCacheStore())

const route = useRoute()

defineProps({
  column: Object,
  title: String
})

const filterStatuses = ref(filterStatusCache)
const options = ref(
  Object.keys(MODEL_STATUS).map((key) => ({
    value: MODEL_STATUS[key],
    id: MODEL_STATUS[key],
    checked: true
  }))
)

onMounted(() => {
  if (!route.query?.filterStatuses) {
    filterStatuses.value = Object.values(MODEL_STATUS)
    router.replace({
      query: {
        ...route.query,
        filterStatuses: Object.values(MODEL_STATUS).join(',')
      }
    })
  }
})

const handleFilter = (status) => {
  let filter_statuses = filterStatuses.value
  console.log(filter_statuses)

  if (filter_statuses.includes(status)) {
    filter_statuses = filter_statuses.filter((s) => s !== status)
  } else {
    filter_statuses.push(status)
  }

  filterStatuses.value = filter_statuses
  options.value = options.value.map((option) => ({
    ...option,
    checked: filterStatuses.value.includes(option.id)
  }))
  setFilterStatusCache(filter_statuses)

  router.replace({
    name: route.name,
    query: {
      ...route.query,
      filterStatuses: filter_statuses.length ? filter_statuses.toString() : ''
    }
  })
}
</script>

<template>
  <div class="flex justify-center items-center space-x-2">
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" size="sm" class="-ml-3 h-8 data-[state=open]:bg-accent">
          <Text type="primary" class="text-secondary">{{ title }}</Text>
          <Icon icon="arrow-down" :size="24" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-fit">
        <div
          v-for="option in options"
          :value="option.value"
          :key="option.id"
          class="grid grid-cols-2 w-[170px] h-10 items-center"
          @click="handleFilter(option.id)"
        >
          <Text class="whitespace-nowrap">{{ option.value }}</Text>
          <div class="flex justify-end">
            <CheckBox :checked="option.checked" class="text-right"></CheckBox>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
