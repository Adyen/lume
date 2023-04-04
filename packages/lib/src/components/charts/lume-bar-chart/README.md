# Bar chart

Bar charts plot data at regular intervals represented by bars from either left to right or top to bottom to demonstrate changes in value. The `LumeBarChart` component can be regarded as a broker component for the different types of bar chart - single, stacked and grouped.

## Usage

### Importing

```ts
import { LumeBarChart } from '@adyen/lume';
```

### Basic use

To generate a simple bar chart with default settings, simply pass the `data` and `labels` props. If you have more than one dataset, be sure to pass `type` as well, with either `'grouped'` or `'stacked'` as a value.

```html
<template>
  <lume-bar-chart
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
      color: 'royalblue',
      values: [10, 30, 20, 50, 40],
    },
  ]);

  const labels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May']);
</script>
```

## API

### Props

| Name          | Type                                                           | Default      | Description                                                                                                                                                                             |
| ------------- | -------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`        | `String`                                                       | null         | The chart type. Will default to single bar chart or not specified. Otherwise must be either `'grouped'` to generate a grouped bar chart or `'stacked'` to generate a stacked bar chart. |
| `orientation` | `String`                                                       | `'vertical'` | Must be either `'horizontal'` or `'vertical'`                                                                                                                                           |
| `data`        | `Data`                                                         | Required     | The data to plot.                                                                                                                                                                       |
| `labels`      | `Array<string>` or `Array<number>`                             | Required     | The group of labels to plot the data to.                                                                                                                                                |
| `xScale`      | `ScaleGenerator` or `ScaleBand<string>` or `ScaleBand<number>` | `undefined`  | A d3 scale or a scale generator function to override the default X scale.                                                                                                               |
| `yScale`      | `ScaleGenerator` or `ScaleLinear<number, number>`              | `undefined`  | A d3 scale or a scale generator function to override the default Y scale.                                                                                                               |
| `options`     | `Options`                                                      | `undefined`  | A set of chart options.                                                                                                                                                                 |
| `title`       | `String`                                                       | `undefined`  | The chart title.                                                                                                                                                                        |

### Events

This chart extends the Events API from the `LumeChart` core component.
