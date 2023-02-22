# Lume chart

The `lume-chart` component is the base component of all charts of this data visualization library. It implements all generic chart features.

It is used internally to build all Lume charts but it can also be used to create new, customized charts, by using `<slot>`s.

- [Lume chart](#lume-chart)
  - [Usage](#usage)
    - [Importing](#importing)
    - [Slots](#slots)
    - [Basic use](#basic-use)
  - [API](#api)
    - [Props](#props)
    - [Chart options](#chart-options)
    - [Slot props](#slot-props)
      - [`controls`](#controls)
      - [`legend`](#legend)
      - [`axes`](#axes)
      - [`groups`](#groups)
      - [`tooltip`](#tooltip)
      - [`tooltip-content`](#tooltip-content)
  - [Examples](#examples)
    - [Custom data group](#custom-data-group)
    - [Custom tooltip element](#custom-tooltip-element)

## Usage

### Importing

```ts
import { LumeChart } from '@adyen/lume';
```

### Slots

Lume chart serves as a base to chart building because it provides `<slot>`s for the different chart elements.

The available slots are:

- `controls` - for chart controls on the top-right of the header
- `legend` - for the chart legend on the top-right of the header, below `controls`
- `axes` - for chart axes
- `groups` - for data groups
- `tooltip` - for the tooltip element (replaces default tooltip)
- `tooltip-content` - for the tooltip content

These slots allow for full customization of how the data is being shown.

All slots except `groups` have fallback content to default to. The `groups` slot **must** have at least 1 element to display data.

### Basic use

The simplest use for `lume-chart` is by providing `data` and `labels` props and a data group inside `groups` slot.

```html
<template>
  <lume-chart
    :data="data"
    :labels="labels"
  >
    <template #groups="props">
      <lume-line-group v-bind="props" />
    </template>
  </lume-chart>
</template>

<script
  lang="ts"
  setup
>
  import { ref } from 'vue';

  const data = ref([
    {
      label: 'My dataset',
      color: 'darkteal',
      values: [10, 30, 20, 50, 40],
    },
  ]);

  const labels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May']);
</script>
```

## API

### Props

| Name          | Type                                            | Default      | Description                                                               |
| ------------- | ----------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| `data`        | `Data`                                          | Required     | The data to plot.                                                         |
| `labels`      | `Array<string \| number>`                       | `undefined`  | The group of labels to plot the data to.                                  |
| `xScale`      | `ScaleGenerator \| ScaleBand<string \| number>` | `undefined`  | A d3 scale or a scale generator function to override the default X scale. |
| `yScale`      | `ScaleGenerator \| ScaleLinear<number, number>` | `undefined`  | A d3 scale or a scale generator function to override the default Y scale. |
| `options`     | `Options`                                       | `undefined`  | A set of chart options.                                                   |
| `orientation` | `'vertical' \| 'horizontal'`                    | `'vertical'` | The chart's orientation.                                                  |
| `title`       | `String`                                        | `undefined`  | The chart title.                                                          |

### Chart options

Interface: `ChartOptions`

| Name                  | Type                      | Description                                                                                 |
| --------------------- | ------------------------- | ------------------------------------------------------------------------------------------- |
| margins               | `Margins`                 | Space around the chart.                                                                     |
| xAxisOptions          | `AxisOptions`             | Set of options for the X axis.                                                              |
| yAxisOptions          | `AxisOptions`             | Set of options for the Y axis.                                                              |
| tooltipOptions        | `TooltipOptions`          | Set of options for the tooltip component.                                                   |
| colorPalette          | `ColorPalette`            | Which color sequence to use for rendering the datasets.                                     |
| startOnZero           | `boolean`                 | Controls if the Y scale should start on `0`. Always `true` for Bar charts.                  |
| withAxes              | `boolean`                 | Displays chart axes.                                                                        |
| withTooltip           | `boolean`                 | Displays the chart tooltip.                                                                 |
| withLegend            | `boolean`                 | Displays the chart legend in the header.                                                    |
| legendPosition        | `'top' \| 'bottom'`       | Where to display the chart legend.                                                          |
| withTransition        | `boolean`                 | Toggles the chart transition animations.                                                    |
| noBaseScales          | `boolean`                 | Controls if `LumeChart` should generate general-purpose scales or not.                      |
| noMinSize             | `boolean`                 | If true, the chart container will not have minimum width/height.                            |
| transparentBackground | `boolean`                 | If true, the `<svg>` container will not have a solid background.                            |
| classList             | `string \| Array<string>` | A class or array of classes to apply to the chart group elements, such as bars, lines, etc. |

### Slot props

#### `controls`

No props.

#### `legend`

| Name   | Type   | Description       |
| ------ | ------ | ----------------- |
| `data` | `Data` | The data to plot. |

#### `axes`

| Name            | Type                                | Description                            |
| --------------- | ----------------------------------- | -------------------------------------- |
| `xScale`        | `Scale`                             | The base X scale.                      |
| `yScale`        | `Scale`                             | The base Y scale.                      |
| `containerSize` | `{ width: number, height: number }` | The chart container size.              |
| `options`       | `Options`                           | A set of chart options.                |
| `hoveredIndex`  | `number`                            | Index of the data point being hovered. |

#### `groups`

| Name           | Type                         | Description                                                                                 |
| -------------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| `data`         | `Data`                       | The data to plot.                                                                           |
| `labels`       | `Array<string \| number>`    | The group of labels to plot the data to.                                                    |
| `options`      | `Options`                    | A set of chart options.                                                                     |
| `orientation`  | `'vertical' \| 'horizontal'` | The chart's orientation.                                                                    |
| `xScale`       | `Scale`                      | The base X scale.                                                                           |
| `yScale`       | `Scale`                      | The base Y scale.                                                                           |
| `hoveredIndex` | `number`                     | Index of the data point being hovered.                                                      |
| `classList`    | `string \| Array<string>`    | A class or array of classes to apply to the chart group elements, such as bars, lines, etc. |

#### `tooltip`

| Name            | Type                      | Description                                    |
| --------------- | ------------------------- | ---------------------------------------------- |
| `opened`        | `boolean`                 | If the tooltip is displayed.                   |
| `targetElement` | `Element`                 | The element that the tooltip will latch on to. |
| `data`          | `Data`                    | The chart data.                                |
| `labels`        | `Array<string \| number>` | The chart labels.                              |
| `withTooltip`   | `boolean`                 | Displays the chart tooltip.                    |
| `hoveredIndex`  | `number`                  | Index of the data point being hovered.         |
| `options`       | `TooltipOptions`          | Set of options for the tooltip component.      |

#### `tooltip-content`

| Name           | Type                      | Description                            |
| -------------- | ------------------------- | -------------------------------------- |
| `data`         | `Data`                    | The chart data.                        |
| `labels`       | `Array<string \| number>` | The chart labels.                      |
| `hoveredIndex` | `number`                  | Index of the data point being hovered. |

## Examples

### Custom data group

```html
<template>
  <lume-chart v-bind="$props">
    <template #groups="props">
      <my-custom-data-group v-bind="props" />
    </template>
  </lume-chart>
</template>
```

### Custom tooltip element

```html
<template>
  <lume-chart v-bind="$props">
    <template #groups="props">
      <lume-bar-group v-bind="props" />
    </template>
    <template #tooltip>
      <my-custom-tooltip />
    </template>
  </lume-chart>
</template>
```
