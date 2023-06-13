# Tooltip summary

A simple, wrapper component for the tooltip summary item.

## Usage

### Importing

```ts
import { LumeTooltipSummary } from '@adyen/lume';
```

### Basic use

To overwrite the default summary item, add your content to the `summary` slot of LumeTooltip:

```html
<lume-tooltip>
  <template #summary>
    <lume-tooltip-summary> My custom summary </lume-tooltip-summary>
  </template>
</lume-tooltip>
```

## API

### Props

No props.
