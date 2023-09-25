# Grouped bar chart

Grouped bar chart shows one or more sets of data represented by discrete groups of bars at regular intervals.

## Usage

### Importing

```ts
import { LumeGroupedBarChart } from '@adyen/lume';
```

### Basic use

To generate a simple bar chart with default settings, simply pass the `data` and `labels` props.

```html
<template>
  <lume-grouped-bar-chart
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
      label: 'My first dataset',
      color: 'skyblue',
      values: [10, 30, 20, 50, 40],
    },
    {
      label: 'My second dataset',
      color: 'royalblue',
      values: [40, 50, 20, 30, 10],
    },
  ]);

  const labels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May']);
</script>
```

## API

### Props

| Name           | Type                                            | Default      | Description                                                                                            |
| -------------- | ----------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------ |
| `data`         | `Data`                                          | Required     | The data to plot.                                                                                      |
| `labels`       | `Array<string \| number>`                       | Required     | The group of labels to plot the data to.                                                               |
| `orientation   | `String`                                        | `'vertical'` | Must be either 'horizontal' or 'vertical'                                                              |
| `xScale`       | `ScaleGenerator \| ScaleBand<string \| number>` | `undefined`  | A d3 scale or a scale generator function to override the default X scale.                              |
| `yScale`       | `ScaleGenerator \| ScaleLinear<number, number>` | `undefined`  | A d3 scale or a scale generator function to override the default Y scale.                              |
| `options`      | `Options`                                       | `undefined`  | A set of chart options.                                                                                |
| `title`        | `String`                                        | `undefined`  | The chart title.                                                                                       |
| `hoveredIndex` | `number`                                        | `undefined`  | The hovered data point index. Can be used to hover programmatically. Set to `-1` to reset hover state. |

### Events

This chart extends the Events API from the `LumeChart` core component.
