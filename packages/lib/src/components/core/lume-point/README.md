# Point

A point draws a circle to highlight data, like when a user hover their mouse over a point on a line graph.

## Usage

### Importing

```ts
import { LumePoint } from '@adyen/lume';
```

### Basic use

To show a point, provide `x`, `y`, `color` and `active` properties

```html
<lume-point
  :x="100"
  :y="200"
  :color="dataset.color"
  :active="isPointActive(index)"
/>
```

## API

### Props

| Name     | Type      | Default  | Description                                                                                 |
| -------- | --------- | -------- | ------------------------------------------------------------------------------------------- |
| `x`      | `number`  | Required | The horizontal coordinate to position the point.                                            |
| `y`      | `number`  | Required | The bertical coordinate to position the point.                                              |
| `color`  | `string`  | `01`     | Indicating what color to use, representing an index to one of the available Lume colors.    |
| `radius` | `number`  | `4`      | The radius (in pixels) of the point. If accompanying a line, should double its width value. |
| `active` | `boolean` | `false`  | Indicating whether or not this point is active or not.                                      |

### Events

#### `click`

Fired upon point circle click.

##### Payload

```ts
p: PointerEvent;
```
