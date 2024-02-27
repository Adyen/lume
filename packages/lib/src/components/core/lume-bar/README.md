This component is meant to render bar-like elements. It is used mainly by Bar charts, but also to draw rectangle shapes, such as the gray area in a negative domain chart.

## Usage

### Importing

```ts
import { LumeBar } from '@adyen/lume';
```

### Basic use

This component essentially renders an SVG `<rect>` element. To do so, it requires a `width` and `height` value.

```html
<lume-bar
  :width="20"
  :height="80"
/>
```

## API

### Props

| Name         | Type                           | Default  | Description                                           |
| ------------ | ------------------------------ | -------- | ----------------------------------------------------- |
| `width`      | `number`                       | Required | Width of the bar.                                     |
| `height`     | `number`                       | Required | Height of the bar.                                    |
| `x`          | `number`                       | `0`      | Horizontal position of the bar.                       |
| `y`          | `number`                       | `0`      | Vertical position of the bar.                         |
| `classList`  | `string \| Array<string>`      | `""`     | A CSS class or array of classes to add to the bar.    |
| `isFaded`    | `boolean`                      | `false`  | Controls the opacity of the bar.                      |
| `isNegative` | `boolean`                      | `false`  | True if the bar is representing a negative value.     |
| `transition` | `"width" \| "height" \| false` | `false`  | Indicates which property is going to be transitioned. |

### Events

#### `click`

Fired upon bar rectangle click.

##### Payload

```ts
p: PointerEvent;
```

#### `mouseover`

Fired upon bar rectangle [mouseover](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseover_event).

##### Payload

```ts
p: MouseEvent;
```

#### `mouseleave`

Fired upon bar rectangle [mouseleave](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event).

##### Payload

```ts
p: MouseEvent; // Native `mouseleave` event data.
```
