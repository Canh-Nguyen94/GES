<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { hexMenuTopItems, hexMenuBottomItems } from '@constants/landing'

const { t } = useI18n()
</script>

<template>
  <div :class="classes['background']" class="px-10 py-10">
    <div class="hex-container">
      <div :class="classes['honeycomb']">
        <a
          v-for="item in hexMenuTopItems"
          :id="item.id"
          :key="item.id"
          :class="classes['honeycomb-cell']"
          :href="item.to"
          target="_blank"
        >
          <img :class="classes['honeycomb-cell_img']" :src="item.image" :alt="item.name" />
          <p :class="classes['honeycomb-cell_title']" class="text-background leading-7">
            {{ t(item.name) }}
          </p>
        </a>
      </div>
    </div>
    <p class="text-background uppercase mb-2 text-end">Explore</p>
    <h2 class="text-background uppercase text-end">Story Map</h2>
  </div>
</template>
<style module="classes" lang="scss" src="./hexMenu.module.scss"></style>
