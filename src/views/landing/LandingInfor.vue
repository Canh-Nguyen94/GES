<script setup>
import { useI18n } from 'vue-i18n'

import envelope1 from '@assets/images/envelope1.png'
import envelope from '@assets/images/envelope.png'

const { t } = useI18n()
</script>

<template>
  <div class="w-full grid grid-cols-2 gap-2 pt-2 h-[530px] bg">
    <div class="relative h-min">
      <img :src="envelope1" class="absolute left-[150px]" />
      <img :src="envelope" class="absolute left-[60px] top-[170px]" />
      <img
        :src="envelope"
        class="absolute scale-75 left-[430px] top-[170px] -translate-y-10 -translate-x-20"
      />
    </div>

    <div class="flex flex-col gap-4 items-center py-11 px-20">
      <p class="p-4 rounded-[15px] text-lg leading-6 outline-none bg-[#9DB2BF] text-background">
        Bridging conventional engineering data through 2D & 3D visualization
      </p>
      <p class="text-background">
        We specialize in developing innovative GIS tools for the engineering and construction
        industry, leveraging advanced geospatial technology to enhance efficiency and tackle
        societal challenges head-on. Our mission is to simplify complex technology and improve lives
        by providing intuitive solutions to industry professionals.
      </p>
      <p class="text-background">
        For instance, with labor shortages impacting many sectors, including engineering and
        construction, optimizing operational efficiency is crucial. Our goal is to streamline
        workflows with user-friendly tools that harness the power of BIM and CAD data, making
        project management and execution easier than ever before.
      </p>
    </div>
  </div>
  <h2 class="uppercase text-center text-background py-6 px-10 bg-revert">
    TRANSFORMING ENGINEERING & CONSTRUCTION TO DIGITAL MAPS
  </h2>
</template>

<style scoped>
.double-size {
  transform: scale(2);
  transform-origin: top left;
}
.bg {
  background: #0f2027;
  background: -webkit-linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
}
.bg-revert {
  background: #0f2027;
  background: -webkit-linear-gradient(to top, #0f2027, #203a43, #2c5364);
  background: linear-gradient(to top, #0f2027, #203a43, #2c5364);
}
</style>
