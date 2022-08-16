import { PropType } from '@vue/composition-api';

import { DataValidator, withBase } from './base';
import { withOptions, ChartOptions } from './options';
import { withScales } from './scales';

import { Orientation, ORIENTATIONS } from '@/constants';

function orientationValidator(orientation: string): boolean {
  return Object.values(ORIENTATIONS).includes(orientation as Orientation);
}

export const withChartProps = (dataValidator?: DataValidator, isLabelsRequired: boolean = true) => ({
  ...withBase(dataValidator, isLabelsRequired),
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
