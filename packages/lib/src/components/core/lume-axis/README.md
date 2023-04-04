# Axis

An axis is a visual representation of a scale, usually a line with reference marks called ticks. Axes can be vertical or horizontal.

This component provides an implementation of the axis guidelines, along with a set of options to customize it.

Visualizations wrapped by an `LumeChart` component come with two default axes, one for the `x` scale and another for the `y`. This can be overriden using the `"axes"` slot.

## Usage

### Importing

```ts
import { LumeAxis } from '@adyen/lume';
```

### Basic use

To generate an axis, you will need to pass in a d3 scale. It's also recommended to provide a value for `type`.

```html
<lume-axis
  type="x"
  :scale="myScale"
/>
```

## API

### Props

| Name            | Type                 | Default                   | Description                                                                    |
| --------------- | -------------------- | ------------------------- | ------------------------------------------------------------------------------ |
| `scale`         | `Scale`              | Required                  | The scale to represent.                                                        |
| `type`          | `"x" \| "y"`         | `undefined`               | The type of the axis.                                                          |
| `position`      | `"bottom" \| "left"` | `undefined`               | Where to position the axis.                                                    |
| `containerSize` | `ContainerSize`      | `{ width: 0, height: 0 }` | An object with the chart dimensions.                                           |
| `hoveredIndex`  | `number`             | `-1`                      | The index being hovered. Required if you want to enable hovering in the index. |
| `options`       | `AxisOptions`        | `{}`                      | The axis options.                                                              |

### Axis options

Interface: `AxisOptions`

| Name        | Type                                                     | Description                                                                                                                                |
| ----------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| gridLines   | `boolean`                                                | Draws the grid lines on every tick.                                                                                                        |
| withTitle   | `boolean`                                                | Renders the axis title.                                                                                                                    |
| title       | `string`                                                 | The axis title.                                                                                                                            |
| showTicks   | `boolean`                                                | Renders the tick text.                                                                                                                     |
| tickCount   | `number`                                                 | An approximate amount of ticks to draw. [Read more](https://github.com/d3/d3-array#ticks)                                                  |
| tickFormat  | `string \| (tick: number \| string) => number \| string` | A format specifier string for [d3-format](https://github.com/d3/d3-format) or a formatting function                                        |
| tickPadding | `number`                                                 | The padding between an axis label and the axis line.                                                                                       |
| skip        | `true \| number`                                         | A number of ticks to visually skip. If set to `true`, the axis will auto-skip the minimum amount of ticks to guarantee a balanced display. |

#### Default options for X axis

```ts
{
  gridLines: false,
  withTitle: false,
  showTicks: true,
  tickCount: 10,
  tickFormat: null,
  tickPadding: 8,
  skip: true,
}
```

#### Default options for Y axis

```ts
{
  gridLines: true,
  withTitle: true,
  showTicks: true,
  tickCount: 10,
  tickFormat: null,
  tickPadding: 8,
}
```

### Events

#### `click`

Fired upon axis click.

##### Payload

```ts
p: {
  index: number | null; // Index of the axis tick that was moused over.
  value: number | string; // Value of the tick label that was moused over.
  event: PointerEvent; // Native `click` event data.
}
```

#### `mouseenter`

Fired upon axis tick [mouseenter](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event).

##### Payload

```ts
p: {
  index: number | null; // Index of the axis tick that was moused over.
  value: number | string; // Value of the tick label that was moused over.
  event: MouseEvent; // Native `mouseenter` event data.
}
```

#### `mouseleave`

Fired upon axis tick [mouseleave](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event).

##### Payload

```ts
p: MouseEvent; // Native `mouseleave` event data.
```
