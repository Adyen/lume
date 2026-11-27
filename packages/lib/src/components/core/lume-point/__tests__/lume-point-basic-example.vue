<template>
  <svg
    width="300"
    height="300"
  >
    <LumePoint
      :x="150"
      :y="150"
      :color="Colors.Darkteal"
      :radius="4"
      active
    />
  </svg>
</template>

<script setup lang="ts">
import { Colors, LumePoint } from '@adyen/lume';
</script>
