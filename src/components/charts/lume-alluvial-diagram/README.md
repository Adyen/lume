# Alluvial diagram

Alluvial diagram shows you the flow of aggregated units from one group to the next.

## Usage

### Importing

```ts
import { LumeAlluvialDiagram } from '@adyen/lume';
```

### Basic use

To generate a simple line chart with default settings, simply pass the `data` and `labels` props.

```html
<template>
  <lume-alluvial-diagram
    :data="data"
    :labels="labels"
    :color="color"
    :title="title"
    :orientation="orientation"
    :classlist="classlist"
    :x-scale="xScale"
    :y-scale="yScale"
    :options="options"
  />
</template>

<script
  lang="ts"
  setup
>
  import { ref } from 'vue';

  const data = ref([
    {
      values: [
        {
          label: 'A',
          color: '01',
          value: 'A',
          targets: [
            { node: 'D', value: 15 },
            { node: 'E', value: 42 },
            { node: 'G', value: 1 },
          ],
        },
        {
          label: 'B',
          color: '02',
          value: 'B',
          targets: [
            { node: 'D', value: 45 },
            { node: 'E', value: 42 },
          ],
        },
        {
          label: 'C',
          color: '03',
          value: 'C',
          targets: [{ node: 'D', value: 20 }],
        },
        {
          label: 'D',
          value: 'D',
          color: '07',
        },
        {
          label: 'E',
          value: 'E',
          color: '06',
        },
        { label: 'G', value: 'G', color: '08' },
      ],
      nodePadding: 20,
      nodeWidth: 16,
    },
  ]);

  const labels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May']);
</script>
```

## API

### Props

| Name      | Type                               | Default     | Description                              |
| --------- | ---------------------------------- | ----------- | ---------------------------------------- |
| `data`    | `Data`                             | Required    | The data to plot.                        |
| `labels`  | `Array<string>` or `Array<number>` | Required    | The group of labels to plot the data to. |
| `title`   | `String`                           | `undefined` | The chart title.                         |
| `options` | `Options`                          | `undefined` | A set of chart options.                  |
