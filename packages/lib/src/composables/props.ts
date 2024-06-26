import { PropType } from 'vue';

import { DataValidator, withBase } from './base';
import { withOptions } from './options';
import { withScales } from './scales';

import { ORIENTATIONS } from '@/utils/constants';
import type { ChartOptions, Options } from '@/types/options';
import type { Orientation } from '@/types/utils';

export function orientationValidator(orientation: string): boolean {
  return Object.values(ORIENTATIONS).includes(orientation as Orientation);
}

export const withChartProps = <T extends Options = ChartOptions>(
  dataValidator?: DataValidator,
  withOrientation = true
) => ({
    ...withBase(dataValidator),
    ...withScales(),
    ...withOptions<T>(),
    classList: {
      type: [String, Array] as PropType<string | Array<string>>,
      default: () => [],
    },
    hoveredIndex: {
      type: Number,
      default: null,
    },
    ...(withOrientation
      ? {
        orientation: {
          type: String as PropType<Orientation>,
          default: ORIENTATIONS.VERTICAL,
          validator: orientationValidator,
        },
      }
      : {}),
  });

export const withDiagramProps = <T extends Options = ChartOptions>(
  dataValidator?: DataValidator
) => ({
    ...withBase(dataValidator),
    ...withOptions<T>(),
    hoveredElement: {
      type: [Number, String] as PropType<number | string>,
      default: null,
    },
  });
