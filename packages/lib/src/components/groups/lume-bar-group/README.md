# Bar group

Bar groups orchestrate all the bars that a bar chart needs to show. This can vary from a list of single bars shown in a single bar chart, to a list of a group of charts, like with the stacked or grouped bar charts.

## Usage

### Importing

```ts
import { LumeBarGroup } from '@adyen/lume';
```

### Basic use

To generate a simple bar group with default settings, simply pass the `data` prop.

```html
<template>
  <lume-bar-group :data="data" />
</template>

<script
  lang="ts"
  setup
>
  import { LumeBarGroup } from '@adyen/lume';
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

| Name           | Type                                                           | Default      | Description                                                                                                               |
| -------------- | -------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `data`         | `Data`                                                         | Required     | The data to plot.                                                                                                         |
| `type`         | `String`                                                       | `null`       | The chart type. Will default to single bar chart when not specified. Otherwise must be either `'grouped'` or `'stacked'`. |
| `options`      | `Options`                                                      | `undefined`  | A set of chart options. Refer to the Chart options in `LumeChart`'s documentation.                                        |
| `orientation`  | `String`                                                       | `'vertical'` | Must be either `'horizontal'` or `'vertical'`                                                                             |
| `xScale`       | `ScaleGenerator` or `ScaleBand<string>` or `ScaleBand<number>` | `null`       | A d3 scale or a scale generator function to override the default X scale.                                                 |
| `yScale`       | `ScaleGenerator` or `ScaleLinear<number, number>`              | `null`       | A d3 scale or a scale generator function to override the default Y scale.                                                 |
| `hoveredIndex` | `Number`                                                       | `-1`         | The index being hovered. Required if you want to enable hovering in the index.                                            |
| `transition`   | `boolean`                                                      | `true`       | Indicating whether or not the bars should animate.                                                                        |
| `classList`    | `string` or `Array<string>`                                    | `[]`         | A class or array of classes to apply to the chart group elements, such as bars, lines, etc.                               |
| `type`         | `String`                                                       | `null`       | The chart type. Will default to single bar chart or not specified. Otherwise must be either `'grouped'` or `'stacked'`.   |

### Events

#### `bar-click`

Fired upon clicking a bar in a Bar chart.

##### Payload

```ts
p: {
  index: number; // Index of the bar that was clicked.
  datasetIndex: number; // Index of the dataset of which the bar that was clicked belongs.
  event: PointerEvent; // Native `click` event data.
}
```
