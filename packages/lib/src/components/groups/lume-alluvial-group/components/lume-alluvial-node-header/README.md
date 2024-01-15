# Node header

A simple, wrapper component for the alluvial node header.

## Usage

### Importing

```ts
import { LumeAlluvialNodeHeader } from '@adyen/lume';
```

### Basic use

To overwrite the default node header, add your content to the respective `node-header-{INDEX}` slot of LumeAlluvialDiagram:

```html
<lume-alluvial-diagram>
  <template #node-header-0>
    <lume-alluvial-node-header>
      <template #before>
        <my-custom-icon />
      </template>

      Custom header

      <template #after>
        <my-custom-icon />
      </template>
    </lume-alluvial-node-header>
  </template>
</lume-alluvial-diagram>
```

## API

### Props

| Name | Type     | Default  | Description                            |
| ---- | -------- | -------- | -------------------------------------- |
| `x`  | `number` | Required | The horizontal position of the header. |
| `y`  | `number` | Required | The vertical position of the header.   |
