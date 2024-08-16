<script setup>
defineProps({
  label: { type: String, required: false },
  errorMessage: { type: String, required: false },
  required: { type: Boolean, required: false }
})
</script>

<template>
  <div>
    <!-- for blank labels keep the label style use label="&nbsp;"  -->
    <slot name="label">
      <label class="text-xs text-secondary uppercase" :class="classes['label-style']" v-if="label">
        {{ label }} <span :class="classes['required-symbol-style']" v-if="required">*</span>
      </label>
    </slot>
    <slot></slot>
    <slot name="error">
      <span :class="classes['error-style']" v-if="errorMessage">{{ errorMessage }}</span>
    </slot>
  </div>
</template>

<style module="classes" lang="scss" src="./FormControl.module.scss"></style>
