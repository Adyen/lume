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
  :path-definition="pathDefinition"
  :x-scale="xScale"
/>
```

## API

### Props

| Name             | Type                                            | Default  | Description                                                                                  |
| ---------------- | ----------------------------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `pathDefinition` | `Computed<string>`                              | Required | A string representing a path that can be fed into the `d` attribute of an SVG `path`element. |
| `xScale`         | `ScaleGenerator or ScaleLinear<number, number>` | Required | A d3 scale or a scale generator function to override the default Y scale.                    |
| `color`          | `string`                                        | `'01'`   | Indicating what color to use, representing an index to one of the available Lume colors.     |
| `width`          | `number`                                        | `2`      | Indicating the stroke width of the line.                                                     |
| `dashed`         | `boolean`                                       | `false`  | Indicating whether or not this line should be displayed as dashed or solid.                  |
| `transition`     | `boolean`                                       | `true`   | Indicating whether or not this line should animate.                                          |

NOTE: A composable `useLineValues` exists to convert indices and values along with their scales to path definitions. For an example of how to use this, see `LumeLineGroup`.
