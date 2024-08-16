<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { hexMenuTopItems, hexMenuBottomItems } from '@constants/landing'

const { t } = useI18n()
</script>

<template>
  <div class="bg px-10 py-10">
    <div class="hex-container">
      <div class="hex-row hex-top">
        <div v-for="item in hexMenuTopItems" :id="item.id" :key="item.id" class="hex-cell">
          <a :href="item.to" target="_blank">
            <img :src="item.image" :alt="item.name" />
            <p class="text-background">{{ t(item.name) }}</p>
          </a>
        </div>
      </div>
      <div class="hex-row hex-bottom">
        <div v-for="item in hexMenuBottomItems" :id="item.id" :key="item.id" class="hex-cell">
          <a :href="item.to" target="_blank" @click="console.log('ccc')">
            <img :src="item.image" :alt="item.name" />
            <p class="text-background">{{ t(item.name) }}</p>
          </a>
        </div>
      </div>
    </div>
    <p class="text-background uppercase mb-2">Explore</p>
    <h2 class="text-background uppercase">Story Map</h2>
  </div>
</template>
<style>
.hex-container {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.hex-row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.hex-bottom {
  transform: translateY(-20px);
}
.hex-cell {
  position: relative;
  margin: 0 10px;
  width: 150px;
  height: 150px;
  clip-path: polygon(0% 25%, 50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%);
  background-color: aquamarine;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.5s;
  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;

    overflow: hidden;
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    transition: 0.5s;
  }
  &:after {
    bottom: -25px;
    left: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
  }
}
.hex-cell:hover {
  background-color: darksalmon;
  transform: scale(0.8);
}
.hex-cell img {
  display: block;
  object-fit: cover;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  /* clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); */
  transition: 0.5s;
  z-index: -1;
}
.hex-cell p {
  text-transform: uppercase;
  text-align: center;
}
.bg {
  background: #0f2027;
  background: -webkit-linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
}
</style>
