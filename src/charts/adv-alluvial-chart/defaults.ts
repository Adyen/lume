import { sankeyJustify } from 'd3-sankey';
import { DEFAULT_MARGINS } from '@/constants';

export const baseData = {
  values: [],
  nodePadding: 0,
  nodeWidth: 15,
  nodeAlign: sankeyJustify,
  valueFormatter: (value: number) => String(value),
};

export const options = {
  margins: DEFAULT_MARGINS.VERTICAL,
  showAxes: false,
  withTooltip: false,
  withHover: false,
  withLegend: false,
};

export const BASE_INSTANCE = {
  highlightedLink: null,
  highlightedNode: null,
  leftExtent: 0,
  rightExtent: 0,
  topExtent: 0,
  bottomExtent: 0,
  nodeBlocks: [],
  linkPaths: [],
};

export const transitionDuration = 200;
export const defaultChartColor = '03';
export const nodeToLabelGap = 6;
export const ghostStrokeWidthOffset = 25;
