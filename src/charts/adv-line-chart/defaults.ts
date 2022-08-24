import { DEFAULT_MARGINS } from '@/constants';
import { ChartOptions } from '@/mixins/options';

export const options: ChartOptions = {
  margins: DEFAULT_MARGINS.VERTICAL,
  showAxes: true,
  startOnZero: true,
  withTooltip: true,
  xAxisOptions: {},
  yAxisOptions: { gridLines: true },
};
