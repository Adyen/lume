<template>
  <svg
    width="300"
    height="300"
  >
    <LumeBar
      :x="100"
      :y="100"
      :width="100"
      :height="200"
      :class-list="`lume-fill--${Colors.Skyblue}`"
      :is-faded="false"
      transition="height"
    />
  </svg>
</template>

<script setup lang="ts">
import { Colors, LumeBar } from '@adyen/lume';
</script>
