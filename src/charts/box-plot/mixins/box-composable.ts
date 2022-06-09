import {computed, ComputedRef, PropType} from '@vue/composition-api';
import { Data } from '@/types/dataset';
import {scaleBand, scaleLinear} from "d3-scale";
import { quantile, ascending } from 'd3-array';
import { Options } from '@/mixins/options';

export const withData = () => ({
    data: {
        type: Array as PropType<Data<number>>,
        default: () => []
    }
});

export function useBoxComputations(
    data: Data<number>,
    containerSize: { width: number, height: number },
    allOptions: ComputedRef<Options>
) {
    const domain = computed(() => {
        return data.map(ele => ele.legend);
    });

    const values = computed(() => {
        return data
            .map(ele => ele.values)
            .reduce((acc, record) => [...acc, ...record]);
    });

    const boxWidth = computed(() => {
        return containerSize.width / (1.3 * domain.value.length);
    });

    const xScale = computed(() => {
        return scaleBand()
            .range([0, containerSize.width])
            .domain(domain.value)
            .paddingInner(1)
            .paddingOuter(0.5);
    });

    const yScale = computed(() => {
        return scaleLinear()
            .domain([
                0.8 * Math.min(...values.value),
                1.1 * Math.max(...values.value),
            ])
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
                key: ele.legend, color: ele.color, q1, median, q3, interQuantileRange, min, max
            }
        });
    });

    const boxGroups = computed(() => {
        return quantiles.value.map((quantile) => ({
            quantile: {
                '25th percentile': quantile.q1.toFixed(2),
                '75th percentile': quantile.q3.toFixed(2),
                'Inter quantile range':quantile.interQuantileRange.toFixed(2),
                'Median': quantile.median.toFixed(2),
                'Minimum': quantile.min.toFixed(2),
                'Maximum': quantile.max.toFixed(2)
            },
            verticalLine: {
                x1: xScale.value(quantile.key),
                x2: xScale.value(quantile.key),
                y1: yScale.value(quantile.min),
                y2: yScale.value(quantile.max),
            },
            box: {
                x: xScale.value(quantile.key) - boxWidth.value / 2,
                y: yScale.value(quantile.q3),
                height: yScale.value(quantile.q1) - yScale.value(quantile.q3),
                width: boxWidth.value,
            },
            medianLine: {
                x1: xScale.value(quantile.key) - boxWidth.value / 2,
                x2: xScale.value(quantile.key) + boxWidth.value / 2,
                y1: yScale.value(quantile.median),
                y2: yScale.value(quantile.median),
            },
            key: quantile.key,
            color: quantile.color
        }));
    });

    const yAxisLabel = computed(() => {
        if (allOptions.value.yAxisOptions?.withLabel === false) return;
        return allOptions.value.yAxisOptions?.label;
    });

    return { domain, boxWidth, xScale, yScale, quantiles, boxGroups, yAxisLabel }
}