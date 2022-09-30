import { Story, Description } from '@storybook/addon-docs';

# Grouped bar chart

Grouped bar chart shows one or more sets of data represented by discrete groups of bars at regular intervals.

<Story id="charts-bar-chart--multiple-datasets" />

## Usage

### Importing

```ts
import { LumeGroupedBarChart } from 'lume/charts';
```

### Basic use

To generate a simple bar chart with default settings, simply pass the `data` and `labels` props.

```html
<template>
  <lume-grouped-bar-chart :data="data" :labels="labels" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const data = ref([
    {
      label: 'My first dataset',
      color: '01',
      values: [10, 30, 20, 50, 40],
    },
    {
      label: 'My second dataset',
      color: '02',
      values: [40, 50, 20, 30, 10],
    },
  ]);

  const labels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May']);
</script>
```

## API

### Props

| Name          | Type                                            | Default         | Description                                                               |
| ------------- | ----------------------------------------------- | --------------- | ------------------------------------------------------------------------- |
| `data`        | `Data`                                          | Required        | The data to plot.                           |
| `labels`      | `Array<string \| number>`                       | Required        | The group of labels to plot the data to.                                  |
| `orientation  | `String`                                        | `'vertical'`    | Must be either 'horizontal' or 'vertical'                                 |
| `xScale`      | `ScaleGenerator \| ScaleBand<string \| number>` | `undefined`     | A d3 scale or a scale generator function to override the default X scale. |
| `yScale`      | `ScaleGenerator \| ScaleLinear<number, number>` | `undefined`     | A d3 scale or a scale generator function to override the default Y scale. |
| `options`     | `Options`                                       | `undefined`     | A set of chart options.                                                   |
| `title`       | `String`                                        | `undefined`     | The chart title.                                                          |

## Examples

### Horizontal orientation

<Story
  id="charts-bar-chart--multiple-datasets"
  args={{ orientation: 'horizontal' }}
/>

```html
<template>
  <lume-grouped-bar-chart :data="data" :labels="labels" :orientation="horizontal" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const data = ref([
    {
      label: 'Toyota',
      color: '01',
      values: [10, 30, 25, null, 50, 40],
    },
    {
      label: 'Honda',
      color: '02',
      values: [15, 40, 20, -10, 40, 30],
    },
    {
      label: 'Nissan',
      color: '03',
      values: [8, 20, 10, 45, 50, 55],
    },
  ]);

  const labels = ref([
    'Jan 2022',
    'Feb 2022',
    'Mar 2022',
    'Apr 2022',
    'May 2022',
    'Jun 2022',
  ]);
</script>
```
