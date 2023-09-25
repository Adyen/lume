import { DEFAULT_MARGINS } from '@/utils/margins';
import { LineChartOptions } from '@/composables/options';

export const options: LineChartOptions = {
  margins: DEFAULT_MARGINS.VERTICAL,
  startOnZero: true,
  withTooltip: true,
  xAxisOptions: {},
  yAxisOptions: { gridLines: true },
};
