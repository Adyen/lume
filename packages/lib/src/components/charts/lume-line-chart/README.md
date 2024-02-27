Line charts plot data at regular intervals connected by lines from left to right to demonstrate changes in value.

## Usage

### Importing

```ts
import { LumeLineChart } from '@adyen/lume';
```

### Basic use

To generate a simple line chart with default settings, simply pass the `data` and `labels` props.

```html
<template>
  <lume-line-chart
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
      color: 'skyblue',
      values: [10, 30, 20, 50, 40],
    },
  ]);

  const labels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May']);
</script>
```

## API

### Props

| Name           | Type                                            | Default     | Description                                                                                            |
| -------------- | ----------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| `data`         | `Data`                                          | Required    | The data to plot.                                                                                      |
| `labels`       | `Array<string \| number>`                       | Required    | The group of labels to plot the data to.                                                               |
| `xScale`       | `ScaleGenerator \| ScaleBand<string \| number>` | `undefined` | A d3 scale or a scale generator function to override the default X scale.                              |
| `yScale`       | `ScaleGenerator \| ScaleLinear<number, number>` | `undefined` | A d3 scale or a scale generator function to override the default Y scale.                              |
| `options`      | `Options`                                       | `undefined` | A set of chart options.                                                                                |
| `title`        | `String`                                        | `undefined` | The chart title.                                                                                       |
| `hoveredIndex` | `number`                                        | `undefined` | The hovered data point index. Can be used to hover programmatically. Set to `-1` to reset hover state. |
| `lineWidth`    | `Number`                                        | `undefined` | The width of lines drawn.                                                                              |
| `withPoints`   | `Boolean`                                       | `true`      | Indicator if the chart should render point circles or just lines.                                      |

### Events

This chart extends the Events API from the `LumeChart` core component.
