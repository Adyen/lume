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

| Name             | Type                               | Default     | Description                                                                                                       |
| ---------------- | ---------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `data`           | `Data`                             | Required    | The data to plot.                                                                                                 |
| `labels`         | `Array<string>` or `Array<number>` | Required    | The group of labels to plot the data to.                                                                          |
| `title`          | `String`                           | `undefined` | The chart title.                                                                                                  |
| `options`        | `Options`                          | `undefined` | A set of chart options.                                                                                           |
| `hoveredElement` | `number \| string`                 | `undefined` | The index of the hovered node or link. Can be used to hover programmatically. Set to `null` to reset hover state. |

### Alluvial options

Interface: `AlluvialDiagramOptions`

| Name                | Type                                                                      | Description                                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| highlightedElements | `'full' \| 'closest' \| GetHighlightedElementsFunction`                   | Defines the diagram's hover behavior. More info below.                                                                                                                        |
| nodeAlign           | `(node: SankeyNode, n: number) => number`                                 | Defines the node alignment method. [Read more](https://github.com/d3/d3-sankey#sankey_nodeAlign)                                                                              |
| nodeHeaders         | `Array<string>`                                                           | If present, renders the provided headers on top of each node column.                                                                                                          |
| nodeHeaderPadding   | `number`                                                                  | Sets the space between the node headers and the top-most node(s).                                                                                                             |
| nodePadding         | `number`                                                                  | Sets the vertical space between nodes at each column.                                                                                                                         |
| nodeSort            | `(a: SankeyNode, b: SankeyNode) => number`                                | Defines the node sort method. [Read more](https://github.com/d3/d3-sankey#sankey_nodeSort)                                                                                    |
| nodeWidth           | `number`                                                                  | Sets the node block width.                                                                                                                                                    |
| linkSort            | `(a: SankeyLink, b: SankeyLink) => number`                                | Defines the link sort method. [Read more](https://github.com/d3/d3-sankey#sankey_linkSort)                                                                                    |
| valueFormat         | `string \| (currentValue: number, baseValue: number) => number \| string` | A format specifier string for [d3-format](https://github.com/d3/d3-format) or a formatting function. The function receives the contextual node value and the base node value. |

#### Highlighted elements

In the alluvial diagram, there are multiple possible behaviors for when you hover a node or a link. Lume provides two different behaviors, plus a way to add your own custom one.

##### `full`

When a node or link is hovered, highlight the full connecting nodes/links. This is the default behavior.

<!-- TODO: Add example image -->

##### `closest`

When a node or link is hovered, highlight only the closest nodes/links.

<!-- TODO: Add example image -->

##### Custom function

You can customize which nodes/links to highlight upon hovering by passing a `GetHighlightedElementsFunction` function in the `highlightedElements` option.

This function has two arguments: the node/link being hovered and a [graph](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/d3-sankey/index.d.ts#L172) representing the sankey layout.
It must return an object with a `nodes` map of node IDs and the value they should display, and a `links` array of link IDs. These are the nodes/links that will be highlighted when hovered.

```ts
type GetHighlightedElementsFunction = (
  element:
    | SankeyNode<SankeyNodeProps, SankeyLinkProps>
    | SankeyLink<SankeyNodeProps, SankeyLinkProps>,
  graph: SankeyGraph<SankeyNodeProps, SankeyLinkProps>
) => HighlightedElements;

interface HighlightedElements {
  nodes: { [id: string]: string | number };
  links: Array<string>;
}
```

**Note:** Link IDs follow this structure: `{SOURCE_NODE_ID} + ':' + {TARGET_NODE_ID}`
