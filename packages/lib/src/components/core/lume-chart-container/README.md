This component is a wrapper for charts, providing sizing/dimension utilities and the bridge between HTML and SVG contexts.

By detecting resizes, it alerts all other components so that the chart can smoothly re-render.

- [Usage](#usage)
  - [Importing](#importing)
  - [Structure](#structure)
  - [Slots](#slots)
  - [Basic use](#basic-use)
- [API](#api)
  - [Props](#props)
  - [Events](#events)
    - [`click`](#click)
      - [Payload](#payload)
    - [`mouseenter`](#mouseenter)
      - [Payload](#payload-1)
    - [`mouseleave`](#mouseleave)
      - [Payload](#payload-2)
    - [`resize`](#resize)
      - [Payload](#payload-3)

## Usage

### Importing

```ts
import { LumeChartContainer } from '@adyen/lume';
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

You can set up your chart with `lume-chart-container` like so:

```html
<template>
  <lume-chart-container>
    <template #header>
      My chart title
    </template>

    <lume-axis type="x" />
    <lume-axis type="y" />

    <lume-bar-group :data="data" />

    <template #extra>
      <lume-tooltip :data="data" />
    </template>
  </lume-chart>
</template>
```

**Note**: The example above is simplified.

## API

### Props

| Name                    | Type                         | Default      | Description                                                 |
| ----------------------- | ---------------------------- | ------------ | ----------------------------------------------------------- |
| `margins`               | `Margins`                    | `{}`         | Space around the chart.                                     |
| `containerSize`         | `ContainerSize`              | `{}`         | The calculated container size.                              |
| `transparentBackground` | `boolean`                    | `false`      | Controls if the chart should have a transparent background. |
| `noMinSize`             | `boolean`                    | `false`      | Controls if the chart shouldn't have minimum width/height.  |
| `orientation`           | `'vertical' \| 'horizontal'` | `'vertical'` | The chart's orientation.                                    |

### Events

#### `click`

Fired upon clicking on the SVG container.

##### Payload

```ts
p: PointerEvent;
```

#### `mouseenter`

Fired upon the SVG container [mouseenter](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event).

##### Payload

```ts
p: MouseEvent;
```

#### `mouseleave`

Fired upon the SVG container [mouseleave](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event).

##### Payload

```ts
p: MouseEvent; // Native `mouseleave` event data.
```

#### `resize`

Fired when the SVG container receives new dimensions.

##### Payload

```ts
p: {
  width: number;        // The SVG container's width.
  height: number;       // The SVG container's height.
  outerWidth?: number;  // The chart element's width.
  outerHeight?: number; // The chart element's height.
} // ContainerSize
```
