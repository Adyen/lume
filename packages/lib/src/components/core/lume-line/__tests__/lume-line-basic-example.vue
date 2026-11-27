<template>
  <svg
    width="300"
    height="300"
  >
    <LumeLine
      :width="2"
      :color="Colors.Royalblue"
      :path-definition="pathDefinition"
      :dashed="false"
    />
  </svg>
</template>

<script setup lang="ts">
import { Colors, LumeLine } from '@adyen/lume';

const pathDefinition = 'M50,250 L250,50';
</script>
