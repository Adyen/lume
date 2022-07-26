import { DEFAULT_MARGINS, ORIENTATIONS } from '@/constants';

export const options = {
  [ORIENTATIONS.VERTICAL]: {
    showAxes: true,
    withTooltip: true,
    xAxisOptions: {},
    yAxisOptions: { gridLines: true },
    margins: DEFAULT_MARGINS.VERTICAL,
  },
  [ORIENTATIONS.HORIZONTAL]: {
    showAxes: true,
    withTooltip: true,
    xAxisOptions: { gridLines: true },
    yAxisOptions: {},
    margins: DEFAULT_MARGINS.HORIZONTAL,
  },
};
