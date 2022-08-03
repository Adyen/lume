# Line chart

Line charts plot data at regular intervals connected by lines from left to right to demonstrate changes in value.

- [Line chart](#line-chart)
  - [Usage](#usage)
    - [Importing](#importing)
    - [Basic use](#basic-use)
  - [API](#api)
    - [Props](#props)
  - [Examples](#examples)
      - [Multiple datasets](#multiple-datasets)

## Usage

### Importing

```ts
import AdvLineChart from '@adv/charts/line';
```

### Basic use

To generate a simple line chart with default settings, simply pass the `data` and `labels` props.

```html
<template>
  <AdvLineChart :data="data" :labels="labels" />
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

## Examples

#### Multiple datasets

```html
<template>
  <AdvLineChart :data="data" :labels="labels" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const data = ref([
    {
      label: 'Toyota',
      color: '01',
      values: [10, 30, 25, 50, 40],
    },
    {
      label: 'Honda',
      color: '02',
      values: [15, 40, 20, 40, 30],
    },
    {
      label: 'Nissan',
      color: '03',
      values: [8, 20, 10, 45, 50],
    },
  ]);

  const labels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May']);
</script>
```
