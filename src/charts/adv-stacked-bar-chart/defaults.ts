import { DEFAULT_MARGINS, ORIENTATIONS, TOOLTIP_POSITIONS } from '@/constants';

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
    yAxisOptions: { gridLines: false },
    margins: DEFAULT_MARGINS.HORIZONTAL,
    tooltipOptions: { position: TOOLTIP_POSITIONS[6] }
  },
};
