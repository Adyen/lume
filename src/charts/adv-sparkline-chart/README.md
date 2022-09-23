import { Story, Description } from '@storybook/addon-docs';

# Sparkline chart

Sparkline charts plot data at regular intervals connected by lines from left to right to demonstrate changes in value.
It is meant as an alternative to the regular line chart where it can be displayed in a smaller format without axes.

<Story id="charts-sparkline-chart--basic" />

## Usage

### Importing

```ts
import { AdvSparklineChart } from 'adv/charts';
```

### Basic use

To generate a simple sparkline chart with default settings, simply pass the `data` and `labels` props.

```html
<template>
  <adv-sparkline-chart :data="data" :labels="labels" />
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
</script>
```

## API

### Props

| Name      | Type                                            | Default     | Description                                                               |
| --------- | ----------------------------------------------- | ----------- | ------------------------------------------------------------------------- |
| `data`    | `Data`                                          | Required    | The data to plot.                                                         |
| `options` | `Options`                                       | `undefined` | A set of chart options.                                                   |

## Examples

### With null values

<Story
    id="charts-sparkline-chart--basic"
    args={{ dataset: 'NullValues' }}
/>

```html
<script lang="ts" setup>
  import AdvSparklineChart from '@adv/charts/sparkline';
  import { ref } from 'vue';

  const data = ref([
    {
      values: [30, null, 40, 50, null, null, 60, 20, 10, null],
      color: '03',
      legend: 'Trend',
    },
  ]);
</script>

<template>
  <adv-sparkline-chart :data="data" :labels="labels" />
</template>
```

### With negative values

<Story
    id="charts-sparkline-chart--basic"
    args={{ dataset: 'NegativeValues' }}
/>

```html
<script lang="ts" setup>
  import AdvSparklineChart from '@adv/charts/sparkline';
  import { ref } from 'vue';

  const data = ref([
    {
      values: [10, 15, 8, -4, -1, 4, 20],
      color: '09',
      legend: 'Trend',
    },
  ]);
</script>

<template>
  <adv-sparkline-chart :data="data" :labels="labels" />
</template>
```
