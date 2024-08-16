<script setup>
import { Slash } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@common/ui/breadcrumb'

const props = defineProps({
  urlContainer: { type: Array, required: false }
})
</script>

<template>
  <Breadcrumb class="my-5">
    <BreadcrumbList>
      <BreadcrumbItem v-for="(item, index) in urlContainer" :key="index">
        <BreadcrumbLink class="hover:text-[black]" :href="item.link">{{
          item.name
        }}</BreadcrumbLink>
        <BreadcrumbSeparator v-if="index < urlContainer.length - 1">
          <span>/</span>
        </BreadcrumbSeparator>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
