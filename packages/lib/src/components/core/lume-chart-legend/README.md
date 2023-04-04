# Chart Legend

Shows a legend corresponding to the values of the chart being used

# Usage

### Importing

```ts
import { LumeChartLegend } from '@adyen/lume';
```

### Basic use

To show a the legend, provide a `data` property.

```html
<lume-chart-legend :data="data" />
```

## API

### Props

| Name   | Type                       | Default  | Description                                                          |
| ------ | -------------------------- | -------- | -------------------------------------------------------------------- |
| `data` | `Data<DatasetValueObject>` | Required | an array of records, each containing `color` and `label` properties. |

### Record structure for data

```ts
[
  {
    color: 'skyblue', // String with value 'skyblue', 'royalblue', 'violet', 'darkteal' or 'gold'
    label: 'Monday', // String
  },
];
```

### Events

#### `click`

Fired upon clicking on a legend item.

##### Payload

```ts
p: {
  index: number; // Index of the clicked item dataset.
  dataset: InternalDataset<DatasetValueObject>; // The dataset of the item clicked.
  event: PointerEvent; // Native `click` event data.
}
```

#### `mouseenter`

Fired upon a legend item [mouseenter](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event).

##### Payload

```ts
p: {
  index: number; // Index of the clicked item dataset.
  dataset: InternalDataset<DatasetValueObject>; // The dataset of the item clicked.
  event: MouseEvent; // Native `mouseenter` event data.
}
```

#### `mouseleave`

Fired upon the legend group [mouseleave](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event).

##### Payload

```ts
p: MouseEvent; // Native `mouseleave` event data.
```
