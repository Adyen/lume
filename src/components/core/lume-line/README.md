# Line

Draws a line between two points based on two scales, two specified values for the value scale and an index for the label scale. It will draw from the index - 1 point to the index point, so be sure to also specify the values as `[values[index - 1], values[index]]`.

## Usage

### Importing

```ts
import { LumeLine } from '@adyen/lume';
```

### Basic use

To show a point, provide `xScale`, `yScale`, `ìndex`, `values`, `color`, `dashed` and `transition` properties

```html
<lume-line
  :x-scale="xScale"
  :y-scale="yScale"
  :values="values"
  :index="index"
  :color="color"
  :dashed="isDashed(index)"
  :transition="transition"
/>
```

## API

### Props

| Name         | Type                                            | Default  | Description                                                                                                                       |
| ------------ | ----------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `xScale`     | `ScaleGenerator or ScaleLinear<number, number>` | Required | A d3 scale or a scale generator function to override the default Y scale.                                                         |
| `yScale`     | `ScaleGenerator or ScaleLinear<number, number>` | Required | A d3 scale or a scale generator function to override the default Y scale.                                                         |
| `values`     | `Array<number>`                                 | Required | The values with which to determine the location on the value scale. Values should be relative to index -1 and index respectively. |
| `index`      | `number`                                        | Required | The index with which to determine the location based on the label scale.                                                          |
| `color`      | `string`                                        | `01`     | Indicating what color to use, representing an index to one of the available Lume colors.                                          |
| `dashed`     | `boolean`                                       | `false`  | Indicating whether or not this line should be displayed as dashed or solid.                                                       |
| `transition` | `boolean`                                       | `true`   | Indicating whether or not this line should animate.                                                                               |
