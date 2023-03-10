import { DEFAULT_MARGINS } from '@/utils/constants';
import { ChartOptions } from '@/composables/options';

export const options: ChartOptions = {
  margins: DEFAULT_MARGINS.VERTICAL,
  startOnZero: true,
  withTooltip: true,
  xAxisOptions: {},
  yAxisOptions: { gridLines: true },
  withPoints: true,
};
