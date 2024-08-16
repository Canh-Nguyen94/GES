<script setup>
import { ref } from 'vue'
import { watchOnce } from '@vueuse/core'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@common/ui/carousel'
import { Card, CardContent } from '@common/ui/card'

const emblaMainApi = ref()
const emblaThumbnailApi = ref()
const selectedIndex = ref(0)

function onSelect() {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap()
  emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap())
}

function onThumbClick(index) {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return
  emblaMainApi.value.scrollTo(index)
}

watchOnce(emblaMainApi, (emblaMainApi) => {
  if (!emblaMainApi) return

  onSelect()
  emblaMainApi.on('select', onSelect)
  emblaMainApi.on('reInit', onSelect)
})
</script>

<template>
  <div class="w-full sm:w-auto py-5 flex flex-col justify-center items-center bg-revert">
    <h2 class="w-[80%] text-background text-center mb-10 leading-8">
      The ultimate tool for GIS professionals, yet effortlessly intuitive for all. Master your maps
      with ease
    </h2>
    <Carousel class="relative w-[80%]" @init-api="(val) => (emblaMainApi = val)">
      <CarouselContent>
        <CarouselItem v-for="(_, index) in 10" :key="index">
          <div class="p-1">
            <Card>
              <CardContent class="flex h-[300px] items-center justify-center p-6">
                <span class="text-4xl font-semibold">{{ index + 1 }}</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

    <Carousel class="relative w-full max-w-xs" @init-api="(val) => (emblaThumbnailApi = val)">
      <CarouselContent class="flex gap-1 ml-0">
        <CarouselItem
          v-for="(_, index) in 10"
          :key="index"
          class="pl-0 basis-1/4 cursor-pointer"
          @click="onThumbClick(index)"
        >
          <div class="p-1" :class="index === selectedIndex ? '' : 'opacity-50'">
            <Card>
              <CardContent class="flex items-center justify-center">
                <span class="font-semibold">{{ index + 1 }}</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </div>
</template>
<style>
.bg-revert {
  background: #0f2027;
  background: -webkit-linear-gradient(to top, #0f2027, #203a43, #2c5364);
  background: linear-gradient(to top, #0f2027, #203a43, #2c5364);
}
</style>
