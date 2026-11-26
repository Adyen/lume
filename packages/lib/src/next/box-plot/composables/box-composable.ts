import { computed, type ComputedRef, type PropType } from 'vue';
import type { Data } from '@/types/dataset';
import { scaleBand, scaleLinear } from 'd3';
import { ascending, quantile } from 'd3';
import type { Options } from '@/types/options';
import { PADDING_VERTICAL } from '@/utils/constants';

export const withData = () => ({
    data: {
        type: Array as PropType<Data<number>>,
        default: () => [],
    },
});

export function useBoxComputations(
    data: Data<number>,
    containerSize: { width: number; height: number },
    allOptions: ComputedRef<Options>
) {
    const domain = computed(() => {
        return data.map(ele => ele.legend);
    });

    const values = computed(() => {
        return data.map(ele => ele.values).reduce((acc, record) => [...acc, ...record]);
    });

    const padding = computed(() => (allOptions.value?.padding as number) ?? PADDING_VERTICAL);

    const xScale = computed(() => {
        return scaleBand()
            .range([0, containerSize.width])
            .domain(domain.value)
            .paddingInner(padding.value)
            .paddingOuter(padding.value / 2);
    });

    const boxPadding = computed(() => (xScale.value ? xScale.value.step() - xScale.value.bandwidth() : 0));

    const yScale = computed(() => {
        return scaleLinear()
            .domain([0.8 * Math.min(...values.value), 1.1 * Math.max(...values.value)])
            .range([containerSize.height, 0]);
    });

    const quantiles = computed(() => {
        // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
        return data.map(ele => {
            const q1 = quantile(ele.values.sort(ascending), 0.25);
            const median = quantile(ele.values.sort(ascending), 0.5);
            const q3 = quantile(ele.values.sort(ascending), 0.75);
            const interQuantileRange = q3 - q1;
            const min = q1 - 1.5 * interQuantileRange;
            const max = q3 + 1.5 * interQuantileRange;
            return {
                key: ele.legend,
                color: ele.color,
                q1,
                median,
                q3,
                interQuantileRange,
                min,
                max,
            };
        });
    });

    const boxGroups = computed(() => {
        const boxWidth = xScale.value?.bandwidth() || 0;
        return quantiles.value.map(item => ({
            quantile: {
                '25th percentile': item.q1.toFixed(2),
                '75th percentile': item.q3.toFixed(2),
                'Inter quantile range': item.interQuantileRange.toFixed(2),
                Median: item.median.toFixed(2),
                Minimum: item.min.toFixed(2),
                Maximum: item.max.toFixed(2),
            },
            verticalLine: {
                x1: xScale.value(item.key) + boxWidth / 2,
                x2: xScale.value(item.key) + boxWidth / 2,
                y1: yScale.value(item.min),
                y2: yScale.value(item.max),
            },
            box: {
                x: xScale.value(item.key),
                y: yScale.value(item.q3),
                height: yScale.value(item.q1) - yScale.value(item.q3),
                width: boxWidth,
            },
            medianLine: {
                x1: xScale.value(item.key),
                x2: xScale.value(item.key) + boxWidth,
                y1: yScale.value(item.median),
                y2: yScale.value(item.median),
            },
            key: item.key,
            color: item.color,
        }));
    });

    const yAxisLabel = computed(() => {
        if (allOptions.value.yAxisOptions?.withLabel === false) {
            return undefined;
        }
        return allOptions.value.yAxisOptions?.label;
    });

    return {
        domain,
        boxPadding,
        xScale,
        yScale,
        quantiles,
        boxGroups,
        yAxisLabel,
    };
}
