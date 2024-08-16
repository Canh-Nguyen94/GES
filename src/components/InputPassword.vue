<script setup>
import { ref } from 'vue'
import { Eye, EyeOff, CircleAlert } from 'lucide-vue-next'

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  isError: {
    type: Boolean,
    default: false
  }
})

const model = defineModel({ type: String })
const isShow = ref(false)
</script>

<template>
  <div
    :class="[
      isError ? 'border-destructive' : 'border-secondary-foreground',
      'input-password flex h-[40px] w-full rounded-md border bg-background px-3 py-2 ring-offset-background'
    ]"
  >
    <input
      v-model="model"
      class="outline-none w-full text-sm placeholder:text-secondary-foreground text-primary"
      :type="isShow ? 'text' : 'password'"
      :placeholder="placeholder"
      v-bind="$attrs"
    />
    <CircleAlert :size="16" v-if="isError" class="icon-status font-normal text-destructive" />
    <div v-else-if="model" class="icon-status" @click="isShow = !isShow">
      <Eye v-if="isShow" size="20" class="text-[#666666]" />
      <EyeOff v-else size="20" class="text-[#666666]" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-password {
  position: relative;
  padding-right: 30px;

  .icon-status {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    user-select: none;
  }

  input[type='password']::-ms-reveal,
  input[type='password']::-ms-clear {
    display: none;
  }

  input:-webkit-autofill {
    -webkit-background-clip: text;
  }
}
</style>
