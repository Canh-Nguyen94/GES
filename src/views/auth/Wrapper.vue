<script setup>
import Icon from '@components/Icon.vue'
</script>

<template>
  <div class="w-[100%] max-w-full max-h-full relative flex items-center justify-center main-bg">
    <div class="w-[60%] max-w-full h-screen relative flex flex-col items-center pt-[150px]">
      <div class="z-99 flex flex-col justify-center items-center">
        <Icon icon="logo-auth" />
        <Icon icon="bimar-auth" />
      </div>
      <img
        src="@assets/images/auth-engineer.png"
        class="absolute bottom-[-144px] left-[-80px] max-h-[80vh]"
        alt=""
      />
    </div>
    <div class="w-[40%] flex justify-center min-w-[520px] max-h-full">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style>
.main-bg {
  background-image: url('../../assets/images/auth-background.png');
  background-position: center;
  background-size: cover;
}

.custom-box {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}
</style>
