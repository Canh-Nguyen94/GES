<script setup>
import { ref, onMounted } from 'vue'
import createGlobe from 'cobe'
import { useWindowSize } from '@vueuse/core'

const el = ref()
const phi = ref(0)
const { width, height } = useWindowSize()
onMounted(() => {
  const globe = createGlobe(el.value, {
    devicePixelRatio: width / height,
    width: 500,
    height: 500,
    phi: 0,
    theta: 0,
    dark: 1,
    diffuse: 1.2,
    mapSamples: 16000,
    mapBrightness: 6,
    baseColor: [0.3, 0.3, 0.3],
    markerColor: [0.1, 0.8, 1],
    glowColor: [1, 1, 1],
    markers: [
      // longitude latitude
      { location: [37.7595, -122.4367], size: 0.03 },
      { location: [16.06778, 108.22083], size: 0.03 },
      { location: [40.7128, -74.006], size: 0.1 }
    ],
    onRender: (state) => {
      // Called on every animation frame.
      // `state` will be an empty object, return updated params.
      state.phi = phi.value
      phi.value += 0.002
    }
  })
})
</script>

<template>
  <canvas class="w-[600px] h-[600px] text-center" ref="el"></canvas>
</template>

<style></style>
