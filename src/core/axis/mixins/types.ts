import type { Ref } from '@vue/composition-api';
import { AxisOptions } from '@/mixins/options';

export type AxisMixinFunction = (
  value?: string | number
) => Record<string, string | number>;

export type AxisMixin = (
  scale: Ref<any>,
  containerSize: Ref<{ width: number; height: number }>,
  options: Ref<AxisOptions>
) => Record<string, AxisMixinFunction>;
