# Tooltip

A chart tooltip displays contextual extra information upon user interaction.

This component provides an implementation of the chart tooltip guidelines, along with a set of options and `<slot>`s to customize it.

Visualizations wrapped by an `LumeChart` component come with the default tooltip implementation, which shows the exact data value for each dataset in a hovered data point.

This component relies on the positioning logic from [Popper](https://popper.js.org/).

## Usage

### Importing

```ts
import { LumeTooltip } from '@adyen/lume';
```

### Basic use

To show a tooltip, provide a `targetElement`, an `opened` boolean and an array of `items`.

```html
<lume-tooltip
  :opened="true"
  :targetElement="myElementRef"
  :items="myItems"
/>
```

### Default override

If you're using `lume-tooltip` to override the default implementation present in `lume-chart`, you'll have access to several slot properties you can use to define how you want the tooltip to behave.

Here's an example of overriding the default tooltip in a `lume-line-chart`:

```html
<lume-line-chart
  :data="myData"
  :labels="myLabels"
>
  <template #tooltip="{ opened, data, hoveredIndex, targetElement }">
    <lume-tooltip
      :opened="opened"
      :items="myCustomItemsFunction(data, hoveredIndex)"
      :target-element="targetElement"
    />
  </template>
</lume-line-chart>
```

## API

### Props

| Name               | Type                 | Default  | Description                                                    |
| ------------------ | -------------------- | -------- | -------------------------------------------------------------- |
| `items`            | `Array<TooltipItem>` | Required | An array of items to display.                                  |
| `opened`           | `boolean`            | `false`  | If the tooltip is visible or not.                              |
| `targetElement`    | `Element`            | `null`   | A DOM element to attach to.                                    |
| `position`         | `string`             | `"auto"` | Where the tooltip should be positioned relative to its target. |
| `fixedPositioning` | `boolean`            | `false`  | If true, it will use fixed positioning instead of absolute.    |
| `modifiers`        | `Array<Modifier>`    | `null`   | A list of modifiers for Popper.                                |
| `title`            | `string`             | `null`   | The tooltip title.                                             |
| `inverse`          | `boolean`            | `false`  | If true, the tooltip items will be in inverse order.           |

**Note**: the `position` prop only accepts valid placements. These are specified [here](https://popper.js.org/docs/v2/constructors/#options).
**Note**: You can find more information about modifiers [here](https://popper.js.org/docs/v2/modifiers/).

### Tooltip options

Interface: `TooltipOptions`

| Name              | Type                                                     | Description                                                                                                                             |
| ----------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| offset            | `number`                                                 | Distance between the tooltip and its target element.                                                                                    |
| position          | `string`                                                 | Where the tooltip should be positioned relative to its target.                                                                          |
| showTitle         | `boolean`                                                | Controls if the tooltip title should be displayed.                                                                                      |
| targetElement     | `Element`                                                | A DOM element to attach to.                                                                                                             |
| fixedPositioning  | `boolean`                                                | If true, it will use fixed positioning instead of absolute.                                                                             |
| valueFormat       | `string \| (tick: number \| string) => number \| string` | A format specifier string for [d3-format](https://github.com/d3/d3-format) or a formatting function.                                    |
| summary           | `string`                                                 | Descriptive text shown above the tooltip items. If a tooltip item is marked with `isSummary`, it will have precedence over this option. |
| withPointerEvents | `boolean`                                                | If true, it will listen to the attached events on elements in the tooltip content.                                                      |
| inverse           | `boolean`                                                | If true, the tooltip items will be in inverse order.                                                                                    |

**Note**: Component properties have precedence over options. For instance, if you set the `targetElement` prop and the `targetElement` tooltip option, the first will be used. They're both there to cover different use cases.

### Slot props

#### `title`

Slot for the tooltip header section.

No props.

#### `summary`

Slot for the tooltip summary item. Content of this slot should have a `<li>` element at its root.

No props.

#### `items`

Slot for the tooltip items. Content of this slot should be one or more `<li>` elements.

No props.

### Events

#### `opened`

Fired upon tooltip initial render.

##### Payload

```ts
p: Element; // The tooltip's `targetElement` prop value.
```

#### `moved`

Fired upon tooltip `targetElement` change.

##### Payload

```ts
p: Element; // The tooltip's new `targetElement` prop value.
```

#### `closed`

Fired upon tooltip unmount.

### `tooltip-mouseenter`

Fired upon mouse entering the lume tooltip.

### `tooltip-mouseleave`

Fired upon mouse leaving the lume tooltip.

##### Payload

None.
