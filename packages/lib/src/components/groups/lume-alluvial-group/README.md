# Alluvial group

The alluvial group component is in charge of transforming data into nodes and links representation. It's the component that renders nodes and links connecting those nodes.

## Usage

### Importing

```ts
import { LumeAlluvialGroup } from '@adyen/lume';
```

### Basic use

To generate a simple alluvial group with default settings, simply pass the `data` prop.

```html
<template>
  <lume-alluvial-group :data="data" />
</template>

<script
  lang="ts"
  setup
>
  import { LumeAlluvialGroup } from '@adyen/lume';
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
            { node: 'F', value: 1 },
          ],
        },
        {
          label: 'B',
          color: '02',
          value: 'B',
          targets: [
            { node: 'D', value: 45 },
            { node: 'E', value: 102 },
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
          deriveColorFromIncomingLinks: true,
        },
        {
          label: 'E',
          value: 'E',
          color: '06',
        },
        { label: 'F', value: 'F', color: '08' },
      ],
    },
  ]);
</script>
```

## API

### Props

| Name               | Type      | Default     | Description                                                                                                                                                                                                                         |
| ------------------ | --------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | --- |
| `data`             | `Data`    | Required    | The data to plot.                                                                                                                                                                                                                   |
| `options`          | `Options` | `undefined` | A set of chart options. Refer to the ChartOptions in `LumeChart`'s documentation for default chart options and for additional alluvial diagram options, refer to `AlluvialDiagramOptions` in `LumeAlluvialDiagram`'s documentation' |
| `hoveredElementId` | `number   | string`     | `-1`                                                                                                                                                                                                                                | Id of the link or node element that has to be hovered. |     |

### Events

### `node-click`

Fired upon clicking a node in an Alluvial diagram.

##### Payload

```ts
p: {
  node: SankeyNode<SankeyNodeProps, SankeyLinkProps>; // The clicked node.
  event: PointerEvent; // Native `click` event data.
}
```

#### `node-mouseenter`

Fired upon an Alluvial diagram node [mouseenter](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event).

##### Payload

```ts
p: {
  node: SankeyNode<SankeyNodeProps, SankeyLinkProps>; // The node moused over.
  event: MouseEvent; // Native `mouseenter` event data.
}
```

#### `node-mouseleave`

Fired upon an Alluvial diagram node [mouseleave](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event).

##### Payload

```ts
p: {
  node: SankeyNode<SankeyNodeProps, SankeyLinkProps>; // The node previously hovered.
  event: MouseEvent; // Native `mouseleave` event data.
}
```

#### `link-click`

Fired upon clicking a link in an Alluvial diagram.

##### Payload

```ts
p: {
  link: SankeyLink<SankeyNodeProps, SankeyLinkProps>; // The clicked link.
  event: PointerEvent; // Native `click` event data.
}
```

#### `link-mouseenter`

Fired upon an Alluvial diagram link [mouseenter](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event).

##### Payload

```ts
p: {
  link: SankeyLink<SankeyNodeProps, SankeyLinkProps>; // The link moused over.
  event: MouseEvent; // Native `mouseenter` event data.
}
```

#### `link-mouseleave`

Fired upon an Alluvial diagram link [mouseleave](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event).

##### Payload

```ts
p: {
  link: SankeyLink<SankeyNodeProps, SankeyLinkProps>; // The link previously hovered.
  event: MouseEvent; // Native `mouseleave` event data.
}
```
