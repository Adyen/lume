# Stacked bar chart

Stacked bar chart shows one or more sets of data represented by discrete stacks of bars at regular intervals.

## Usage

### Importing

```ts
import { LumeStackedBarChart } from '@adyen/lume';
```

### Basic use

To generate a simple bar chart with default settings, simply pass the `data` and `labels` props.

```html
<template>
  <lume-stacked-bar-chart
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
      color: 'royalblue',
      values: [10, 30, 20, 50, 40],
    },
    {
      label: 'My second dataset',
      color: 'violet',
      values: [40, 50, 20, 30, 10],
    },
  ]);

  const labels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May']);
</script>
```

## API

### Props

| Name         | Type                                            | Default      | Description                                                               |
| ------------ | ----------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| `data`       | `Data`                                          | Required     | The data to plot.                                                         |
| `labels`     | `Array<string \| number>`                       | Required     | The group of labels to plot the data to.                                  |
| `orientation | `String`                                        | `'vertical'` | Must be either 'horizontal' or 'vertical'                                 |
| `xScale`     | `ScaleGenerator \| ScaleBand<string \| number>` | `undefined`  | A d3 scale or a scale generator function to override the default X scale. |
| `yScale`     | `ScaleGenerator \| ScaleLinear<number, number>` | `undefined`  | A d3 scale or a scale generator function to override the default Y scale. |
| `options`    | `Options`                                       | `undefined`  | A set of chart options.                                                   |
| `title`      | `String`                                        | `undefined`  | The chart title.                                                          |
