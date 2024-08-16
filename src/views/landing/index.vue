<script setup>
import LandingNav from './LandingNav.vue'
import LandingGlobe from './globe/LandingGlobe.vue'
import HexMenu from './hex-menu/HexMenu.vue'
import LandingInfor from './LandingInfor.vue'
import ThreeGlobe from './globe/ThreeGlobe.vue'
import LandingFAQs from './LandingFAQs.vue'
import LandingSlider from './LandingSlider.vue'
import LandingFooter from './LandingFooter.vue'
</script>
<template>
  <div class="h-[100vh] overflow-y-scroll">
    <LandingNav />
    <!-- <LandingGlobe /> -->
    <ThreeGlobe />
    <div class="relative">
      <div class="px-10 absolute top-[-200px]">
        <h1 class="text-background mb-4">vertex</h1>
        <h4 class="text-background mb-4">Leveraging GIS technology</h4>
        <h4 class="text-background mb-4">
          to support BIM & CAD data for construction & engineering
        </h4>
      </div>
      <LandingInfor />
      <HexMenu />
      <LandingSlider />
      <LandingFAQs />
    </div>
    <LandingFooter />
  </div>
</template>
<style scoped></style>
