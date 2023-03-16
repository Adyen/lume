# Overlay group

Overlay groups orchestrate all the overlay rectangles that a chart needs to show. These will be the hoverable surfaces that will highlight individual values or value sets in the chart.

## Usage

### Importing

```ts
import { LumeOverlayGroup } from '@adyen/lume';
```

### Basic use

To generate a simple overlay group with default settings, simply pass the `data` prop.

```html
<template>
  <lume-overlay-group :data="data" />
</template>

<script
  lang="ts"
  setup
>
  import { LumeOverlayGroup } from '@adyen/lume';
  import { ref } from 'vue';

  const data = ref([
    {
      values: [10, 30, 20, 50, 40],
    },
  ]);
</script>
```

## API

### Props

| Name          | Type                                                           | Default      | Description                                                               |
| ------------- | -------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| `data`        | `Data`                                                         | Required     | The data to plot.                                                         |
| `orientation` | `String`                                                       | `'vertical'` | Must be either `'horizontal'` or `'vertical'`                             |
| `xScale`      | `ScaleGenerator` or `ScaleBand<string>` or `ScaleBand<number>` | `null`       | A d3 scale or a scale generator function to override the default X scale. |
| `yScale`      | `ScaleGenerator` or `ScaleLinear<number, number>`              | `null`       | A d3 scale or a scale generator function to override the default Y scale. |
