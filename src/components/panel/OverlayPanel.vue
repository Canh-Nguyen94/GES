<script setup>
import { X } from 'lucide-vue-next'
import { Transition } from 'vue'
import { onUnmounted } from 'vue'
// import { Teleport } from 'vue'
import { watch } from 'vue'
import { useLayoutStore } from '../../store/layout.store'

defineProps({
  title: { type: String, required: false },
  showFooter: { type: Boolean, required: false },
  isOpen: { type: Boolean, required: false }
})

const emits = defineEmits(['update:modelValue'])
const modelValue = defineModel()

const closePanel = () => {
  emits('update:modelValue', false)
}

watch(modelValue, () => {
  if (modelValue.value === true) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
})

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
})
</script>

<template>
  <!-- <Teleport to="#panel"> -->
  <Transition name="slide-to-left">
    <div v-if="isOpen" class="fixed inset-0 overflow-hidden mt-18 z-50">
      <!-- handle click outside modal to close @click="closePanel"  -->
      <div class="absolute inset-0 bg-opacity bg-opacity-50 transition-opacity"></div>
      <!-- Sidebar Content -->
      <section class="absolute inset-y-0 right-0 md:pl-10 max-w-full flex">
        <div class="w-screen max-w-lg">
          <div class="h-full flex flex-col bg-background z-99 shadow-panel pt-4.5rem pb-2.5rem">
            <!-- Sidebar Header -->
            <div class="flex items-center justify-end pt-4 pr-4">
              <button @click="closePanel">
                <X size="28" class="text-secondary" />
              </button>
            </div>
            <!-- Sidebar Content -->
            <div class="md:mt-3rem mt-1rem px-8 h-full overflow-auto">
              <h1 type="heading" class="leading-none text-2rem font-semibold text-black">
                {{ title }}
              </h1>
              <slot />
            </div>
            <!-- Sidebar Footer -->
            <div class="mt-[1rem] px-1.5rem" v-if="showFooter">
              <slot name="action" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </Transition>
  <!-- </Teleport> -->
</template>

<!-- <style module="classes" lang="scss" src="./OverlayPanel.module.scss"></style> -->
