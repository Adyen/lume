# Node label

A simple, wrapper component for the alluvial node label.

## Usage

### Importing

```ts
import { LumeAlluvialNodeLabel } from '@adyen/lume';
```

### Basic use

To overwrite the default node label, add your content to the respective `node-text-{NODE_ID}` slot of LumeAlluvialDiagram:

```html
<lume-alluvial-diagram>
  <template #node-text-myNode>
    <lume-alluvial-node-label> Custom label </lume-alluvial-node-label>
  </template>
</lume-alluvial-diagram>
```

## API

### Props

No props.
