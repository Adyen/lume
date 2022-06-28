import { sankeyJustify } from 'd3-sankey';

export const alluvialDefaults = {
    values: [],
    nodePadding: 0,
    nodeWidth: 15,
    nodeAlign: sankeyJustify,
    valueFormatter: value => String(value)
}

export const transitionDuration = 200;
export const defaultChartColor = '03';
export const nodeToLabelGap = 6;
