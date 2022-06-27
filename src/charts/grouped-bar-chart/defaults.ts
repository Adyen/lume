import { DEFAULT_MARGINS, ORIENTATIONS } from '@/constants';

export const config = {
  margins: DEFAULT_MARGINS.VERTICAL,
};

export const options = {
  [ORIENTATIONS.VERTICAL]: {
    showAxes: true,
    withTooltip: true,
    xAxisOptions: {},
    yAxisOptions: { gridLines: true },
  },
  [ORIENTATIONS.HORIZONTAL]: {
    showAxes: true,
    withTooltip: true,
    xAxisOptions: { gridLines: true },
    yAxisOptions: {},
  },
};
