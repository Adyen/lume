# Alluvial diagram

Alluvial diagram shows you the flow of aggregated units from one group to the next.

## Usage

### Importing

```ts
import { LumeAlluvialDiagram } from '@adyen/lume';
```

### Basic use

To generate a simple alluvial diagram with default settings, simply pass the `data` and `labels` props.

```html
<template>
  <lume-alluvial-diagram
    :data="data"
    :labels="labels"
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
          color: 'skyblue',
          value: 'A',
          targets: [
            { node: 'D', value: 15 },
            { node: 'E', value: 42 },
            { node: 'G', value: 1 },
          ],
        },
        {
          label: 'B',
          color: 'royalblue',
          value: 'B',
          targets: [
            { node: 'D', value: 45 },
            { node: 'E', value: 42 },
          ],
        },
        {
          label: 'C',
          color: 'violet',
          value: 'C',
          targets: [{ node: 'D', value: 20 }],
        },
        {
          label: 'D',
          value: 'D',
          color: 'darkteal',
        },
        {
          label: 'E',
          value: 'E',
          color: 'gold',
        },
        { label: 'G', value: 'G', color: 'skyblue' },
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
