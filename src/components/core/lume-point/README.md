# Point

A point draws a circle to highlight data, like when a user hover their mouse over a point on a line graph.

## Usage

### Importing

```ts
import { LumePoint } from '@adyen/lume';
```

### Basic use

To show a point, provide `xScale`, `yScale`, `value`, `index`, `color` and `active` properties

```html
<lume-tooltip
  :x-scale="xScale"
  :y-scale="yScale"
  :value="getPointValue(index, dataset.values)"
  :index="index"
  :color="dataset.color"
  :active="isPointActive(index)"
/>
```

## API

### Props

| Name     | Type                                            | Default  | Description                                                                               |
| -------- | ----------------------------------------------- | -------- | ----------------------------------------------------------------------------------------- |
| `xScale` | `ScaleGenerator or ScaleLinear<number, number>` | Required | A d3 scale or a scale generator function to override the default Y scale.                 |
| `yScale` | `ScaleGenerator or ScaleLinear<number, number>` | Required | A d3 scale or a scale generator function to override the default Y scale.                 |
| `value`  | `number`                                        | Required | The value with which to determine the location on the value scale.                        |
| `index`  | `number`                                        | Required | The index in the array of values with which to determine the location on the label scale. |
| `color`  | `string`                                        | `01`     | Indicating what color to use, representing an index to one of the available Lume colors.  |
| `active` | `boolean`                                       | `false`  | Indicating whether or not this point is active or not.                                    |
