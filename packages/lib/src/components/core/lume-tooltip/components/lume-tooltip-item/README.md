# Tooltip item

A simple, wrapper component for tooltip list items.

## Usage

### Importing

```ts
import { LumeTooltipItem } from '@adyen/lume';
```

### Basic use

To overwrite the default item list, add your own list of tooltip items to the `items` slot of LumeTooltip:

```html
<lume-tooltip>
  <template #items>
    <lume-tooltip-item color="violet">
      <template #label> My custom item </template>
      <template #value> 123 </template>
    </lume-tooltip-item>
  </template>
</lume-tooltip>
```

## API

### Props

| Name    | Type     | Default | Description                                                                          |
| ------- | -------- | ------- | ------------------------------------------------------------------------------------ |
| `color` | `string` | `null`  | The color for the item symbol. If not provided, the item will not render the symbol. |

### Slot props

#### `label`

Slot for the label part of the item.

No props.

#### `value`

Slot for the value part of the item.

No props.
