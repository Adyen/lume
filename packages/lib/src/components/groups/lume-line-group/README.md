The Line group component is in charge of transforming data into a line/point representation. It's the component that actually renders each line of each data point.

## Usage

### Importing

```ts
import { LumeLineGroup } from '@adyen/lume';
```

### Basic use

To generate a simple line group with default settings, simply pass the `data` prop.

```html
<template>
  <lume-line-group :data="data" />
</template>

<script
  lang="ts"
  setup
>
  import { LumeLineGroup } from '@adyen/lume';
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

| Name           | Type                                                           | Default     | Description                                                                                 |
| -------------- | -------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| `data`         | `Data`                                                         | Required    | The data to plot.                                                                           |
| `options`      | `Options`                                                      | `undefined` | A set of chart options. Refer to the Chart options in `LumeChart`'s documentation.          |
| `xScale`       | `ScaleGenerator` or `ScaleBand<string>` or `ScaleBand<number>` | `null`      | A d3 scale or a scale generator function to override the default X scale.                   |
| `yScale`       | `ScaleGenerator` or `ScaleLinear<number, number>`              | `null`      | A d3 scale or a scale generator function to override the default Y scale.                   |
| `hoveredIndex` | `Number`                                                       | `-1`        | The index being hovered. Required if you want to enable hovering in the index.              |
| `transition`   | `boolean`                                                      | `true`      | Indicating whether or not this line should animate.                                         |
| `classList`    | `string` or `Array<string>`                                    | `[]`        | A class or array of classes to apply to the chart group elements, such as bars, lines, etc. |
| `withPoints`   | `boolean`                                                      | `true`      | An indicator if the group should render points or just the lines.                           |

### Events

#### `line-click`

Fired upon clicking a line.

##### Payload

```ts
p: {
  index: number; // Index of the line that was clicked.
  datasetIndex: number; // Index of the dataset of which the line that was clicked belongs.
  event: PointerEvent; // Native `click` event data.
}
```

#### `point-click`

Fired upon clicking a point.

##### Payload

```ts
p: {
  index: number; // Index of the point that was clicked.
  datasetIndex: number; // Index of the dataset of which the point that was clicked belongs.
  event: PointerEvent; // Native `click` event data.
}
```
