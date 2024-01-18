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
    - [Margins](#margins)
    - [Slot props](#slot-props)
      - [`controls`](#controls)
      - [`legend`](#legend)
      - [`axes`](#axes)
      - [`groups`](#groups)
      - [`tooltip`](#tooltip)
      - [`tooltip-content`](#tooltip-content)
    - [Events](#events)
      - [`axis-click`](#axis-click)
        - [Payload](#payload)
      - [`axis-mouseenter`](#axis-mouseenter)
        - [Payload](#payload-1)
      - [`axis-mouseleave`](#axis-mouseleave)
        - [Payload](#payload-2)
      - [`bar-click`](#bar-click)
        - [Payload](#payload-3)
      - [`chart-click`](#chart-click)
        - [Payload](#payload-4)
      - [`chart-mouseenter`](#chart-mouseenter)
        - [Payload](#payload-5)
      - [`chart-mouseleave`](#chart-mouseleave)
        - [Payload](#payload-6)
      - [`data-changed`](#data-changed)
        - [Payload](#payload-7)
      - [`labels-changed`](#labels-changed)
        - [Payload](#payload-8)
      - [`legend-click`](#legend-click)
        - [Payload](#payload-9)
      - [`legend-mouseenter`](#legend-mouseenter)
        - [Payload](#payload-10)
      - [`mouseleave`](#mouseleave)
        - [Payload](#payload-11)
      - [`line-click`](#line-click)
        - [Payload](#payload-12)
      - [`point-click`](#point-click)
        - [Payload](#payload-13)
      - [`rendered`](#rendered)
        - [Payload](#payload-14)
      - [`resize`](#resize)
        - [Payload](#payload-15)
      - [`tooltip-opened`](#tooltip-opened)
        - [Payload](#payload-16)
      - [`tooltip-moved`](#tooltip-moved)
        - [Payload](#payload-17)
      - [`tooltip-closed`](#tooltip-closed)
        - [Payload](#payload-18)
      - [`node-click`](#node-click)
        - [Payload](#payload-19)
      - [`node-mouseenter`](#node-mouseenter)
        - [Payload](#payload-20)
      - [`node-mouseleave`](#node-mouseleave)
        - [Payload](#payload-21)
      - [`link-click`](#link-click)
        - [Payload](#payload-22)
      - [`link-mouseenter`](#link-mouseenter)
        - [Payload](#payload-23)
      - [`link-mouseleave`](#link-mouseleave)
        - [Payload](#payload-24)
      - [`hovered-index-changed`](#hovered-index-changed)
        - [Payload](#payload-25)
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

| Name                  | Type                      | Description                                                                                             |
| --------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------- |
| margins               | `Margins \| "auto"`       | Space around the chart. If provided with "auto", calculates margins according to the axis labels' size. |
| xAxisOptions          | `AxisOptions`             | Set of options for the X axis.                                                                          |
| yAxisOptions          | `AxisOptions`             | Set of options for the Y axis.                                                                          |
| tooltipOptions        | `TooltipOptions`          | Set of options for the tooltip component.                                                               |
| colorPalette          | `ColorPalette`            | Which color sequence to use for rendering the datasets.                                                 |
| startOnZero           | `boolean`                 | Controls if the Y scale should start on `0`. Always `true` for Bar charts.                              |
| withAxes              | `boolean`                 | Displays chart axes.                                                                                    |
| withTooltip           | `boolean`                 | Displays the chart tooltip.                                                                             |
| withLegend            | `boolean`                 | Displays the chart legend in the header.                                                                |
| legendPosition        | `'top' \| 'bottom'`       | Where to display the chart legend.                                                                      |
| withTransition        | `boolean`                 | Toggles the chart transition animations.                                                                |
| noBaseScales          | `boolean`                 | Controls if `LumeChart` should generate general-purpose scales or not.                                  |
| noMinSize             | `boolean`                 | If true, the chart container will not have minimum width/height.                                        |
| transparentBackground | `boolean`                 | If true, the `<svg>` container will not have a solid background.                                        |
| classList             | `string \| Array<string>` | A class or array of classes to apply to the chart group elements, such as bars, lines, etc.             |

### Margins

Interface: `Margins`

| Name   | Type               | Description         |
| ------ | ------------------ | ------------------- |
| top    | `number \| "auto"` | Top margin size.    |
| right  | `number \| "auto"` | Right margin size.  |
| bottom | `number \| "auto"` | Bottom margin size. |
| left   | `number \| "auto"` | Left margin size.   |

> **Note:** If any of the values above is "auto", it will be calculated according to the axis labels' size.

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

| Name            | Type                      | Description                                                                                                                        |
| --------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `opened`        | `boolean`                 | If the tooltip is displayed.                                                                                                       |
| `targetElement` | `Element`                 | The element that the tooltip will latch on to.                                                                                     |
| `data`          | `Data`                    | The chart data.                                                                                                                    |
| `labels`        | `Array<string \| number>` | The chart labels.                                                                                                                  |
| `title`         | `string`                  | The tooltip title.                                                                                                                 |
| `items`         | `Array<TooltipItem>`      | List of items to render in the tooltip.                                                                                            |
| `position`      | `string`                  | The tooltip placement relative to the data point. Full list of options [here](https://popper.js.org/docs/v2/constructors/#options) |
| `withTooltip`   | `boolean`                 | Displays the chart tooltip.                                                                                                        |
| `hoveredIndex`  | `number`                  | Index of the data point being hovered.                                                                                             |
| `options`       | `TooltipOptions`          | Set of options for the tooltip component.                                                                                          |

**Note**: Whenever a consumer overrides the `tooltip` slot in the chart and renders tooltip by themselves - then they have to intimate us when the tooltip is hovered in/out. This has to be done only when the consumer has enabled the pointer events in the tooltip.

This is necessary so that the lume chart is aware when the user has moved inside the tooltip and when was it exited.

`tooltip` slot exposes the props - `handleMouseEnter` and `handleMouseLeave`.

`handleMouseLeave` to be called when the tooltip is hovered in
`handleMouseLeave` to be called when the tooltip is hovered out

```html
<lume-line-chart v-bind="args">
  <template
    #tooltip="{ opened, data, hoveredIndex, targetElement, handleMouseEnter, handleMouseLeave }"
  >
    <lume-tooltip
      :opened="opened"
      ...
      :options="{ withPointerEvents: true }"
      @tooltip-mouseenter="handleMouseEnter"
      @tooltip-mouseleave="handleMouseLeave"
    />
  </template>
  ...
</lume-line-chart>
```

#### `tooltip-content`

| Name           | Type                      | Description                            |
| -------------- | ------------------------- | -------------------------------------- |
| `data`         | `Data`                    | The chart data.                        |
| `labels`       | `Array<string \| number>` | The chart labels.                      |
| `hoveredIndex` | `number`                  | Index of the data point being hovered. |

### Events

#### `axis-click`

Fired upon clicking a chart axis.

##### Payload

```ts
p: {
  index: number | null; // Index of the axis tick that was clicked.
  value?: number | string; // Value of the tick label that was clicked.
  event?: PointerEvent; // Native `click` event data.
}
```

#### `axis-mouseenter`

Fired upon a chart axis tick [mouseenter](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event).

##### Payload

```ts
p: {
  index: number | null; // Index of the axis tick that was moused over.
  value?: number | string; // Value of the tick label that was moused over.
  event?: MouseEvent; // Native `mouseenter` event data.
}
```

#### `axis-mouseleave`

Fired upon a chart axis tick [mouseleave](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event).

##### Payload

None.

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

#### `chart-click`

Fired upon clicking the chart.

##### Payload

```ts
p: PointerEvent; // Native `click` event data.
```

#### `chart-mouseenter`

Fired upon a chart [mouseenter](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event).

##### Payload

```ts
p: PointerEvent; // Native `mouseenter` event data.
```

#### `chart-mouseleave`

Fired upon a chart [mouseleave](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event).

##### Payload

None.

#### `data-changed`

Fired upon a chart receiving new data.

##### Payload

```ts
p: {
  newValue: Data; // The new chart data.
  oldValue: Data | null; // The previous chart data.
}
```

#### `labels-changed`

Fired upon a chart receiving new labels.

##### Payload

```ts
p: {
  newValue: Array<string>; // The new chart labels.
  oldValue: Array<string> | null; // The previous chart labels.
}
```

#### `legend-click`

Fired upon a chart legend item click.

##### Payload

```ts
p: {
  index: number; // Index of the clicked item dataset.
  dataset: InternalDataset<DatasetValueObject>; // The dataset of the item clicked.
  event: PointerEvent; // Native `click` event data.
}
```

#### `legend-mouseenter`

Fired upon a chart legend item [mouseenter](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event).

##### Payload

```ts
p: {
  index: number; // Index of the clicked item dataset.
  dataset: InternalDataset<DatasetValueObject>; // The dataset of the item clicked.
  event: MouseEvent; // Native `mouseenter` event data.
}
```

#### `mouseleave`

Fired upon a chart legend group [mouseleave](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event).

##### Payload

None.

#### `line-click`

Fired upon clicking a line in a Line chart.

##### Payload

```ts
p: {
  index: number; // Index of the line that was clicked.
  datasetIndex: number; // Index of the dataset of which the line that was clicked belongs.
  event: PointerEvent; // Native `click` event data.
}
```

#### `point-click`

Fired upon clicking a point in a Line chart.

##### Payload

```ts
p: {
  index: number; // Index of the point that was clicked.
  datasetIndex: number; // Index of the dataset of which the point that was clicked belongs.
  event: PointerEvent; // Native `click` event data.
}
```

#### `rendered`

Fired upon chart initial render.

##### Payload

None.

#### `resize`

Fired when the chart container receives new dimensions.

##### Payload

```ts
p: {
  width: number;        // The SVG container's width.
  height: number;       // The SVG container's height.
  outerWidth?: number;  // The chart element's width.
  outerHeight?: number; // The chart element's height.
} // ContainerSize
```

#### `tooltip-opened`

Fired upon a chart tooltip's initial render.

##### Payload

```ts
p: {
  index: number; // Index of the data the tooltip is attached to.
  targetElement: Element; // The tooltip's `targetElement` prop value.
}
```

#### `tooltip-moved`

Fired upon a chart tooltip;s `targetElement` change.

##### Payload

```ts
p: {
  index: number; // Index of the data the tooltip is attached to.
  targetElement: Element; // The tooltip's new `targetElement` prop value.
}
```

#### `tooltip-closed`

Fired upon a chart tooltip's unmount.

##### Payload

None.

#### `node-click`

Fired upon clicking a node in an Alluvial diagram.

##### Payload

```ts
p: {
  node: SankeyNode<SankeyNodeProps, SankeyLinkProps>; // The clicked node.
  event: PointerEvent; // Native `click` event data.
}
```

#### `node-mouseenter`

Fired upon an Alluvial diagram node [mouseenter](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event).

##### Payload

```ts
p: {
  node: SankeyNode<SankeyNodeProps, SankeyLinkProps>; // The node moused over.
  event: MouseEvent; // Native `mouseenter` event data.
}
```

#### `node-mouseleave`

Fired upon an Alluvial diagram node [mouseleave](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event).

##### Payload

```ts
p: {
  node: SankeyNode<SankeyNodeProps, SankeyLinkProps>; // The node previously hovered.
  event: MouseEvent; // Native `mouseleave` event data.
}
```

#### `link-click`

Fired upon clicking a link in an Alluvial diagram.

##### Payload

```ts
p: {
  link: SankeyLink<SankeyNodeProps, SankeyLinkProps>; // The clicked link.
  event: PointerEvent; // Native `click` event data.
}
```

#### `link-mouseenter`

Fired upon an Alluvial diagram link [mouseenter](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event).

##### Payload

```ts
p: {
  link: SankeyLink<SankeyNodeProps, SankeyLinkProps>; // The link moused over.
  event: MouseEvent; // Native `mouseenter` event data.
}
```

#### `link-mouseleave`

Fired upon an Alluvial diagram link [mouseleave](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event).

##### Payload

```ts
p: {
  link: SankeyLink<SankeyNodeProps, SankeyLinkProps>; // The link previously hovered.
  event: MouseEvent; // Native `mouseleave` event data.
}
```

#### `hovered-index-changed`

Fired whenever the hovered index changes. This occurs when the cursor is moved between the groups or as the user moves the cursor over the ticks on the line of chart axis.

##### Payload

```ts
p: {
  oldIndex: number; // The index of the previously hovered.
  newIndex: number; // The index of the currently hovered.
}
```

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
