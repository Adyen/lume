# Chart Container

This component is a wrapper for charts, providing sizing/dimension utilities and the bridge between HTML and SVG contexts.

By detecting resizes, it alerts all other components so that the chart can smoothly re-render.

- [Chart Container](#chart-container)
  - [Usage](#usage)
    - [Importing](#importing)
    - [Structure](#structure)
    - [Slots](#slots)
    - [Basic use](#basic-use)
  - [API](#api)
    - [Props](#props)

## Usage

### Importing

```ts
import { AdvChartContainer } from 'adv/core';
```

### Structure

The chart container is composed by an HTML wrapper - containing structural [slots](#slots) - and an SVG element where the default slotted content goes.

### Slots

The available slots are:

- Default - for all chart elements, such as axes and data groups
- `header` - for chart titles, legend and controls
- `footer` - for any contextual information
- `extra` - for any external stuff, such as a tooltip

### Basic use

You can set up your chart with `adv-chart-container` like so:

```html
<template>
  <adv-chart-container>
    <template #header>
      My chart title
    </template>

    <adv-axis type="x" />
    <adv-axis type="y" />

    <adv-bar-group :data="data" />

    <template #extra>
      <adv-tooltip :data="data" />
    </template>
  </adv-chart>
</template>
```

**Note**: The example above is simplified.

## API

### Props

| Name                    | Type            | Default | Description                                                 |
| ----------------------- | --------------- | ------- | ----------------------------------------------------------- |
| `margins`               | `Margins`       | `{}`    | Space around the chart.                                     |
| `containerSize`         | `ContainerSize` | `{}`    | The calculated container size.                              |
| `transparentBackground` | `boolean`       | `false` | Controls if the chart should have a transparent background. |
| `noMinSize`             | `boolean`       | `false` | Controls if the chart shouldn't have minimum width/height.  |