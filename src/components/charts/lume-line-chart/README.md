import { Story, Description } from '@storybook/addon-docs';

# Line chart

Line charts plot data at regular intervals connected by lines from left to right to demonstrate changes in value.

<Story id="charts-line-chart--basic" />

## Usage

### Importing

```ts
import { LumeLineChart } from 'lume/charts';
```

### Basic use

To generate a simple line chart with default settings, simply pass the `data` and `labels` props.

```html
<template>
  <lume-line-chart :data="data" :labels="labels" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const data = ref([
    {
      label: 'My dataset',
      color: '01',
      values: [10, 30, 20, 50, 40],
    },
  ]);

  const labels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May']);
</script>
```

## API

### Props

| Name      | Type                                            | Default     | Description                                                               |
| --------- | ----------------------------------------------- | ----------- | ------------------------------------------------------------------------- |
| `data`    | `Data`                                          | Required    | The data to plot.                                                         |
| `labels`  | `Array<string \| number>`                       | Required    | The group of labels to plot the data to.                                  |
| `xScale`  | `ScaleGenerator \| ScaleBand<string \| number>` | `undefined` | A d3 scale or a scale generator function to override the default X scale. |
| `yScale`  | `ScaleGenerator \| ScaleLinear<number, number>` | `undefined` | A d3 scale or a scale generator function to override the default Y scale. |
| `options` | `Options`                                       | `undefined` | A set of chart options.                                                   |
| `title`   | `String`                                        | `undefined` | The chart title.                                                          |

## Examples

### Multiple datasets

<Story
  id="charts-line-chart--multiple-datasets"
  args={{ dataset: 'Multiple' }}
/>

```html
<template>
  <lume-line-chart :data="data" :labels="labels" />
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
