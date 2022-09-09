import { sankeyJustify } from 'd3-sankey';

export const BASE_DATA = {
  values: [],
  nodePadding: 0,
  nodeWidth: 15,
  nodeAlign: sankeyJustify,
  valueFormatter: (value: number) => String(value),
};

export const NODE_LABEL_PADDING = 8;
