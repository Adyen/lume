# Adv chart

The `adv-chart` component is the base component of all charts of this data visualization library. It implements all generic chart features.

It is used internally to build all Adv charts but it can also be used to create new, customized charts, by using `<slot>`s.

- [Adv chart](#adv-chart)
  - [Usage](#usage)
    - [Importing](#importing)
    - [Slots](#slots)
    - [Basic use](#basic-use)
  - [API](#api)
    - [Props](#props)
    - [Slot props](#slot-props)
      - [`axes`](#axes)
      - [`groups`](#groups)
      - [`tooltip`](#tooltip)
  - [Examples](#examples)
    - [Custom data group](#custom-data-group)
    - [Custom tooltip element](#custom-tooltip-element)

## Usage

### Importing

```ts
import AdvChart from '@adv/core/chart';
```

### Slots

Adv chart serves as a base to chart building because it provides `<slot>`s for the different chart elements.

The available slots are:

- `axes` - for the chart axes
- `groups` - for the data groups
- `tooltip` - for the tooltip element

These slots allow for full customization of how the data is being shown.

All slots except `groups` have fallback content to default to. The `groups` slot **must** have at least 1 element to display data.

### Basic use

The simplest use for `adv-chart` is by providing `data` and `labels` props and a data group inside `groups` slot.

```html
<template>
  <adv-chart :data="data" :labels="labels">
    <template #groups="props">
      <adv-line-group v-bind="props" />
    </template>
  </adv-chart>
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

| Name          | Type                                            | Default      | Description                                                               |
| ------------- | ----------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| `data`        | `Data`                                          | Required     | The data to plot.                                                         |
| `labels`      | `Array<string \| number>`                       | Required     | The group of labels to plot the data to.                                  |
| `xScale`      | `ScaleGenerator \| ScaleBand<string \| number>` | `undefined`  | A d3 scale or a scale generator function to override the default X scale. |
| `yScale`      | `ScaleGenerator \| ScaleLinear<number, number>` | `undefined`  | A d3 scale or a scale generator function to override the default Y scale. |
| `options`     | `Options`                                       | `undefined`  | A set of chart options.                                                   |
| `orientation` | `'vertical' \| 'horizontal'`                    | `'vertical'` | The chart's orientation.                                                  |
| `title`       | `String`                                        | `undefined`  | The chart title.                                                          |

### Slot props

#### `axes`

| Name            | Type                                | Description                            |
| --------------- | ----------------------------------- | -------------------------------------- |
| `xScale`        | `Scale`                             | The base X scale.                      |
| `yScale`        | `Scale`                             | The base Y scale.                      |
| `containerSize` | `{ width: number, height: number }` | The chart container size.              |
| `options`       | `Options`                           | A set of chart options.                |
| `hoveredIndex`  | `number`                            | Index of the data point being hovered. |

#### `groups`

| Name           | Type                         | Description                              |
| -------------- | ---------------------------- | ---------------------------------------- |
| `data`         | `Data`                       | The data to plot.                        |
| `labels`       | `Array<string \| number>`    | The group of labels to plot the data to. |
| `orientation`  | `'vertical' \| 'horizontal'` | The chart's orientation.                 |
| `xScale`       | `Scale`                      | The base X scale.                        |
| `yScale`       | `Scale`                      | The base Y scale.                        |
| `hoveredIndex` | `number`                     | Index of the data point being hovered.   |

#### `tooltip`

| Name | Type | Description |
| ---- | ---- | ----------- |

## Examples

### Custom data group

```html
<template>
  <adv-chart v-bind="$props">
    <template #groups="props">
      <my-custom-data-group v-bind="props" />
    </template>
  </adv-chart>
</template>
```

### Custom tooltip element

```html
<template>
  <adv-chart v-bind="$props">
    <template #groups="props">
      <adv-bar-group v-bind="props" />
    </template>
    <template #tooltip>
      <my-custom-tooltip />
    </template>
  </adv-chart>
</template>
```
