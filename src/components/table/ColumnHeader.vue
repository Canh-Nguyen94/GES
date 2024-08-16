<script setup>
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-vue-next'

import { Button } from '@common/ui/button'
import Icon from '@components/Icon.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@common/ui/dropdown-menu'
import Text from '@components/text/Text.vue'
import { cn } from '@utils/ui-shadcn.util'
import router from '@router'
import { useRoute } from 'vue-router'

const route = useRoute()

defineProps({
  column: Object,
  title: String
})

const toggleSorting = (column, value) => {
  column.toggleSorting(value)

  router.replace({
    name: route.name,
    query: {
      ...route.query,
      sortBy: column.id,
      orderBy: value ? 'desc' : 'asc'
    }
  })
}

const clearSorting = (column) => {
  column.clearSorting()
  router.replace({
    ...route.query,
    name: route.name,
    query: {}
  })
}
</script>

<template>
  <div v-if="column.getCanSort()" class="flex items-center space-x-2">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="sm" class="-ml-3 h-8 data-[state=open]:bg-accent">
          <Text type="primary" class="text-secondary">{{ title }}</Text>
          <ChevronDown v-if="column.getIsSorted() === 'desc'" class="ml-2 h-4 w-4" />
          <ChevronUp v-else-if="column.getIsSorted() === 'asc'" class="ml-2 h-4 w-4" />
          <Icon v-else icon="up-down" :size="18" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem @click="toggleSorting(column, false)">
          <ChevronUp class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          <Text>asc</Text>
        </DropdownMenuItem>
        <DropdownMenuItem @click="toggleSorting(column, true)">
          <ChevronDown class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          <Text>desc</Text>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="clearSorting(column)">
          <ChevronsUpDown class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          <Text>none</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <Text
    v-else
    as="div"
    size="lg"
    :class="cn('whitespace-nowrap', $attrs.class)"
    type="primary"
    class="text-secondary"
  >
    {{ title }}
  </Text>
</template>
