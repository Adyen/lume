import { PropType } from 'vue';

import { DataValidator, withBase } from './base';
import { ChartOptions, withOptions } from './options';
import { withScales } from './scales';

import { Orientation, ORIENTATIONS } from '@/constants';

function orientationValidator(orientation: string): boolean {
  return Object.values(ORIENTATIONS).includes(orientation as Orientation);
}

export const withChartProps = (dataValidator?: DataValidator) => ({
  ...withBase(dataValidator),
  ...withScales(),
  ...withOptions<ChartOptions>(),
  title: {
    type: String,
    default: null,
  },
  orientation: {
    type: String as PropType<Orientation>,
    default: ORIENTATIONS.VERTICAL,
    validator: orientationValidator,
  },
});
