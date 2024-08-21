<script setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import Australia from './Australia.vue'
import Malaysia from './Malaysia.vue'
import Others from './Others.vue'

const { t } = useI18n()
const tabs = [
  {
    id: 1,
    tab: Malaysia,
    name: 'Malaysia',
    image: ''
  },
  {
    id: 2,
    tab: Australia,
    name: 'Australia',
    image: ''
  },
  {
    id: 1,
    tab: Others,
    name: 'Others',
    image: ''
  }
]

const currentTab = ref({
  id: 2,
  name: Australia,
  image: ''
})
</script>

<template>
  <div class="demo bg">
    <div class="tab-container">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab', tab.name, { active: currentTab.name === tab.name }]"
        @click="currentTab = tab"
      >
        {{ tab.name }}
      </div>
    </div>

    <component :is="currentTab.tab" class="bg"></component>
  </div>
</template>

<style scoped>
.demo {
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 30px;
  margin-top: 1em;
  margin-bottom: 40px;
  user-select: none;
  overflow-x: auto;
}

.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.tab:hover {
  background: #e0e0e0;
}
.tab.active {
  background-color: #d6bb59;
}

.tab-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #1a1a1a; /* Dark background */
  height: 100px;
  position: relative;
  overflow: hidden;
}

.tab {
  flex: 1;
  text-align: center;
  line-height: 100px; /* Vertically center text */
  color: white;
  font-family: 'Arial', sans-serif;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  z-index: 2; /* Make sure text is on top */
  background-color: #1a1a1a;
}

.tab-container::before,
.tab-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: white;
  z-index: 1;
}

.tab-container::before {
  transform: skew(-20deg);
  left: -20%;
}

.tab-container::after {
  transform: skew(20deg);
  right: -20%;
}

.tab-container .tab + .tab {
  border-left: 1px solid white;
}

.bg {
  z-index: -1;
  background: #0f2027;
  background: -webkit-linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
}
</style>
