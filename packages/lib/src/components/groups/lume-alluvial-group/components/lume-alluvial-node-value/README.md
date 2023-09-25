# Node value

A simple, wrapper component for the alluvial node value.

## Usage

### Importing

```ts
import { LumeAlluvialNodeValue } from '@adyen/lume';
```

### Basic use

To overwrite the default node value, add your content to the respective `node-text-{NODE_ID}` slot of LumeAlluvialDiagram:

```html
<lume-alluvial-diagram>
  <template #node-text-myNode>
    <lume-alluvial-node-value> Custom value </lume-alluvial-node-value>
  </template>
</lume-alluvial-diagram>
```

## API

### Props

No props.
