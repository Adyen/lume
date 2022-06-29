import type { Ref } from '@vue/composition-api';

export type AxisMixinFunction = (
  value?: string | number
) => Record<string, string | number>;

export type AxisMixin = (
  scale: Ref<any>,
  containerSize: Ref<{ width: number; height: number }>
) => Record<string, AxisMixinFunction>;
