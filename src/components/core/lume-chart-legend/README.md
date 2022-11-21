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
