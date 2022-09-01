import type { Ref } from 'vue';

import { AxisOptions } from '@/mixins/options';
import { Scale } from '@/mixins/scales';
import { ContainerSize } from '@/types/size';

export type AxisMixinFunction = (
  value?: string | number
) => Record<string, string | number>;

export type AxisMixin = (
  scale: Ref<Scale>,
  containerSize: Ref<ContainerSize>,
  options: Ref<AxisOptions>
) => Record<string, AxisMixinFunction>;
