Draws a line based on a provided SVG path definition. The component also provides properties to customize the line drawn.

## Usage

### Importing

```ts
import { LumeLine } from '@adyen/lume';
```

### Basic use

To show a line, provide a `pathDefinition` property.

```html
<lume-line :path-definition="pathDefinition" />
```

## API

### Props

| Name                | Type               | Default  | Description                                                                                         |
| ------------------- | ------------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `pathDefinition`    | `Computed<string>` | Required | A string representing a path that can be fed into the `d` attribute of an SVG `path`element.        |
| `width`             | `number`           | `2`      | Indicating the stroke width of the line.                                                            |
| `color`             | `string`           | `'01'`   | Indicating what color to use, representing an index to one of the available Lume colors.            |
| `dashed`            | `boolean`          | `false`  | Indicating whether or not this line should be displayed as dashed or solid.                         |
| `transition`        | `boolean`          | `true`   | Indicating whether or not this line should animate.                                                 |
| `animationDelay`    | `number`           | `0`      | A value in seconds for the transition delay. Useful when animating a line composed of many `path`s. |
| `animationDuration` | `number`           | `0.2`    | A value in seconds for the transition duration.                                                     |

NOTE: A composable `useLineValues` exists to convert indices and values along with their scales to path definitions. For an example of how to use this, see `LumeLineGroup`.

### Events

#### `click`

Fired upon line path click.

##### Payload

```ts
p: PointerEvent;
```
