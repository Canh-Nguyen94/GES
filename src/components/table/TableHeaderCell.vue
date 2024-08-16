<script setup>
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-vue-next'

import { Button } from '@common/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@common/ui/dropdown-menu'
import Text from '@components/text/Text.vue'
import { cn } from '@utils/ui-shadcn.util'

defineProps({
  column: Object,
  title: String
})
</script>

<template>
  <div v-if="column.getCanSort()" class="'flex items-center space-x-2'">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="sm" class="-ml-3 h-8 data-[state=open]:bg-accent">
          <Text type="primary">{{ title }}</Text>
          <ChevronDown v-if="column.getIsSorted() === 'desc'" class="ml-2 h-4 w-4" />
          <ChevronUp v-else-if="column.getIsSorted() === 'asc'" class="ml-2 h-4 w-4" />
          <ChevronsUpDown v-else class="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem @click="column.toggleSorting(false)">
          <ChevronUp class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          <Text>{{ $t('common.header_sort.asc') }}</Text>
        </DropdownMenuItem>
        <DropdownMenuItem @click="column.toggleSorting(true)">
          <ChevronDown class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          <Text>{{ $t('common.header_sort.desc') }}</Text>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="column.clearSorting()">
          <ChevronsUpDown class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          <Text>{{ $t('common.header_sort.none') }}</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <Text v-else as="div" size="lg" :class="cn('whitespace-nowrap', $attrs.class)" type="primary">
    {{ title }}
  </Text>
</template>
