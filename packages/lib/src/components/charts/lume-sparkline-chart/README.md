# Sparkline chart

Sparkline charts plot data at regular intervals connected by lines from left to right to demonstrate changes in value.
It is meant as an alternative to the regular line chart where it can be displayed in a smaller format without axes.

## Usage

### Importing

```ts
import { LumeSparklineChart } from '@adyen/lume';
```

### Basic use

To generate a simple sparkline chart with default settings, simply pass the `data` and `labels` props.

```html
<template>
  <lume-sparkline-chart
    :data="data"
    :labels="labels"
  />
</template>

<script
  lang="ts"
  setup
>
  import { ref } from 'vue';

  const data = ref([
    {
      label: 'My dataset',
      color: 'violet',
      values: [10, 30, 20, 50, 40],
    },
  ]);
</script>
```

## API

### Props

| Name           | Type      | Default     | Description                                                                                            |
| -------------- | --------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| `data`         | `Data`    | Required    | The data to plot.                                                                                      |
| `options`      | `Options` | `undefined` | A set of chart options.                                                                                |
| `hoveredIndex` | `number`  | `undefined` | The hovered data point index. Can be used to hover programmatically. Set to `-1` to reset hover state. |

### Events

This chart extends the Events API from the `LumeChart` core component.
