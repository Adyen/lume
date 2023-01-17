import { DEFAULT_MARGINS, ORIENTATIONS } from '@/utils/constants';

export const options = {
  [ORIENTATIONS.VERTICAL]: {
    withTooltip: true,
    xAxisOptions: {},
    yAxisOptions: { gridLines: true },
    margins: DEFAULT_MARGINS.VERTICAL,
  },
  [ORIENTATIONS.HORIZONTAL]: {
    withTooltip: true,
    xAxisOptions: { gridLines: true },
    yAxisOptions: { gridLines: false },
    margins: DEFAULT_MARGINS.HORIZONTAL,
  },
};
