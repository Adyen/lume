import { sankeyJustify } from 'd3-sankey';
import { DEFAULT_MARGINS } from "@/constants";

export const defaultProps = {
    values: [],
    nodePadding: 0,
    nodeWidth: 15,
    nodeAlign: sankeyJustify,
    valueFormatter: (value: number) => String(value)
}

export const options = {
    margins: DEFAULT_MARGINS.VERTICAL,
    showAxes: false,
    withTooltip: false,
};

export const transitionDuration = 200;
export const defaultChartColor = '03';
export const nodeToLabelGap = 6;