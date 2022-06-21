import { DEFAULT_MARGINS, ORIENTATIONS } from '@/constants';

export const config = {
  margins: DEFAULT_MARGINS.VERTICAL,
};

export const options = {
  [ORIENTATIONS.VERTICAL]: {
    showAxes: true,
    withPopover: true,
    xAxisOptions: {},
    yAxisOptions: { gridLines: true },
  },
  [ORIENTATIONS.HORIZONTAL]: {
    showAxes: true,
    withPopover: true,
    xAxisOptions: { gridLines: true },
    yAxisOptions: {},
  },
};
