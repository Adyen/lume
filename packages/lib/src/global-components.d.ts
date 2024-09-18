/**
 * This file is used to add intellisense for components in VsCode.
 * @see https://github.com/vuejs/language-tools/blob/d8ed4c08389771668b6bb13b77e0c0965cc0e3df/extensions/vscode/README.md?plain=1#L87
 */

import {
    LumeAlluvialDiagram,
    LumeBarChart,
    LumeSingleBarChart,
    LumeGroupedBarChart,
    LumeStackedBarChart,
    LumeLineChart,
    LumeSparklineChart,
    LumeAxis,
    LumeChart,
    LumeChartContainer,
    LumeChartLegend,
    LumeTooltip,
    LumeTooltipItem,
    LumeTooltipSummary,
    LumeTooltipTitle,
    LumeBar,
    LumeLine,
    LumePoint,
    LumeAlluvialGroup,
    LumeAlluvialNodeLabel,
    LumeAlluvialNodeValue,
    LumeAlluvialNodeHeader,
    LumeBarGroup,
    LumeLineGroup,
    LumeOverlayGroup
} from './index';

declare module 'vue' {
    export interface GlobalComponents {
        LumeAlluvialDiagram: typeof LumeAlluvialDiagram;
        LumeBarChart: typeof LumeBarChart;
        LumeSingleBarChart: typeof LumeSingleBarChart;
        LumeGroupedBarChart: typeof LumeGroupedBarChart;
        LumeStackedBarChart: typeof LumeStackedBarChart;
        LumeLineChart: typeof LumeLineChart;
        LumeSparklineChart: typeof LumeSparklineChart;
        LumeAxis: typeof LumeAxis;
        LumeChart: typeof LumeChart;
        LumeChartContainer: typeof LumeChartContainer;
        LumeChartLegend: typeof LumeChartLegend;
        LumeTooltip: typeof LumeTooltip;
        LumeTooltipItem: typeof LumeTooltipItem;
        LumeTooltipSummary: typeof LumeTooltipSummary;
        LumeTooltipTitle: typeof LumeTooltipTitle;
        LumeBar: typeof LumeBar;
        LumeLine: typeof LumeLine;
        LumePoint: typeof LumePoint;
        LumeAlluvialGroup: typeof LumeAlluvialGroup;
        LumeAlluvialNodeLabel: typeof LumeAlluvialNodeLabel;
        LumeAlluvialNodeValue: typeof LumeAlluvialNodeValue;
        LumeAlluvialNodeHeader: typeof LumeAlluvialNodeHeader;
        LumeBarGroup: typeof LumeBarGroup;
        LumeLineGroup: typeof LumeLineGroup;
        LumeOverlayGroup: typeof LumeOverlayGroup;
    }
}
