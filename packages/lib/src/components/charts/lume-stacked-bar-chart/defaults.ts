import { ORIENTATIONS } from '@/utils/constants';
import { DEFAULT_MARGINS } from '@/utils/margins';

export const options = {
  [ORIENTATIONS.VERTICAL]: {
    withTooltip: true,
    xAxisOptions: {},
    yAxisOptions: { gridLines: true },
    margins: DEFAULT_MARGINS.VERTICAL,
    tooltipOptions: { inverse: true },
  },
  [ORIENTATIONS.HORIZONTAL]: {
    withTooltip: true,
    xAxisOptions: { gridLines: true },
    yAxisOptions: { gridLines: false },
    margins: DEFAULT_MARGINS.HORIZONTAL,
    tooltipOptions: { position: 'right', inverse: true },
  },
};
