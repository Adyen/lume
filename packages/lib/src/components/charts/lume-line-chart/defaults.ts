import type { LineChartOptions } from '@/types/options';
import { DEFAULT_MARGINS } from '@/utils/margins';

export const options: LineChartOptions = {
  margins: DEFAULT_MARGINS.VERTICAL,
  startOnZero: true,
  withTooltip: true,
  xAxisOptions: {},
  yAxisOptions: { gridLines: true },
};
