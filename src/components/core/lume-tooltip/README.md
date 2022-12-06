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

To show a tooltip, provide a `targetElement` and an array of `items`.

```html
<lume-tooltip
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
  <template #tooltip="{ data, hoveredIndex }">
    <lume-tooltip :items="myCustomItemsFunction(data, hoveredIndex)" />
  </template>
</lume-line-chart>
```

## API

### Props

| Name               | Type                 | Default  | Description                                                    |
| ------------------ | -------------------- | -------- | -------------------------------------------------------------- |
| `targetElement`    | `Element`            | Required | A DOM element to attach to.                                    |
| `items`            | `Array<TooltipItem>` | Required | An array of items to display.                                  |
| `position`         | `string`             | `"auto"` | Where the tooltip should be positioned relative to its target. |
| `fixedPositioning` | `boolean`            | `false`  | If true, it will use fixed positioning instead of absolute.    |
| `modifiers`        | `Array<Modifier>`    | `null`   | A list of modifiers for Popper.                                |
| `title`            | `string`             | `null`   | The tooltip title.                                             |

**Note**: the `position` prop only accepts valid placements. These are specified [here](https://popper.js.org/docs/v2/constructors/#options).
**Note**: You can find more information about modifiers [here](https://popper.js.org/docs/v2/modifiers/).

### Tooltip options

Interface: `TooltipOptions`

| Name             | Type                                                     | Description                                                                                                                             |
| ---------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| offset           | `number`                                                 | Distance between the tooltip and its target element.                                                                                    |
| position         | `string`                                                 | Where the tooltip should be positioned relative to its target.                                                                          |
| showTitle        | `boolean`                                                | Controls if the tooltip title should be displayed.                                                                                      |
| targetElement    | `Element`                                                | A DOM element to attach to.                                                                                                             |
| fixedPositioning | `boolean`                                                | If true, it will use fixed positioning instead of absolute.                                                                             |
| valueFormat      | `string \| (tick: number \| string) => number \| string` | A format specifier string for [d3-format](https://github.com/d3/d3-format) or a formatting function.                                    |
| summary          | `string`                                                 | Descriptive text shown above the tooltip items. If a tooltip item is marked with `isSummary`, it will have precedence over this option. |

**Note**: Component properties have precedence over options. For instance, if you set the `targetElement` prop and the `targetElement` tooltip option, the first will be used. They're both there to cover different use cases.
